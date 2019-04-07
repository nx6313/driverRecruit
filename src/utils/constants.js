export const BASE_URL = {
  // server_address_production = "http://172.18.2.32:8080/" // 一飞
  // server_address_production = "http://172.18.2.26:8080/" // 玉慧
  // server_address_production = "http://172.18.2.21:7777/" // 璐璐
  // server_address_production: "http://172.18.2.14:8080/", // 泽明

  server_address_test: 'https://test.dcchuxing.com/', // 测试服务器
  server_address_development: 'https://newpre.dcchuxing.com/', // 预生产服务器
  server_address_production: 'https://new.dcchuxing.com/', // 生产服务器

  datapro_server_base_address_file: 'https://file.chinadatapay.com', // 数据宝图片上传生产环境基本地址
  datapro_server_base_address: 'http://api.chinadatapay.com', // 数据宝接口生产环境基本地址

  server_official: 'https://new.dcchuxing.com/' // 正式服务器，该值仅用于判断使用
}

export const APP_CONFIG = {
  isTest: false, // 设置h5是否为测试环境，将忽略内置环境
  openCredentialsDetaction: true, // 是否开启证件检测
  serverEnvironment: 't' // 默认环境   生产服务器:p 、 预生产服务器:d 、 测试服:t
}

export const CONFIG_DATA = {
  idCardOcrApiKey: '9be531fdf84fd71b53aba94caad95178', // 数据宝 身份证OCR识别（尊享版） ApiKey
  driverCardOcrApiKey: 'a5d74317a5f3968eed5fb016fd3f3aaa', // 数据宝 驾驶证OCR识别 ApiKey
  runCardOcrApiKey: 'b5871d82d8d3cbda24f36cd83c9da233', // 数据宝 行驶证OCR识别 ApiKey
  userCardCompareApiKey: '53edc190902fe6ab15685e51f9e3290a', // 数据宝 人像比对（尊享版） ApiKey
  realNameAuthApiKey: 'c67e870268ca6cbed72d830f378d915e' // 数据宝 实名认证(尊享版) ApiKey
}
