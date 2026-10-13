const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const COLLECTION = 'garage_vehicles';
const FIELDS = ['id', 'images', 'coverImage', 'specificModel', 'modelBrand', 'serialNumber', 'vehicleBrand', 'color', 'tags', 'purchaseDate', 'purchasePrice', 'purchaseChannel', 'note', 'isPinned'];

function openid() {
  const value = cloud.getWXContext().OPENID;
  if (!value) throw new Error('无法获取用户身份');
  return value;
}
function vehicleData(vehicle) {
  const result = {};
  FIELDS.forEach((key) => { if (vehicle && vehicle[key] !== undefined) result[key] = vehicle[key]; });
  result.id = Number(result.id || Date.now());
  result.images = Array.isArray(result.images) ? result.images : [];
  result.coverImage = String(result.coverImage || result.images[0] || '');
  result.isPinned = Boolean(result.isPinned);
  return result;
}
async function list() {
  const owner = openid();
  const result = await db.collection(COLLECTION).where({ openid: owner }).limit(100).get();
  return { success: true, vehicles: result.data.map((item) => { delete item._id; delete item._openid; delete item.openid; return item; }) };
}
async function create(event) {
  const owner = openid(); const vehicle = vehicleData(event.vehicle);
  const exists = await db.collection(COLLECTION).where({ openid: owner, id: vehicle.id }).limit(1).get();
  if (exists.data.length) return { success: true, vehicle };
  await db.collection(COLLECTION).add({ data: Object.assign({ _openid: owner, openid: owner, createdAt: db.serverDate(), updatedAt: db.serverDate() }, vehicle) });
  return { success: true, vehicle };
}
async function update(event) {
  const owner = openid(); const vehicle = vehicleData(event.vehicle);
  const result = await db.collection(COLLECTION).where({ openid: owner, id: vehicle.id }).update({ data: Object.assign({}, vehicle, { updatedAt: db.serverDate() }) });
  if (!result.stats.updated) throw new Error('车模不存在或无权修改');
  return { success: true, vehicle };
}
async function createMany(event) {
  const vehicles = Array.isArray(event.vehicles) ? event.vehicles : [];
  for (const vehicle of vehicles) await create({ vehicle });
  return { success: true };
}
async function remove(event) {
  const owner = openid(); await db.collection(COLLECTION).where({ openid: owner, id: Number(event.id) }).remove(); return { success: true };
}
async function reorder(event) {
  const owner = openid(); const order = Array.isArray(event.order) ? event.order.map(Number) : [];
  await Promise.all(order.map((id, index) => db.collection(COLLECTION).where({ openid: owner, id }).update({ data: { order: index, updatedAt: db.serverDate() } })));
  return { success: true };
}
exports.main = async (event = {}) => {
  try {
    if (event.type === 'list') return await list();
    if (event.type === 'create') return await create(event);
    if (event.type === 'update') return await update(event);
    if (event.type === 'createMany') return await createMany(event);
    if (event.type === 'delete') return await remove(event);
    if (event.type === 'reorder') return await reorder(event);
    return { success: false, errMsg: '未知操作' };
  } catch (error) { console.error(error); return { success: false, errMsg: error.message || '云端保存失败' }; }
};
