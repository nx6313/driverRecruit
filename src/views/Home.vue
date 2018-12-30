<template>
  <div class="home">
    <img class="recruitCover" alt="RecruitCover" src="../assets/start_recruit.jpg">
    <router-link to="/about" class="signInDriver" tag="span">注册成为网约车司机</router-link>
    <Presentation ref="fffff"/>
  </div>
</template>

<script>
import Presentation from '@/components/Presentation.vue'

export default {
  name: 'home',
  components: {
    Presentation
  },
  data() {
    return {
      userDriverRecruitState: 0,
      driverRecruitState: {
        USER_IS_DRIVER: 0, // 该用户已经是司机了
        NORMAL: 10, // 该用户还未提交任何资料
        AUDITING: 20, // 该用户提交的资料正在审核中
        AUDIT_PASS: 21, // 该用户提交的资料审核已通过，通知其来公司面试
        AUDIT_NO_PASS: 22, // 该用户提交的资料审核未通过
        INTERVIEW_PASS: 31, // 该用户已通过公司面试，需要阅读具体规则
        INTERVIEW_NO_PASS: 32, // 该用户未通过公司面试
        RULEING: 40, // 该用户提交的规则资料正在审核中
        RULE_PASS: 41, // 该用户提交的规则资料已通过审核
        RULE_NO_PASS_NO_UPDATE: 42, // 该用户提交的规则资料未通过审核，不可修改
        RULE_NO_PASS_CAN_UPDATE: 43 // 该用户提交的规则资料未通过审核，可修改后重新提交
      }
    }
  },
  mounted() {},
  created() {
    console.log(this.$comfun.encryptedData('secret=7jgfsec5l9jh9ybbvdq6rofhogswmuzy&token=uwjqqdrnllztafakpymunscvk15rp4sv'))
    if (!this.$comfun.hasAuthInfo(this)) {
      let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      this.$comfun.showDialogWithPrompt(this, '网址内未发现必要的参数', '是否需要登陆一个账号进行测试使用？此操作将会发送手机验证码', true, '请输入您的测试账号', myreg, '手机号正确', '手机号错误', (phoneNumber) => {
        this.getSms(phoneNumber)
      }, (verify) => {
        if (verify.result) {
          verify.btns.okBtn[0].innerText = '发送短信验证码'
        } else {
          verify.btns.okBtn[0].innerText = '确认'
        }
      })
    } else {
      // url中有必要的参数
      this.getUserDriverRecruit()
    }
  },
  methods: {
    getSms: function(phone) {
      this.$comfun.showLoading(this, 'getSms', false)
      this.$comfun.http_post(this, 'api/getSms', {
        phone: phone
      }).then((request) => {
        this.$comfun.hideLoading('getSms')
        if (request.data.status == 'OK') {
          this.$comfun.showToast(this, '验证码短信已发送，请注意查收')
          this.$comfun.showDialogWithPrompt(this, '请输入您收到的短信验证码', undefined, false, '输入短信验证码', undefined, undefined, undefined, (smsCode) => {
            this.loginBySms(phone, smsCode)
          })
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    loginBySms: function(phone, smsCode) {
      this.$comfun.showLoading(this, 'loginBySms', false)
      this.$comfun.http_post(this, 'api/loginBySms', {
        phone: phone,
        smsCode: smsCode,
        landingIp: '',
        port: '',
        landingIMEI: '',
        landingIMSI: '',
        macAddress: '',
        landingLatitude: 0.0,
        landingLongitude: 0.0
      }).then((request) => {
        this.$comfun.hideLoading('loginBySms')
        if (request.data.status == 'OK') {
          this.$store.commit('updateAuth', {
            secret: request.data.data.secret,
            token: request.data.data.token,
            serviceType: this.$store.state.auth.serviceType
          })
          this.getUserDriverRecruit()
        } else {
          this.$comfun.showToast(this, request.data.msg)
          this.$comfun.showDialogWithPrompt(this, '请重新输入您收到的短信验证码', undefined, false, '输入短信验证码', undefined, undefined, undefined, (smsCode) => {
            this.loginBySms(phone, this.$comfun.encryptedData(smsCode))
          })
        }
      })
    },
    getUserDriverRecruit: function() {
      this.$comfun.showLoading(this, 'applyDriver', false)
      this.$comfun.http_post(this, 'api/member/applyDriver', null).then((request) => {
        this.$comfun.hideLoading('applyDriver')
        console.log(request.data.msg)
        if (request.data.status == 'OK') {
          this.userDriverRecruitState = request.data.data.state
        } else {
          this.$comfun.showToast(this, request.data.msg)
          if (!this.$comfun.hasAuthInfo(this)) {
            this.$comfun.showDialog('提示信息', '用户司机招募初始化信息获取失败，需要重新获取吗？', () => {
              this.getUserDriverRecruit()
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  overflow: none;
}

.recruitCover {
  width: 100vw;
  height: 88vh;
}

.signInDriver {
  position: relative;
  display: block;
  width: 92vw;
  background: #2b2b2b;
  color: #ffffff;
  text-align: center;
  left: 4vw;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  margin-top: 0.8rem;
  font-size: 0.8rem;
  border-radius: 2px;
  box-shadow: 0px 0px 2px #4e4e4ea6;
}
</style>
