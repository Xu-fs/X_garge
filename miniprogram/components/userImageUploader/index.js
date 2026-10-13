const MAX_IMAGES = 4;
const TARGET_BYTES = 2 * 1024 * 1024;

function callImageFunction(type, data) {
  return wx.cloud.callFunction({
    name: 'userImages',
    data: Object.assign({ type }, data || {})
  }).then((response) => {
    const result = response.result || {};
    if (!result.success) {
      const error = new Error(result.errMsg || '操作失败');
      error.code = result.code || 'CLOUD_ERROR';
      throw error;
    }
    return result;
  });
}

function getFileSize(filePath) {
  return new Promise((resolve, reject) => {
    wx.getFileInfo({
      filePath,
      success: (result) => resolve(result.size || 0),
      fail: reject
    });
  });
}

function compressOnce(src, quality) {
  return new Promise((resolve, reject) => {
    wx.compressImage({ src, quality, success: (result) => resolve(result.tempFilePath), fail: reject });
  });
}

async function compressForUpload(filePath) {
  let currentPath = filePath;
  for (const quality of [80, 60, 40]) {
    try {
      currentPath = await compressOnce(currentPath, quality);
    } catch (error) {
      if (quality === 80) {
        const originalSize = await getFileSize(filePath);
        if (originalSize <= TARGET_BYTES) return { filePath, size: originalSize };
        throw error;
      }
    }
    const size = await getFileSize(currentPath);
    if (size <= TARGET_BYTES) return { filePath: currentPath, size };
  }
  return { filePath: currentPath, size: await getFileSize(currentPath) };
}

function getExtension(filePath) {
  const match = String(filePath || '').toLowerCase().match(/\.([a-z0-9]+)(?:\?|$)/);
  const extension = match ? match[1] : 'jpg';
  return ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? extension : 'jpg';
}

Component({
  properties: {
    scopeId: {
      type: String,
      value: '',
      observer(newValue, oldValue) {
        if (this.componentAttached && newValue !== oldValue) this.loadImages();
      }
    },
    initialImages: {
      type: Array,
      value: [],
      observer() {
        this.mergeLegacyImages();
      }
    },
    title: { type: String, value: '车辆图片' }
  },

  data: {
    items: [],
    totalCount: 0,
    maxCount: MAX_IMAGES,
    loading: true,
    choosing: false,
    uploading: false,
    loadError: ''
  },

  lifetimes: {
    attached() {
      this.componentAttached = true;
      this.uploadLock = false;
      this.cloudItems = [];
      this.lastEmittedImages = '';
      this.loadImages();
    }
  },

  methods: {
    loadImages() {
      if (!wx.cloud) {
        this.setData({ loading: false, loadError: '请先开通并配置微信云开发' });
        return;
      }
      this.setData({ loading: true, loadError: '' });
      callImageFunction('list', { scopeId: this.properties.scopeId })
        .then((result) => {
          this.cloudItems = (result.images || []).map((image) => ({
            key: image._id,
            recordId: image._id,
            url: image.fileID,
            fileID: image.fileID,
            cloudPath: image.cloudPath,
            status: 'ready',
            progress: 100,
            isCloud: true
          }));
          this.setData({ totalCount: result.totalCount || 0, loading: false });
          this.mergeLegacyImages();
        })
        .catch((error) => {
          this.setData({ loading: false, loadError: error.message || '图片加载失败，请重试' });
        });
    },

    mergeLegacyImages() {
      if (!this.cloudItems) return;
      const cloudUrls = this.cloudItems.map((item) => item.fileID);
      const legacyItems = (this.properties.initialImages || [])
        .filter((url) => url && cloudUrls.indexOf(url) === -1 && !String(url).startsWith('cloud://'))
        .map((url, index) => ({
          key: 'legacy-' + index + '-' + url,
          url,
          fileID: url,
          status: 'ready',
          progress: 100,
          isCloud: false
        }));
      const pendingItems = (this.data.items || []).filter((item) => ['compressing', 'uploading', 'failed'].includes(item.status));
      const items = this.cloudItems.concat(legacyItems, pendingItems);
      this.setData({ items });
      this.emitChange(items);
    },

    emitChange(items) {
      const images = (items || this.data.items)
        .filter((item) => item.status === 'ready')
        .map((item) => item.fileID || item.url)
        .filter(Boolean);
      const signature = images.join('|');
      if (signature === this.lastEmittedImages) {
        return;
      }
      this.lastEmittedImages = signature;
      this.triggerEvent('change', { images, coverImage: images[0] || '' });
    },

    chooseImages() {
      if (this.uploadLock || this.data.choosing || this.data.uploading) return;
      const remaining = MAX_IMAGES - this.data.totalCount;
      if (remaining <= 0) {
        wx.showToast({ title: '每位用户最多上传4张照片', icon: 'none' });
        return;
      }
      this.setData({ choosing: true });
      wx.chooseMedia({
        count: remaining,
        mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (result) => {
          const files = (result.tempFiles || []).slice(0, remaining);
          if (files.length) this.queueUploads(files);
        },
        complete: () => this.setData({ choosing: false })
      });
    },

    async queueUploads(files) {
      if (this.uploadLock) return;
      this.uploadLock = true;
      this.setData({ uploading: true });
      const localItems = files.map((file, index) => ({
        key: 'pending-' + Date.now() + '-' + index,
        url: file.tempFilePath,
        originalPath: file.tempFilePath,
        status: 'compressing',
        statusText: '正在压缩',
        progress: 0,
        isCloud: false
      }));
      this.setData({ items: this.data.items.concat(localItems) });

      for (const item of localItems) {
        await this.uploadOne(item);
      }
      this.uploadLock = false;
      this.setData({ uploading: false });
      const failedCount = this.data.items.filter((item) => item.status === 'failed').length;
      if (failedCount) {
        wx.showToast({ title: failedCount + '张图片上传失败，可点击重试', icon: 'none', duration: 2500 });
      }
    },

    updateItem(key, changes) {
      const items = this.data.items.map((item) => item.key === key ? Object.assign({}, item, changes) : item);
      this.setData({ items });
      return items.find((item) => item.key === key);
    },

    async uploadOne(item) {
      let recordId = '';
      let uploadedFileID = '';
      try {
        this.updateItem(item.key, { status: 'compressing', statusText: '正在压缩', error: '' });
        const compressed = await compressForUpload(item.originalPath || item.url);
        const reservation = await callImageFunction('createUpload', {
          scopeId: this.properties.scopeId,
          extension: getExtension(compressed.filePath)
        });
        recordId = reservation.recordId;
        this.updateItem(item.key, {
          recordId,
          cloudPath: reservation.cloudPath,
          compressedPath: compressed.filePath,
          compressedSize: compressed.size,
          status: 'uploading',
          statusText: compressed.size > TARGET_BYTES ? '图片较大，正在上传' : '正在上传',
          progress: 0
        });
        const uploadTask = wx.cloud.uploadFile({ cloudPath: reservation.cloudPath, filePath: compressed.filePath });
        if (uploadTask.onProgressUpdate) {
          uploadTask.onProgressUpdate((progress) => {
            this.updateItem(item.key, { progress: progress.progress || 0, statusText: '上传中 ' + (progress.progress || 0) + '%' });
          });
        }
        const uploadResult = await uploadTask;
        uploadedFileID = uploadResult.fileID;
        const finalResult = await callImageFunction('finalizeUpload', { recordId, fileID: uploadedFileID });
        const ready = finalResult.image;
        const readyItem = {
          key: ready._id,
          recordId: ready._id,
          url: ready.fileID,
          fileID: ready.fileID,
          cloudPath: ready.cloudPath,
          status: 'ready',
          progress: 100,
          isCloud: true
        };
        this.cloudItems.push(readyItem);
        const items = this.data.items.map((current) => current.key === item.key ? readyItem : current);
        this.setData({ items, totalCount: this.data.totalCount + 1 });
        this.emitChange(items);
      } catch (error) {
        if (recordId) {
          callImageFunction('cancelUpload', { recordId, fileID: uploadedFileID }).catch(() => null);
        }
        this.updateItem(item.key, {
          recordId: '',
          status: 'failed',
          statusText: '上传失败，点击重试',
          error: error.message || '上传失败'
        });
        if (error.code === 'LIMIT_EXCEEDED') {
          wx.showToast({ title: '每位用户最多上传4张照片', icon: 'none' });
        }
      }
    },

    retryUpload(event) {
      if (this.uploadLock || this.data.uploading) return;
      const key = event.currentTarget.dataset.key;
      const item = this.data.items.find((current) => current.key === key);
      if (!item || item.status !== 'failed') return;
      this.queueUploads([{ tempFilePath: item.originalPath || item.url }]);
      this.setData({ items: this.data.items.filter((current) => current.key !== key) });
    },

    previewImage(event) {
      const current = event.currentTarget.dataset.url;
      const urls = this.data.items.filter((item) => item.status === 'ready').map((item) => item.fileID || item.url);
      if (current && urls.length) wx.previewImage({ current, urls });
    },

    removeImage(event) {
      if (this.uploadLock || this.data.uploading) return;
      const key = event.currentTarget.dataset.key;
      const item = this.data.items.find((current) => current.key === key);
      if (!item) return;
      wx.showModal({
        title: '删除图片',
        content: '删除后云存储文件和数据库记录会同时移除，是否继续？',
        success: async (result) => {
          if (!result.confirm) return;
          if (item.isCloud) {
            wx.showLoading({ title: '正在删除', mask: true });
            try {
              await callImageFunction('delete', { recordId: item.recordId });
              this.cloudItems = this.cloudItems.filter((current) => current.key !== key);
              this.setData({ totalCount: Math.max(0, this.data.totalCount - 1) });
            } catch (error) {
              wx.hideLoading();
              wx.showToast({ title: error.message || '删除失败，请重试', icon: 'none' });
              return;
            }
            wx.hideLoading();
          }
          const items = this.data.items.filter((current) => current.key !== key);
          this.setData({ items });
          this.emitChange(items);
        }
      });
    }
  }
});
