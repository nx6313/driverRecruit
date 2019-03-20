export const BASE_URL = {
  // server_address_production = "http://172.18.2.32:8080/" // 一飞
  // server_address_production = "http://172.18.2.26:8080/" // 玉慧
  // server_address_production = "http://172.18.2.21:7777/" // 璐璐
  // server_address_production: "http://172.18.2.14:8080/", // 泽明

  server_address_test: 'https://test.dcchuxing.com/', // 测试服务器
  server_address_development: 'https://newpre.dcchuxing.com/', // 预生产服务器
  server_address_production: 'https://new.dcchuxing.com/', // 生产服务器

  server_official: 'https://new.dcchuxing.com/' // 正式服务器，该值仅用于判断使用
}

export const APP_CONFIG = {
  isTest: false // 设置h5是否为测试环境，将忽略内置环境
}
