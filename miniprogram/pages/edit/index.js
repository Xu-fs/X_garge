const STORAGE_KEY = 'garageVehicles';

const TEXTS = {
  heroTitle: '\u7f16\u8f91\u8f66\u8f86',
  heroDesc: '\u8fd9\u91cc\u4f1a\u81ea\u52a8\u5e26\u51fa\u539f\u672c\u8f93\u5165\u7684\u4fe1\u606f\uff0c\u4f60\u53ef\u4ee5\u76f4\u63a5\u4fee\u6539\u5e76\u4fdd\u5b58\u3002',
  imageLabel: '\u8f66\u8f86\u56fe\u7247\uff08\u53ef\u591a\u9009\uff09',
  addImage: '\u6dfb\u52a0\u56fe\u7247',
  serialNumberLabel: '\u7f16\u53f7',
  serialNumberPlaceholder: '\u4f8b\u5982\uff1a1064\u53f7',
  vehicleBrandLabel: '\u8f66\u8f86\u54c1\u724c',
  vehicleBrandPlaceholder: '\u4f8b\u5982\uff1a\u4fdd\u65f6\u6377',
  specificModelLabel: '\u5177\u4f53\u578b\u53f7',
  specificModelPlaceholder: '\u4f8b\u5982\uff1a911',
  modelBrandLabel: '\u8f66\u6a21\u54c1\u724c',
  modelBrandPlaceholder: '\u4f8b\u5982\uff1aMINI GT',
  colorLabel: '\u989c\u8272',
  colorPlaceholder: '\u4f8b\u5982\uff1a\u767d\u8272, \u7ea2\u8272',
  colorHint: '\u7528\u9017\u53f7\u3001\u987f\u53f7\u6216\u7a7a\u683c\u5206\u9694\u591a\u4e2a\u989c\u8272',
  expandColorTags: '\u5c55\u5f00\u989c\u8272\u6807\u7b7e',
  collapseColorTags: '\u6536\u8d77\u989c\u8272\u6807\u7b7e',
  tagsLabel: '\u5206\u7c7b\u6807\u7b7e',
  tagsPlaceholder: '\u4f8b\u5982\uff1a\u8d5b\u9053, \u9650\u91cf, \u5df2\u6536\u85cf',
  tagsHint: '\u7528\u9017\u53f7\u3001\u987f\u53f7\u6216\u7a7a\u683c\u5206\u9694\u591a\u4e2a\u6807\u7b7e',
  expandTagSuggestions: '\u5c55\u5f00\u5206\u7c7b\u6807\u7b7e',
  collapseTagSuggestions: '\u6536\u8d77\u5206\u7c7b\u6807\u7b7e',
  purchaseDateLabel: '\u8d2d\u5165\u65f6\u95f4',
  purchaseDatePlaceholder: '\u8bf7\u9009\u62e9\u8d2d\u5165\u65f6\u95f4',
  purchasePriceLabel: '\u8d2d\u5165\u4ef7\u683c',
  purchasePricePlaceholder: '\u4f8b\u5982\uff1a299\u5143',
  noteLabel: '\u5907\u6ce8',
  notePlaceholder: '\u53ef\u4ee5\u8f93\u5165\u8fd9\u53f0\u8f66\u7684\u5907\u6ce8\u4fe1\u606f',
  saveButton: '\u4fdd\u5b58\u4fee\u6539',
  notFound: '\u8f66\u8f86\u4e0d\u5b58\u5728',
  saveSuccess: '\u4fdd\u5b58\u6210\u529f'
};

function normalizeTags(input) {
  const source = Array.isArray(input) ? input.join(',') : String(input || '');
  return source
    .split(/[\s,\uff0c\u3001]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
}

function splitCategoryItems(input) {
  return String(input || '')
    .split(/[\s,\uff0c\u3001]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
}

function normalizeVehicle(vehicle) {
  const images = vehicle.images && vehicle.images.length ? vehicle.images : (vehicle.image ? [vehicle.image] : []);
  const coverImage = vehicle.coverImage || images[0] || '';
  const colors = splitCategoryItems(vehicle.color);
  const tags = normalizeTags(vehicle.tags || vehicle.tagText || '');
  return {
    id: vehicle.id,
    coverImage: coverImage,
    images: images,
    specificModel: vehicle.specificModel || vehicle.name || '',
    modelBrand: vehicle.modelBrand || '',
    serialNumber: vehicle.serialNumber || '',
    vehicleBrand: vehicle.vehicleBrand || vehicle.brand || '',
    color: colors.join('\u3001'),
    colors: colors,
    colorText: colors.join(', '),
    tags: tags,
    tagText: tags.join(', '),
    purchaseDate: vehicle.purchaseDate || '',
    purchasePrice: vehicle.purchasePrice || '',
    note: vehicle.note || ''
  };
}

function createEmptyForm() {
  return {
    images: [],
    coverImage: '',
    specificModel: '',
    modelBrand: '',
    serialNumber: '',
    vehicleBrand: '',
    color: '',
    colorText: '',
    colorList: [],
    tagText: '',
    tagList: [],
    purchaseDate: '',
    purchaseDateText: TEXTS.purchaseDatePlaceholder,
    purchasePrice: '',
    note: ''
  };
}

function createFormFromVehicle(vehicle) {
  const tagList = vehicle.tags || [];
  const colorList = vehicle.colors || splitCategoryItems(vehicle.color);
  return {
    images: vehicle.images || [],
    coverImage: vehicle.coverImage || '',
    specificModel: vehicle.specificModel || '',
    modelBrand: vehicle.modelBrand || '',
    serialNumber: vehicle.serialNumber || '',
    vehicleBrand: vehicle.vehicleBrand || '',
    color: colorList.join('\u3001'),
    colorText: colorList.join(', '),
    colorList: colorList,
    tagText: tagList.join(', '),
    tagList: tagList,
    purchaseDate: vehicle.purchaseDate || '',
    purchaseDateText: vehicle.purchaseDate || TEXTS.purchaseDatePlaceholder,
    purchasePrice: vehicle.purchasePrice || '',
    note: vehicle.note || ''
  };
}

function getAvailableItems(vehicles, field, extraItems) {
  const itemMap = {};
  vehicles.forEach((vehicle) => {
    const sourceItems = field === 'color' ? (vehicle.colors || splitCategoryItems(vehicle.color)) : (vehicle.tags || normalizeTags(vehicle.tags || vehicle.tagText || []));
    sourceItems.forEach((item) => {
      itemMap[item] = true;
    });
  });
  const extras = field === 'color' ? splitCategoryItems(extraItems || []) : normalizeTags(extraItems || []);
  extras.forEach((item) => {
    itemMap[item] = true;
  });
  return Object.keys(itemMap).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
}

function getAvailableTags(vehicles, extraTags) {
  return getAvailableItems(vehicles, 'tags', extraTags);
}

function getAvailableColors(vehicles, extraColors) {
  return getAvailableItems(vehicles, 'color', extraColors);
}

function getSuggestionKeyword(input) {
  const parts = String(input || '').split(/[\s,\uff0c\u3001]+/);
  return String(parts[parts.length - 1] || '').trim().toLowerCase();
}

function getFilteredSuggestions(items, input) {
  const keyword = getSuggestionKeyword(input);
  if (!keyword) {
    return items.slice();
  }
  return items.filter((item) => String(item || '').toLowerCase().indexOf(keyword) !== -1);
}

Page({
  data: {
    texts: TEXTS,
    form: createEmptyForm(),
    availableTags: [],
    availableColors: [],
    filteredTags: [],
    showColorTags: false,
    showTagSuggestions: false
  },

  onLoad(options) {
    this.vehicleId = Number(options.id || 0);
    this.loadVehicle();
  },

  loadVehicle() {
    const vehicles = (wx.getStorageSync(STORAGE_KEY) || []).map(normalizeVehicle);
    const vehicle = vehicles.find((item) => item.id === this.vehicleId);
    if (!vehicle) {
      wx.showToast({ title: TEXTS.notFound, icon: 'none' });
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
      return;
    }
    const form = createFormFromVehicle(vehicle);
    this.setData({
      form: form,
      availableTags: getAvailableTags(vehicles, form.tagList),
      availableColors: getAvailableColors(vehicles, form.colorList),
      filteredTags: getFilteredSuggestions(getAvailableTags(vehicles, form.tagList), form.tagText),
      showColorTags: false,
      showTagSuggestions: false
    });
  },

  chooseImages() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: ({ tempFiles }) => {
        if (!tempFiles || !tempFiles.length) {
          return;
        }
        const selectedImages = tempFiles.map((item) => item.tempFilePath).filter(Boolean);
        const mergedImages = this.data.form.images.concat(selectedImages).slice(0, 9);
        this.setData({ 'form.images': mergedImages, 'form.coverImage': mergedImages[0] || '' });
      }
    });
  },

  removeImage(e) {
    const index = Number(e.currentTarget.dataset.index);
    const images = this.data.form.images.filter((item, currentIndex) => currentIndex !== index);
    this.setData({ 'form.images': images, 'form.coverImage': images[0] || '' });
  },

  toggleColorTags() {
    this.setData({ showColorTags: !this.data.showColorTags });
  },

  toggleTagSuggestions() {
    this.setData({ showTagSuggestions: !this.data.showTagSuggestions });
  },

  selectFormColor(e) {
    const color = String(e.currentTarget.dataset.color || '').trim();
    if (!color) {
      return;
    }
    const colorList = this.data.form.colorList.slice();
    if (colorList.indexOf(color) === -1) {
      colorList.push(color);
    }
    this.setData({
      'form.colorList': colorList,
      'form.colorText': colorList.join(', '),
      'form.color': colorList.join('\u3001'),
      availableColors: getAvailableColors((wx.getStorageSync(STORAGE_KEY) || []).map(normalizeVehicle), colorList)
    });
  },

  selectFormTag(e) {
    const tag = String(e.currentTarget.dataset.tag || '').trim();
    if (!tag) {
      return;
    }
    const tagList = this.data.form.tagList.slice();
    if (tagList.indexOf(tag) === -1) {
      tagList.push(tag);
    }
    this.setData({
      'form.tagList': tagList,
      'form.tagText': tagList.join(', '),
      availableTags: getAvailableTags((wx.getStorageSync(STORAGE_KEY) || []).map(normalizeVehicle), tagList),
      filteredTags: getFilteredSuggestions(getAvailableTags((wx.getStorageSync(STORAGE_KEY) || []).map(normalizeVehicle), tagList), tagList.join(', '))
    });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    if (field === 'color') {
      const colorList = splitCategoryItems(value);
      this.setData({
        'form.color': colorList.join('\u3001'),
        'form.colorText': value,
        'form.colorList': colorList,
        availableColors: getAvailableColors((wx.getStorageSync(STORAGE_KEY) || []).map(normalizeVehicle), colorList)
      });
      return;
    }
    if (field === 'tagText') {
      const tagList = normalizeTags(value);
      const availableTags = getAvailableTags((wx.getStorageSync(STORAGE_KEY) || []).map(normalizeVehicle), tagList);
      this.setData({
        'form.tagText': value,
        'form.tagList': tagList,
        availableTags: availableTags,
        filteredTags: getFilteredSuggestions(availableTags, value)
      });
      return;
    }
    this.setData({ ['form.' + field]: value });
  },

  onDateChange(e) {
    this.setData({ 'form.purchaseDate': e.detail.value, 'form.purchaseDateText': e.detail.value });
  },

  submitForm() {
    const form = this.data.form;
    const vehicles = (wx.getStorageSync(STORAGE_KEY) || []).map(normalizeVehicle);
    const nextVehicles = vehicles.map((vehicle) => {
      if (vehicle.id !== this.vehicleId) {
        return vehicle;
      }
      return normalizeVehicle({
        id: this.vehicleId,
        images: form.images,
        coverImage: form.coverImage,
        specificModel: form.specificModel,
        modelBrand: form.modelBrand,
        serialNumber: form.serialNumber,
        vehicleBrand: form.vehicleBrand,
        color: form.color || form.colorText,
        tags: form.tagText,
        purchaseDate: form.purchaseDate,
        purchasePrice: form.purchasePrice,
        note: form.note
      });
    });
    wx.setStorageSync(STORAGE_KEY, nextVehicles);
    wx.showToast({ title: TEXTS.saveSuccess, icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 500);
  }
});