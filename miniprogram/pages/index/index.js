const STORAGE_KEY = 'garageVehicles';
const LOGIN_STORAGE_KEY = 'garageLoginProfile';

const TEXTS = {
  garageTitle: '\u6211\u7684\u8f66\u5e93',
  searchPlaceholder: '\u641c\u7d22\u5173\u952e\u8bcd\uff1a\u5177\u4f53\u578b\u53f7 / \u8f66\u8f86\u54c1\u724c / \u8f66\u6a21\u54c1\u724c / \u6807\u7b7e',
  clear: '\u6e05\u9664',
  sort: '\u6392\u5e8f',
  category: '\u5206\u7c7b\u67e5\u770b',
  categoryDimension: '\u5206\u7c7b\u7ef4\u5ea6',
  categoryValue: '\u5206\u7c7b\u503c',
  empty: '\u6ca1\u6709\u641c\u7d22\u5230\u76f8\u5173\u8f66\u8f86\uff0c\u8bd5\u8bd5\u522b\u7684\u5173\u952e\u8bcd\u3002',
  addTitle: '\u6dfb\u52a0\u8f66\u8f86',
  addDesc: '\u53ef\u4ee5\u6dfb\u52a0\u591a\u5f20\u56fe\u7247\uff0c\u7b2c\u4e00\u5f20\u4f1a\u81ea\u52a8\u4f5c\u4e3a\u5c01\u9762\u663e\u793a\u5728\u8f66\u5e93\u5217\u8868\u91cc\u3002',
  importExcelButton: '\u5bfc\u5165Excel',
  templateButton: '\u8f66\u6a21\u4fe1\u606f\u8868\u6a21\u677f',
  importingExcel: '\u6b63\u5728\u5bfc\u5165',
  importSuccess: '\u5bfc\u5165\u6210\u529f',
  importBatchSuccess: '\u6279\u91cf\u5bfc\u5165\u6210\u529f',
  importNoData: '\u6ca1\u6709\u53ef\u5bfc\u5165\u7684\u5185\u5bb9',
  importFailed: '\u5bfc\u5165\u5931\u8d25',
  templateOpenFailed: '\u6a21\u677f\u6253\u5f00\u5931\u8d25',
  templatePreviewTitle: '\u6a21\u677f\u9884\u89c8',
  templatePreviewHint: '\u6309\u7167\u8fd9\u5f20\u793a\u610f\u56fe\u586b\u5199 Excel \u5373\u53ef',
  importNeedCloud: '\u8bf7\u5148\u914d\u7f6e\u4e91\u73af\u5883',
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
  submitAdd: '\u786e\u8ba4\u6dfb\u52a0',
  profileTitle: '\u6211\u7684\u4e3b\u9875',
  profileDesc: '\u8fd9\u91cc\u53ef\u4ee5\u5b8c\u6210\u5fae\u4fe1\u767b\u5f55\uff0c\u5e76\u8bbe\u7f6e\u4f60\u7684\u6635\u79f0\u548c\u5934\u50cf\u3002',
  accountLogin: '\u8d26\u53f7\u767b\u5f55',
  avatar: '\u5934\u50cf',
  nicknamePlaceholder: '\u8bf7\u8f93\u5165\u6635\u79f0',
  nicknameLabel: '\u6635\u79f0',
  loginTimeLabel: '\u767b\u5f55\u65f6\u95f4',
  loginCodeLabel: '\u767b\u5f55\u51ed\u8bc1',
  totalVehiclesLabel: '\u5df2\u6536\u5f55\u8f66\u8f86',
  totalVehiclesUnit: '\u53f0',
  loginButton: '\u5fae\u4fe1\u767b\u5f55',
  reloginButton: '\u91cd\u65b0\u767b\u5f55',
  logoutButton: '\u9000\u51fa\u767b\u5f55',
  garageTab: '\u8f66\u5e93',
  addTab: '\u6dfb\u52a0',
  profileTab: '\u6211\u7684\u4e3b\u9875',
  all: '\u5168\u90e8',
  notLoggedIn: '\u672a\u767b\u5f55',
  loginExpired: '\u767b\u5f55\u5df2\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55',
  loginFailed: '\u767b\u5f55\u5931\u8d25',
  loginSuccess: '\u767b\u5f55\u6210\u529f',
  loggedIn: '\u5df2\u767b\u5f55',
  gotCredential: '\u5df2\u83b7\u53d6\u767b\u5f55\u51ed\u8bc1',
  needCloud: '\u5df2\u83b7\u53d6\u767b\u5f55\u51ed\u8bc1\uff0c\u8bf7\u5f00\u542f\u4e91\u5f00\u53d1\u540e\u83b7\u53d6\u8d26\u53f7\u6807\u8bc6',
  needEnv: '\u5df2\u83b7\u53d6\u767b\u5f55\u51ed\u8bc1\uff0c\u8bf7\u5728 app.js \u914d\u7f6e\u4e91\u73af\u5883\u540e\u83b7\u53d6 OpenID',
  logoutStatus: '\u5df2\u9000\u51fa\u767b\u5f55',
  logoutToast: '\u5df2\u9000\u51fa',
  addSuccess: '\u6dfb\u52a0\u6210\u529f'
};

const defaultVehicles = [
  {
    id: 1,
    coverImage: '/images/default_lambo_gt3_evo2.jpg',
    images: ['/images/default_lambo_gt3_evo2.jpg'],
    specificModel: '\u98d3\u98ceGT3 EVO2',
    modelBrand: 'MINI GT',
    serialNumber: '1064',
    vehicleBrand: '\u5170\u535a\u57fa\u5c3c',
    color: '\u7d2b\u8272\u3001\u7eff\u8272',
    tags: ['GT3'],
    purchaseDate: '2025-11-11',
    purchasePrice: '',
    note: ''
  }
];

const sortOptions = [
  { key: 'initial', label: '\u9996\u5b57\u6bcd\u6392\u5e8f' },
  { key: 'purchaseDate', label: '\u8d2d\u5165\u65f6\u95f4' },
  { key: 'vehicleBrand', label: '\u8f66\u8f86\u54c1\u724c' },
  { key: 'modelBrand', label: '\u8f66\u6a21\u54c1\u724c' }
];

const categoryFields = [
  { key: 'vehicleBrand', label: '\u8f66\u8f86\u54c1\u724c' },
  { key: 'modelBrand', label: '\u8f66\u6a21\u54c1\u724c' },
  { key: 'color', label: '\u989c\u8272' },
  { key: 'tags', label: '\u5206\u7c7b\u6807\u7b7e' }
];

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
  const rawSpecificModel = String(vehicle.specificModel || vehicle.name || '');
  const rawSerialNumber = String(vehicle.serialNumber || '');
  const isDefaultLambo = Number(vehicle.id) === 1 && String(vehicle.vehicleBrand || vehicle.brand || '') === '\u5170\u535a\u57fa\u5c3c' && String(vehicle.modelBrand || '') === 'MINI GT';
  const specificModel = isDefaultLambo && (rawSpecificModel === '1064\u53f7 \u5170\u535a\u57fa\u5c3c \u98d3\u98ceGT3 EVO2' || rawSpecificModel === '\u98d3\u98ceGT3 EVO2') ? '\u98d3\u98ceGT3 EVO2' : rawSpecificModel;
  const serialNumber = isDefaultLambo && (rawSerialNumber === '1064' || rawSerialNumber === '1064\u53f7' || rawSpecificModel === '1064\u53f7 \u5170\u535a\u57fa\u5c3c \u98d3\u98ceGT3 EVO2') ? '1064' : rawSerialNumber;
  return {
    id: vehicle.id,
    coverImage: coverImage,
    images: images,
    specificModel: specificModel,
    modelBrand: vehicle.modelBrand || '',
    serialNumber: serialNumber,
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

function createEmptyLoginProfile() {
  return {
    isLoggedIn: false,
    loginCode: '',
    openid: '',
    appid: '',
    unionid: '',
    loginTime: '',
    statusText: TEXTS.notLoggedIn,
    nickname: '',
    avatarUrl: ''
  };
}

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

function getSortText(vehicle) {
  return String(vehicle.vehicleBrand || '') + String(vehicle.specificModel || '');
}

function sortVehicles(vehicles, sortKey) {
  const nextVehicles = vehicles.slice();
  nextVehicles.sort((a, b) => {
    if (sortKey === 'purchaseDate') {
      return String(b.purchaseDate || '').localeCompare(String(a.purchaseDate || ''));
    }
    if (sortKey === 'initial') {
      return getSortText(a).localeCompare(getSortText(b), 'zh-Hans-CN');
    }
    return String(a[sortKey] || '').localeCompare(String(b[sortKey] || ''), 'zh-Hans-CN');
  });
  return nextVehicles;
}

function filterVehicles(vehicles, keyword, categoryField, categoryValue) {
  const normalizedKeyword = String(keyword || '').trim().toLowerCase();
  let nextVehicles = vehicles;

  if (normalizedKeyword) {
    nextVehicles = nextVehicles.filter((vehicle) => {
      const haystack = [
        vehicle.specificModel,
        vehicle.serialNumber,
        vehicle.vehicleBrand,
        vehicle.color,
        vehicle.purchaseDate,
        vehicle.purchasePrice,
        vehicle.note,
        vehicle.tagText
      ].join(' ').toLowerCase();
      return haystack.indexOf(normalizedKeyword) !== -1;
    });
  }

  if (categoryValue !== TEXTS.all) {
    nextVehicles = nextVehicles.filter((vehicle) => {
      if (categoryField === 'tags') {
        return (vehicle.tags || []).indexOf(categoryValue) !== -1;
      }
      if (categoryField === 'color') {
        return (vehicle.colors || []).indexOf(categoryValue) !== -1;
      }
      return String(vehicle[categoryField] || '') === categoryValue;
    });
  }

  return nextVehicles;
}

function getCategoryValues(vehicles, field) {
  let values = [];

  if (field === 'tags') {
    values = vehicles
      .reduce((result, vehicle) => result.concat(vehicle.tags || []), [])
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  } else if (field === 'color') {
    values = vehicles
      .reduce((result, vehicle) => result.concat(vehicle.colors || []), [])
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  } else {
    values = vehicles
      .map((vehicle) => String(vehicle[field] || '').trim())
      .filter(Boolean);
  }

  values = values
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));

  return [TEXTS.all].concat(values);
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

function buildImportedVehicles(rows) {
  const baseId = Date.now();
  return rows
    .map((row, index) => normalizeVehicle({
      id: baseId + index,
      images: [],
      coverImage: '',
      modelBrand: row.modelBrand || '',
      serialNumber: row.serialNumber || '',
      vehicleBrand: row.vehicleBrand || '',
      specificModel: row.specificModel || '',
      color: row.color || '',
      tags: row.tags || '',
      purchaseDate: row.purchaseDate || '',
      purchasePrice: row.purchasePrice || '',
      note: row.note || ''
    }))
    .filter((vehicle) => [
      vehicle.modelBrand,
      vehicle.serialNumber,
      vehicle.vehicleBrand,
      vehicle.specificModel,
      vehicle.color,
      vehicle.tagText,
      vehicle.purchaseDate,
      vehicle.purchasePrice,
      vehicle.note
    ].some((item) => String(item || '').trim()));
}

Page({
  data: {
    texts: TEXTS,
    currentTab: 'garage',
    vehicles: [],
    rawVehicles: [],
    sortKey: 'initial',
    sortOptions: sortOptions,
    showSortPanel: false,
    showCategoryPanel: false,
    categoryFields: categoryFields,
    categoryField: 'vehicleBrand',
    categoryValues: [TEXTS.all],
    categoryValue: TEXTS.all,
    searchKeyword: '',
    form: createEmptyForm(),
    availableTags: [],
    availableColors: [],
    filteredTags: [],
    showColorTags: false,
    showTagSuggestions: false,
    loginProfile: createEmptyLoginProfile(),
    loginLoading: false,
    showTemplatePreview: false
  },

  onLoad() {
    this.loadVehicles();
    this.loadLoginProfile();
  },

  onShow() {
    this.loadVehicles();
    this.validateLoginSession();
  },

  applyFilters(rawVehicles, sortKey, searchKeyword, categoryField, categoryValue) {
    return sortVehicles(filterVehicles(rawVehicles, searchKeyword, categoryField, categoryValue), sortKey);
  },

  loadVehicles() {
    const storedVehicles = wx.getStorageSync(STORAGE_KEY);
    const baseVehicles = storedVehicles && storedVehicles.length ? storedVehicles : defaultVehicles;
    const rawVehicles = baseVehicles.map(normalizeVehicle);
    const categoryField = categoryFields.some((item) => item.key === this.data.categoryField) ? this.data.categoryField : 'vehicleBrand';
    const categoryValues = getCategoryValues(rawVehicles, categoryField);
    const categoryValue = categoryValues.indexOf(this.data.categoryValue) !== -1 ? this.data.categoryValue : TEXTS.all;
    const vehicles = this.applyFilters(rawVehicles, this.data.sortKey, this.data.searchKeyword, categoryField, categoryValue);
    const availableTags = getAvailableTags(rawVehicles, this.data.form.tagList);
    const availableColors = getAvailableColors(rawVehicles, this.data.form.colorList);
    const filteredTags = getFilteredSuggestions(availableTags, this.data.form.tagText);
    this.setData({ rawVehicles, categoryField, categoryValues, categoryValue, vehicles, availableTags, availableColors, filteredTags });
    this.saveVehicles(rawVehicles);
  },

  saveVehicles(vehicles) {
    wx.setStorageSync(STORAGE_KEY, vehicles);
  },

  loadLoginProfile() {
    const loginProfile = wx.getStorageSync(LOGIN_STORAGE_KEY) || createEmptyLoginProfile();
    this.setData({ loginProfile });
  },

  saveLoginProfile(loginProfile) {
    wx.setStorageSync(LOGIN_STORAGE_KEY, loginProfile);
    this.setData({ loginProfile });
  },

  validateLoginSession() {
    const loginProfile = this.data.loginProfile;
    if (!loginProfile.isLoggedIn) {
      return;
    }
    wx.checkSession({
      fail: () => {
        const nextProfile = createEmptyLoginProfile();
        nextProfile.nickname = loginProfile.nickname || '';
        nextProfile.avatarUrl = loginProfile.avatarUrl || '';
        nextProfile.statusText = TEXTS.loginExpired;
        this.saveLoginProfile(nextProfile);
      }
    });
  },

  loginAccount() {
    if (this.data.loginLoading) {
      return;
    }
    this.setData({ loginLoading: true });
    wx.login({
      success: (res) => {
        if (!res.code) {
          this.setData({ loginLoading: false });
          wx.showToast({ title: TEXTS.loginFailed, icon: 'none' });
          return;
        }
        const loginTime = formatDateTime(new Date());
        const currentProfile = this.data.loginProfile;
        if (!wx.cloud) {
          const nextProfile = {
            isLoggedIn: true,
            loginCode: res.code,
            openid: '',
            appid: '',
            unionid: '',
            loginTime: loginTime,
            statusText: TEXTS.needCloud,
            nickname: currentProfile.nickname || '',
            avatarUrl: currentProfile.avatarUrl || ''
          };
          this.saveLoginProfile(nextProfile);
          this.setData({ loginLoading: false });
          wx.showToast({ title: TEXTS.gotCredential, icon: 'none' });
          return;
        }
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: { type: 'getOpenId', code: res.code }
        }).then((resp) => {
          const result = resp.result || {};
          const nextProfile = {
            isLoggedIn: true,
            loginCode: res.code,
            openid: result.openid || '',
            appid: result.appid || '',
            unionid: result.unionid || '',
            loginTime: loginTime,
            statusText: result.openid ? TEXTS.loginSuccess : TEXTS.loggedIn,
            nickname: currentProfile.nickname || '',
            avatarUrl: currentProfile.avatarUrl || ''
          };
          this.saveLoginProfile(nextProfile);
          this.setData({ loginLoading: false });
          wx.showToast({ title: TEXTS.loginSuccess, icon: 'success' });
        }).catch(() => {
          const nextProfile = {
            isLoggedIn: true,
            loginCode: res.code,
            openid: '',
            appid: '',
            unionid: '',
            loginTime: loginTime,
            statusText: TEXTS.needEnv,
            nickname: currentProfile.nickname || '',
            avatarUrl: currentProfile.avatarUrl || ''
          };
          this.saveLoginProfile(nextProfile);
          this.setData({ loginLoading: false });
          wx.showToast({ title: TEXTS.gotCredential, icon: 'none' });
        });
      },
      fail: () => {
        this.setData({ loginLoading: false });
        wx.showToast({ title: TEXTS.loginFailed, icon: 'none' });
      }
    });
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl || '';
    if (!avatarUrl) {
      return;
    }
    this.saveLoginProfile(Object.assign({}, this.data.loginProfile, { avatarUrl: avatarUrl }));
  },

  onNicknameInput(e) {
    this.setData({ 'loginProfile.nickname': String(e.detail.value || '') });
  },

  onNicknameBlur(e) {
    const nickname = String(e.detail.value || '').trim();
    this.saveLoginProfile(Object.assign({}, this.data.loginProfile, { nickname: nickname }));
  },

  logoutAccount() {
    const currentProfile = this.data.loginProfile;
    const loginProfile = createEmptyLoginProfile();
    loginProfile.nickname = currentProfile.nickname || '';
    loginProfile.avatarUrl = currentProfile.avatarUrl || '';
    loginProfile.statusText = TEXTS.logoutStatus;
    this.saveLoginProfile(loginProfile);
    wx.showToast({ title: TEXTS.logoutToast, icon: 'success' });
  },

  toggleSortPanel() {
    this.setData({ showSortPanel: !this.data.showSortPanel, showCategoryPanel: false });
  },

  toggleCategoryPanel() {
    this.setData({ showCategoryPanel: !this.data.showCategoryPanel, showSortPanel: false });
  },

  changeSort(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      sortKey: key,
      vehicles: this.applyFilters(this.data.rawVehicles, key, this.data.searchKeyword, this.data.categoryField, this.data.categoryValue)
    });
  },

  changeCategoryField(e) {
    const key = e.currentTarget.dataset.key;
    const categoryValues = getCategoryValues(this.data.rawVehicles, key);
    const categoryValue = TEXTS.all;
    this.setData({
      categoryField: key,
      categoryValues: categoryValues,
      categoryValue: categoryValue,
      vehicles: this.applyFilters(this.data.rawVehicles, this.data.sortKey, this.data.searchKeyword, key, categoryValue)
    });
  },

  changeCategoryValue(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      categoryValue: value,
      vehicles: this.applyFilters(this.data.rawVehicles, this.data.sortKey, this.data.searchKeyword, this.data.categoryField, value)
    });
  },

  onSearchInput(e) {
    const searchKeyword = e.detail.value;
    this.setData({
      searchKeyword: searchKeyword,
      vehicles: this.applyFilters(this.data.rawVehicles, this.data.sortKey, searchKeyword, this.data.categoryField, this.data.categoryValue)
    });
  },

  clearSearch() {
    this.setData({
      searchKeyword: '',
      vehicles: this.applyFilters(this.data.rawVehicles, this.data.sortKey, '', this.data.categoryField, this.data.categoryValue)
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab, showSortPanel: false, showCategoryPanel: false });
  },

  openDetail(e) {
    wx.navigateTo({ url: '/pages/detail/index?id=' + e.currentTarget.dataset.id });
  },

  openExcelTemplate() {
    this.setData({ showTemplatePreview: true });
  },


  importVehicleExcel() {
    if (!wx.cloud) {
      wx.showToast({ title: TEXTS.importNeedCloud, icon: 'none' });
      return;
    }
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['xlsx', 'xls'],
      success: (res) => {
        const tempFile = (res.tempFiles || [])[0];
        const filePath = tempFile && (tempFile.path || tempFile.tempFilePath);
        if (!filePath) {
          wx.showToast({ title: TEXTS.importFailed, icon: 'none' });
          return;
        }
        const fileName = String(tempFile.name || 'vehicle-import.xlsx');
        const ext = fileName.toLowerCase().endsWith('.xls') ? 'xls' : 'xlsx';
        wx.showLoading({ title: TEXTS.importingExcel, mask: true });
        wx.cloud.uploadFile({
          cloudPath: 'vehicle-import/' + Date.now() + '-' + Math.random().toString(16).slice(2) + '.' + ext,
          filePath: filePath
        }).then((uploadRes) => {
          return wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
              type: 'parseVehicleExcel',
              fileID: uploadRes.fileID
            }
          });
        }).then((callRes) => {
          const rows = (callRes.result && callRes.result.rows) || [];
          const importedVehicles = buildImportedVehicles(rows);
          if (!importedVehicles.length) {
            wx.hideLoading();
            wx.showToast({ title: TEXTS.importNoData, icon: 'none' });
            return;
          }
          const rawVehicles = importedVehicles.concat(this.data.rawVehicles);
          const categoryValues = getCategoryValues(rawVehicles, this.data.categoryField);
          const categoryValue = categoryValues.indexOf(this.data.categoryValue) !== -1 ? this.data.categoryValue : TEXTS.all;
          const vehicles = this.applyFilters(rawVehicles, this.data.sortKey, this.data.searchKeyword, this.data.categoryField, categoryValue);
          const availableTags = getAvailableTags(rawVehicles, []);
          const availableColors = getAvailableColors(rawVehicles, []);
          this.saveVehicles(rawVehicles);
          this.setData({
            rawVehicles: rawVehicles,
            categoryValues: categoryValues,
            categoryValue: categoryValue,
            vehicles: vehicles,
            currentTab: 'garage',
            form: createEmptyForm(),
            availableTags: availableTags,
            availableColors: availableColors,
            filteredTags: getFilteredSuggestions(availableTags, ''),
            showColorTags: false,
            showTagSuggestions: false
          });
          wx.hideLoading();
          wx.showToast({ title: importedVehicles.length > 1 ? TEXTS.importBatchSuccess : TEXTS.importSuccess, icon: 'success' });
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: TEXTS.importFailed, icon: 'none' });
        });
      }
    });
  },
  closeTemplatePreview() {
    this.setData({ showTemplatePreview: false });
  },


  noop() {},

  chooseImages() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles || [];
        if (!tempFiles.length) {
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
      availableColors: getAvailableColors(this.data.rawVehicles, colorList)
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
      availableTags: getAvailableTags(this.data.rawVehicles, tagList),
      filteredTags: getFilteredSuggestions(getAvailableTags(this.data.rawVehicles, tagList), tagList.join(', '))
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
        availableColors: getAvailableColors(this.data.rawVehicles, colorList)
      });
      return;
    }
    if (field === 'tagText') {
      const tagList = normalizeTags(value);
      const availableTags = getAvailableTags(this.data.rawVehicles, tagList);
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
    const vehicle = normalizeVehicle({
      id: Date.now(),
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
    const rawVehicles = [vehicle].concat(this.data.rawVehicles);
    const categoryValues = getCategoryValues(rawVehicles, this.data.categoryField);
    const categoryValue = categoryValues.indexOf(this.data.categoryValue) !== -1 ? this.data.categoryValue : TEXTS.all;
    const vehicles = this.applyFilters(rawVehicles, this.data.sortKey, this.data.searchKeyword, this.data.categoryField, categoryValue);
    this.saveVehicles(rawVehicles);
    this.setData({
      rawVehicles: rawVehicles,
      categoryValues: categoryValues,
      categoryValue: categoryValue,
      vehicles: vehicles,
      currentTab: 'garage',
      form: createEmptyForm(),
      availableTags: getAvailableTags(rawVehicles, []),
      availableColors: getAvailableColors(rawVehicles, []),
      filteredTags: getFilteredSuggestions(getAvailableTags(rawVehicles, []), ''),
      showColorTags: false,
      showTagSuggestions: false
    });
    wx.showToast({ title: TEXTS.addSuccess, icon: 'success' });
  }
});
