export const BASE_URL = {
  datapro_server_base_address_file: 'https://file.chinadatapay.com', // 数据宝图片上传生产环境基本地址
  datapro_server_base_address: 'http://api.chinadatapay.com' // 数据宝接口生产环境基本地址
}

export const APP_CONFIG = {
  isTest: false, // 设置h5是否为测试环境，将忽略内置环境 开启顶部服务器提示调试工具
  openCredentialsDetaction: false, // 是否开启证件检测
  // 172.18.2.32:8080 // 一飞
  // 172.18.2.26:8080 // 玉慧
  // 172.18.2.21:7777 // 璐璐
  // 172.18.2.14:8080 // 泽明
  // https://test.dcchuxing.com
  localhostServerBaseUrl: 'https://test.dcchuxing.com/' // 默认环境   生产服务器:new 、 预生产服务器:newpre 、 测试服:test   仅影响本地
}

export const CONFIG_DATA = {
  fullTimeContactPhone: '0351-3183896', // 全职自营 联系人电话
  fullTimeContactPeople: '王经理', // 全职自营 联系人姓名
  joinContactPhone: '0351-3183896', // 加盟司机 联系人电话
  joinContactPeople: '王经理', // 加盟司机 联系人姓名

  idCardOcrApiKey: '9be531fdf84fd71b53aba94caad95178', // 数据宝 身份证OCR识别（尊享版） ApiKey
  driverCardOcrApiKey: 'a5d74317a5f3968eed5fb016fd3f3aaa', // 数据宝 驾驶证OCR识别 ApiKey
  runCardOcrApiKey: 'b5871d82d8d3cbda24f36cd83c9da233', // 数据宝 行驶证OCR识别 ApiKey
  // userCardCompareApiKey: '53edc190902fe6ab15685e51f9e3290a', // 数据宝 人像比对（尊享版） ApiKey
  realNameAuthApiKey: 'c67e870268ca6cbed72d830f378d915e', // 数据宝 实名认证(尊享版) ApiKey
  driverCardStatusApiKey: 'cf486fe6451889a0573128b97b6c73df', // 数据宝 驾驶证状态核验 ApiKey
  runCardCheckApiKey: '9af0bb6aac96ff7be38d4c7bf2053630', // 数据宝 行驶证五要素核验 ApiKey
  driverCardCheckApiKey: '708160dc6089edf0eddcb506a738b3b5' // 数据宝 驾驶证五要素核验V2 ApiKey
}
