const cloud = require('wx-server-sdk');
const crypto = require('crypto');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const COLLECTION = 'user_images';
const MAX_IMAGES = 4;
const PENDING_EXPIRES_MS = 30 * 60 * 1000;

// 现有车库图片仅本人可见，因此默认不调用公开内容审核。
// 若未来要公开展示，把它改为 true 后重新部署；审核失败或接口异常都会阻止图片进入 ready 状态。
const PUBLIC_DISPLAY_ENABLED = false;

function getTrustedOpenId() {
  const openid = cloud.getWXContext().OPENID;
  if (!openid) {
    const error = new Error('无法获取用户身份');
    error.code = 'NO_OPENID';
    throw error;
  }
  return openid;
}

function randomString() {
  return crypto.randomBytes(8).toString('hex');
}

function normalizeExtension(extension) {
  const value = String(extension || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return ['jpg', 'jpeg', 'png', 'webp'].includes(value) ? value : 'jpg';
}

function fileIdMatchesPath(fileID, cloudPath) {
  return typeof fileID === 'string' && fileID.endsWith('/' + cloudPath);
}

function contentTypeForPath(cloudPath) {
  const ext = String(cloudPath).split('.').pop().toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
}

async function cleanupExpiredReservations(openid) {
  const expiresBefore = new Date(Date.now() - PENDING_EXPIRES_MS);
  const pending = await db.collection(COLLECTION).where({ openid, status: 'uploading' }).get();
  const expiredIds = pending.data
    .filter((item) => item.createdAt && new Date(item.createdAt).getTime() < expiresBefore.getTime())
    .map((item) => item._id);
  for (const recordId of expiredIds) {
    await db.collection(COLLECTION).doc(recordId).remove();
  }
}

async function listUserImages(event) {
  const openid = getTrustedOpenId();
  await cleanupExpiredReservations(openid);
  const allResult = await db.collection(COLLECTION)
    .where({ openid, status: 'ready' })
    .limit(MAX_IMAGES)
    .get();
  allResult.data.sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime());
  const scopeId = String(event.scopeId || '');
  const images = scopeId
    ? allResult.data.filter((item) => String(item.scopeId || '') === scopeId)
    : allResult.data;
  return {
    success: true,
    images: images.map((item) => ({
      _id: item._id,
      fileID: item.fileID,
      cloudPath: item.cloudPath,
      uploadedAt: item.uploadedAt,
      scopeId: item.scopeId || '',
      safetyStatus: item.safetyStatus || 'private',
    })),
    totalCount: allResult.data.length,
    maxCount: MAX_IMAGES,
  };
}

async function createImageUpload(event) {
  const openid = getTrustedOpenId();
  await cleanupExpiredReservations(openid);
  const extension = normalizeExtension(event.extension);
  const timestamp = Date.now();
  const cloudPath = `user-images/${openid}/${timestamp}-${randomString()}.${extension}`;
  const ownerHash = crypto.createHash('sha256').update(openid).digest('hex').slice(0, 32);
  for (let slot = 0; slot < MAX_IMAGES; slot += 1) {
    const recordId = `${ownerHash}_${slot}`;
    try {
      await db.collection(COLLECTION).add({
        data: {
          _id: recordId,
          _openid: openid,
          openid,
          fileID: '',
          cloudPath,
          uploadedAt: null,
          createdAt: db.serverDate(),
          scopeId: String(event.scopeId || ''),
          slot,
          status: 'uploading',
          safetyStatus: PUBLIC_DISPLAY_ENABLED ? 'checking' : 'private',
        },
      });
      return { success: true, recordId, cloudPath };
    } catch (error) {
      const occupied = await db.collection(COLLECTION).doc(recordId).get().then(() => true).catch(() => false);
      if (!occupied) throw error;
    }
  }
  return { success: false, code: 'LIMIT_EXCEEDED', errMsg: '每位用户最多上传4张照片' };
}

async function checkImageSafety(fileID, cloudPath) {
  if (!PUBLIC_DISPLAY_ENABLED) {
    return 'private';
  }
  const downloadResult = await cloud.downloadFile({ fileID });
  await cloud.openapi.security.imgSecCheck({
    media: {
      contentType: contentTypeForPath(cloudPath),
      value: downloadResult.fileContent,
    },
  });
  return 'passed';
}

async function finalizeImageUpload(event) {
  const openid = getTrustedOpenId();
  const recordId = String(event.recordId || '');
  const fileID = String(event.fileID || '');
  if (!recordId || !fileID) {
    return { success: false, code: 'INVALID_ARGUMENT', errMsg: '上传记录不完整' };
  }

  const recordResult = await db.collection(COLLECTION).doc(recordId).get();
  const record = recordResult.data;
  if (!record || record.openid !== openid || record.status !== 'uploading') {
    return { success: false, code: 'FORBIDDEN', errMsg: '无权保存该图片' };
  }
  if (!fileIdMatchesPath(fileID, record.cloudPath)) {
    return { success: false, code: 'PATH_MISMATCH', errMsg: '云存储路径校验失败' };
  }

  try {
    const safetyStatus = await checkImageSafety(fileID, record.cloudPath);
    await db.collection(COLLECTION).doc(recordId).update({
      data: {
        fileID,
        uploadedAt: db.serverDate(),
        status: 'ready',
        safetyStatus,
      },
    });
    return {
      success: true,
      image: {
        _id: recordId,
        fileID,
        cloudPath: record.cloudPath,
        scopeId: record.scopeId || '',
        safetyStatus,
      },
    };
  } catch (error) {
    await cloud.deleteFile({ fileList: [fileID] }).catch(() => null);
    await db.collection(COLLECTION).doc(recordId).remove().catch(() => null);
    return {
      success: false,
      code: error && error.errCode === 87014 ? 'UNSAFE_IMAGE' : 'SAFETY_CHECK_FAILED',
      errMsg: error && error.errCode === 87014 ? '图片未通过内容安全检测' : '图片安全检测失败，请重试',
    };
  }
}

async function cancelImageUpload(event) {
  const openid = getTrustedOpenId();
  const recordId = String(event.recordId || '');
  if (!recordId) return { success: true };
  const recordResult = await db.collection(COLLECTION).doc(recordId).get().catch(() => ({ data: null }));
  const record = recordResult.data;
  if (!record || record.openid !== openid || record.status !== 'uploading') {
    return { success: false, code: 'FORBIDDEN', errMsg: '无权取消该上传' };
  }
  const fileID = String(event.fileID || '');
  if (fileID && fileIdMatchesPath(fileID, record.cloudPath)) {
    await cloud.deleteFile({ fileList: [fileID] }).catch(() => null);
  }
  await db.collection(COLLECTION).doc(recordId).remove();
  return { success: true };
}

async function deleteImage(event) {
  const openid = getTrustedOpenId();
  const recordId = String(event.recordId || '');
  if (!recordId) {
    return { success: false, code: 'INVALID_ARGUMENT', errMsg: '缺少图片记录' };
  }
  const recordResult = await db.collection(COLLECTION).doc(recordId).get().catch(() => ({ data: null }));
  const record = recordResult.data;
  if (!record || record.openid !== openid || record.status !== 'ready') {
    return { success: false, code: 'FORBIDDEN', errMsg: '只能删除自己上传的图片' };
  }
  if (record.fileID) {
    const deleteResult = await cloud.deleteFile({ fileList: [record.fileID] });
    const fileResult = (deleteResult.fileList || [])[0];
    if (fileResult && fileResult.status !== 0 && fileResult.status !== -503003) {
      return { success: false, code: 'STORAGE_DELETE_FAILED', errMsg: '云存储文件删除失败，请重试' };
    }
  }
  await db.collection(COLLECTION).doc(recordId).remove();
  return { success: true };
}

exports.main = async (event = {}) => {
  try {
    switch (event.type) {
      case 'list': return await listUserImages(event);
      case 'createUpload': return await createImageUpload(event);
      case 'finalizeUpload': return await finalizeImageUpload(event);
      case 'cancelUpload': return await cancelImageUpload(event);
      case 'delete': return await deleteImage(event);
      default: return { success: false, code: 'UNKNOWN_TYPE', errMsg: '未知操作' };
    }
  } catch (error) {
    console.error('userImages failed', event.type, error);
    return { success: false, code: error.code || 'SERVER_ERROR', errMsg: error.message || '服务暂时不可用' };
  }
};
