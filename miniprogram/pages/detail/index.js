const STORAGE_KEY = 'garageVehicles';

function callGarageVehicles(type, data) {
  return wx.cloud.callFunction({ name: 'garageVehicles', data: Object.assign({ type }, data || {}) }).then((response) => {
    const result = response.result || {};
    if (!result.success) throw new Error(result.errMsg || '云端操作失败');
    return result;
  });
}

const TEXTS = {
  vehicleBrandLabel: '\u8f66\u8f86\u54c1\u724c',
  specificModelLabel: '\u5177\u4f53\u578b\u53f7',
  modelBrandLabel: '\u8f66\u6a21\u54c1\u724c',
  colorLabel: '\u989c\u8272',
  tagsLabel: '\u81ea\u5b9a\u4e49\u5206\u7c7b',
  purchaseDateLabel: '\u8d2d\u5165\u65f6\u95f4',
  purchasePriceLabel: '\u8d2d\u5165\u4ef7\u683c',
  purchaseChannelLabel: '\u8d2d\u5165\u6e20\u9053',
  noteLabel: '\u5907\u6ce8',
  notFound: '\u8f66\u8f86\u4e0d\u5b58\u5728',
  deleteTitle: '\u5220\u9664\u8f66\u8f86',
  deleteContent: '\u786e\u8ba4\u5220\u9664\u8fd9\u6761\u8f66\u8f86\u4fe1\u606f\u5417\uff1f',
  deleteSuccess: '\u5df2\u5220\u9664',
  editButton: '\u7f16\u8f91'
};

function normalizeTags(input) {
  const source = Array.isArray(input) ? input.join(',') : String(input || '');
  return source
    .split(/[\s,\uff0c\u3001]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
}

function normalizeVehicle(vehicle) {
  const images = vehicle.images && vehicle.images.length ? vehicle.images : (vehicle.image ? [vehicle.image] : []);
  const coverImage = vehicle.coverImage || images[0] || '';
  const tags = normalizeTags(vehicle.tags || vehicle.tagText || '');
  return {
    id: vehicle.id,
    coverImage: coverImage,
    images: images,
    specificModel: vehicle.specificModel || vehicle.name || '',
    modelBrand: vehicle.modelBrand || '',
    vehicleBrand: vehicle.vehicleBrand || vehicle.brand || '',
    color: vehicle.color || '',
    tags: tags,
    tagText: tags.join(', '),
    purchaseDate: vehicle.purchaseDate || '',
    purchasePrice: vehicle.purchasePrice || '',
    purchaseChannel: vehicle.purchaseChannel || '',
    note: vehicle.note || ''
  };
}

Page({
  data: {
    texts: TEXTS,
    vehicle: null
  },

  onLoad(options) {
    this.vehicleId = Number(options.id || 0);
    this.loadVehicle();
  },

  onShow() {
    this.loadVehicle();
  },

  loadVehicle() {
    return callGarageVehicles('list').then((result) => {
    const vehicles = result.vehicles || [];
    const vehicle = vehicles.map(normalizeVehicle).find((item) => item.id === this.vehicleId);
    if (!vehicle) {
      wx.showToast({ title: TEXTS.notFound, icon: 'none' });
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
      return;
    }
    this.setData({ vehicle: vehicle });
    }).catch((error) => wx.showToast({ title: error.message || '读取云端数据失败', icon: 'none' }));
  },

  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.current,
      urls: this.data.vehicle.images
    });
  },

  editVehicle() {
    wx.navigateTo({ url: '/pages/edit/index?id=' + this.vehicleId });
  },

  deleteVehicle() {
    wx.showModal({
      title: TEXTS.deleteTitle,
      content: TEXTS.deleteContent,
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        callGarageVehicles('delete', { id: this.vehicleId }).then(() => {
          wx.showToast({ title: TEXTS.deleteSuccess, icon: 'success' });
          setTimeout(() => wx.navigateBack(), 600);
        }).catch((error) => wx.showToast({ title: error.message || '云端删除失败', icon: 'none' }));
      }
    });
  }
});
