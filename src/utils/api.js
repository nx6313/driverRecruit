import { BASE_URL } from '@/utils/constants'

export default {
    // 上传文件接口
    file: 'other/file',
    // 发送登陆短信验证码
    getSms: 'account/api/getSms',
    // 通过短信验证码登陆
    loginBySms: 'account/api/loginBySms',
    // 判断用户是否为司机
    isDriver: 'member/api/member/isDriver',
    // 获取用户当前司机招募的状态
    applyDriver: 'member/api/member/applyDriver',
    // 发送司机招募资料中手机号的短信验证码
    applySms: 'member/api/member/applySms',
    // 验证司机招募资料中手机号的短信验证码
    applyDriverSmsCode: 'member/api/member/applyDriverSmsCode',
    // 提交司机招募资料信息
    applyInfo: 'member/api/member/applyInfo',
    // 获取司机招募规则阅读状态信息
    applyIsRuleRead: 'member/api/member/applyIsRuleRead',
    // 更新司机招募某一条规则阅读状态并提交相关信息
    applyRuleRead: 'member/api/member/applyRuleRead',
    // 提交加盟车一项数据信息
    saveApplyDriverIntention: 'member/api/member/saveApplyDriverIntention',

    // 数据宝 上传图片
    dataProUploadImg: `${BASE_URL.datapro_server_base_address_file}/img/upload`,
    // 数据宝 身份证OCR识别（尊享版）
    dataProIdCard: `${BASE_URL.datapro_server_base_address}/trade/user/1985`, // key=您申请的key值&imageId=图片ID
    // 数据宝 驾驶证OCR识别
    dataProDriverCard: `${BASE_URL.datapro_server_base_address}/trade/user/2009`, // key=您申请的key值&imageId=图片ID
    // 数据宝 行驶证OCR识别
    dataProRunCard: `${BASE_URL.datapro_server_base_address}/trade/user/2132`, // key=您申请的key值&imageId=图片ID
    // 数据宝 人像比对（尊享版）
    dataProUserCardCompare: `${BASE_URL.datapro_server_base_address}/communication/personal/2061`, // key=您申请的key值&name=姓名&idcard=身份证号&imageI
    // 数据宝 实名认证(尊享版)
    dataProRealNameAuth: `${BASE_URL.datapro_server_base_address}/communication/personal/1882` // key=您申请的key值&name=姓名&idcard=身份证号
}
