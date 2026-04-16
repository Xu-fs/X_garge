const cloud = require("wx-server-sdk");
const XLSX = require("xlsx");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const HEADER_MAP = {
  "\u8f66\u6a21\u54c1\u724c": "modelBrand",
  "\u7f16\u53f7": "serialNumber",
  "\u8f66\u8f86\u54c1\u724c": "vehicleBrand",
  "\u5177\u4f53\u578b\u53f7": "specificModel",
  "\u989c\u8272": "color",
  "\u5206\u7c7b\u6807\u7b7e": "tags",
  "\u8d2d\u5165\u65f6\u95f4": "purchaseDate",
  "\u8d2d\u5165\u4ef7\u683c": "purchasePrice",
  "\u5907\u6ce8": "note",
};

function normalizeImportedRow(row) {
  const normalized = {};
  Object.keys(HEADER_MAP).forEach((header) => {
    const rawValue = row[header];
    if (rawValue === undefined || rawValue === null) {
      return;
    }
    const value = String(rawValue).trim();
    if (!value) {
      return;
    }
    normalized[HEADER_MAP[header]] = value;
  });
  return normalized;
}

async function getOpenId() {
  const wxContext = cloud.getWXContext();
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
}

async function parseVehicleExcel(event) {
  if (!event.fileID) {
    return { rows: [] };
  }

  const downloadResult = await cloud.downloadFile({
    fileID: event.fileID,
  });

  const workbook = XLSX.read(downloadResult.fileContent, {
    type: "buffer",
    cellDates: true,
  });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { rows: [] };
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });

  return {
    rows: rows.map(normalizeImportedRow).filter((row) => Object.keys(row).length),
  };
}

exports.main = async (event) => {
  switch (event.type) {
    case "getOpenId":
      return await getOpenId();
    case "parseVehicleExcel":
      return await parseVehicleExcel(event);
    default:
      return { success: false, errMsg: "Unknown event type" };
  }
};