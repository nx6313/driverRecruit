<template>
  <div class="loginPage">
    <div class="title">登录 / 授权</div>
    <div class="des">
      <span>感谢您选择大昌出行</span>
      <span>请先输入您的手机号码</span>
    </div>
    <div class="inputItemWrap phoneWrap">
      <input type="number" v-model="phone">
      <i class="clearIcon animated fadeIn" v-if="showClearBtn" @click="phone = ''"></i>
    </div>
    <div class="inputItemWrap smsCodeWrap">
      <input type="text" v-model="smsCode">
      <span :class="['getSmsCodeBtn', (smsBtnCanUse && !timerStart) ? 'canUse' : '']" @click="getSmsCode">{{timerStart ? `${canUseGetSmsCodeBtnTime}s 后重发` : '获取验证码'}}</span>
    </div>
    <span :class="['toLoginBtn', loginBtnCanUse ? 'toLoginBtnCanUse' : '']" @click="toLogin">登录授权</span>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'

export default {
  name: 'login',
  data () {
    return {
      phone: '',
      smsCode: '',
      showClearBtn: false,
      smsBtnCanUse: false,
      canUseGetSmsCodeBtnTime: 100,
      timerStart: false,
      timer: null,
      userIsDriver: null
    }
  },
  computed: {
    loginBtnCanUse () {
      return this.smsBtnCanUse && this.smsCode.trim() !== ''
    }
  },
  created () {
    this.phone = this.$store.state.pageData.data === null ? '' : (this.$store.state.pageData.data.loginPhone || '')
    this.timerStart = this.$store.state.pageData.data === null ? false : (this.$store.state.pageData.data.loginCurrentTimerStart || false)
    this.canUseGetSmsCodeBtnTime = this.$store.state.pageData.data === null ? 100 : (this.$store.state.pageData.data.loginCurrentTime || 100)
    if (this.timerStart) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.canUseGetSmsCodeBtnTime -= 1
        if (this.canUseGetSmsCodeBtnTime === 0) {
          clearInterval(this.timer)
          this.timerStart = false
          this.canUseGetSmsCodeBtnTime = 100
        }
        this.$store.commit('setPageData', {
          data: {
            loginPhone: this.phone.trim(),
            loginCurrentTimerStart: this.timerStart,
            loginCurrentTime: this.canUseGetSmsCodeBtnTime
          }
        })
      }, 1000)
    }
  },
  methods: {
    getSmsCode () {
      if (!this.smsBtnCanUse || this.timerStart) return false
      this.$comfun.showLoading(this, 'getSms', false)
      this.$comfun.http_post(this, this.$api.getSms, {
        phone: this.phone.trim()
      }).then((request) => {
        this.$comfun.hideLoading('getSms')
        if (request.data.status == 'OK') {
          this.$comfun.showToast(this, '短信验证码发送成功，请注意查收')
          this.timerStart = true
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.canUseGetSmsCodeBtnTime -= 1
            if (this.canUseGetSmsCodeBtnTime === 0) {
              clearInterval(this.timer)
              this.timerStart = false
              this.canUseGetSmsCodeBtnTime = 100
            }
            this.$store.commit('setPageData', {
              data: {
                loginPhone: this.phone.trim(),
                loginCurrentTimerStart: this.timerStart,
                loginCurrentTime: this.canUseGetSmsCodeBtnTime
              }
            })
          }, 1000)
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    toLogin () {
      if (!this.loginBtnCanUse) return false
      if (SOME_RULES.emoji.test(this.smsCode.trim())) { this.$comfun.showToast(this, '验证码中不能含有特殊字符'); return false }
      this.$comfun.showLoading(this, 'loginBySms', false)
      this.$comfun.http_post(this, this.$api.loginBySms, {
        phone: this.phone.trim(),
        smsCode: this.smsCode.trim()
      }).then((request) => {
        this.$comfun.hideLoading('loginBySms')
        if (request.data.status == 'OK') {
          this.$comfun.showToast(this, '登录授权成功')
          this.$store.commit('updateUserBaseInfoPhone', {
            phone: this.phone.trim()
          })
          this.$store.commit('updateAuth', {
            secret: request.data.data.secret,
            token: request.data.data.token
          })
          this.$store.commit('updateAuthLoginType', true)
          this.toPage()
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    toPage () {
      let key = this.$store.state.userBaseInfo.dType
      if (key === null) {
        this.$router.back()
        return false
      }
      this.$comfun.showLoading(this, 'isDriver', false)
      this.$comfun.http_post(this, this.$api.isDriver, {
        phone: this.phone.trim()
      }).then((request) => {
        this.$comfun.hideLoading('isDriver')
        console.log('司机招募登录页', request.data)
        if (request.data.status == 'OK') {
          if (request.data.data.state === 1) {
            this.userIsDriver = false
          } else {
            this.userIsDriver = true
          }
          if (this.userIsDriver === true) {
            // 已经是司机了
            this.$router.replace('/isDriver')
          } else if (this.userIsDriver === false) {
            if (key === '1') {
              // 自营专职加盟
              this.$router.replace('/fullTimeHome')
            } else if (key === '2') {
              // 购车加盟
              this.$router.replace('/buyCarHome')
            } else if (key === '3') {
              // 带车加盟
              this.$router.replace('/haveCarHome')
            } else if (key === '4') {
              // 租车加盟
              this.$router.replace('/rentCarHome')
            }
          } else {
            this.isDriver(this.$store.state.userBaseInfo.phone, () => {
              if (this.userIsDriver === true) {
                // 已经是司机了
                this.$router.replace('/isDriver')
              } else if (this.userIsDriver === false) {
                if (key === '1') {
                  // 自营专职加盟
                  this.$router.replace('/fullTimeHome')
                } else if (key === '2') {
                  // 购车加盟
                  this.$router.replace('/buyCarHome')
                } else if (key === '3') {
                  // 带车加盟
                  this.$router.replace('/haveCarHome')
                } else if (key === '4') {
                  // 租车加盟
                  this.$router.replace('/rentCarHome')
                }
              }
            })
          }
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    }
  },
  watch: {
    phone (val) {
      if (val !== '') {
        this.showClearBtn = true
        if (SOME_RULES.phone.test(val.trim()))
          this.smsBtnCanUse = true
        else 
          this.smsBtnCanUse = false
      } else {
        this.showClearBtn = false
        this.smsBtnCanUse = false
        this.timerStart = false
        this.canUseGetSmsCodeBtnTime = 100
        clearInterval(this.timer)
        this.$store.commit('setPageData', {
          data: {
            loginPhone: val.trim(),
            loginCurrentTimerStart: this.timerStart,
            loginCurrentTime: this.canUseGetSmsCodeBtnTime
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.loginPage {
  position: relative;
  padding: 1.8rem 0.8rem;
  .title {
    position: relative;
    font-size: 1.6rem;
  }
  .des {
    position: relative;
    margin-top: 1.2rem;
    span {
      font-size: 0.8rem;
      display: block;
      line-height: 1.2rem;
    }
  }
  .inputItemWrap {
    position: relative;
    width: 100%;
    height: 3rem;
    margin-top: 0.8rem;
    input {
      width: calc(100% - 0.8rem - 4rem);
      height: 100%;
      border: none;
      padding: 0 0.8rem 0 4rem;
      background-color: #f3f3f3;
      color: #585858;
    }
  }
  .inputItemWrap::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0.8rem;
    line-height: 3rem;
    font-size: 0.8rem;
  }
  .phoneWrap::before {
    content: '手机号';
  }
  .smsCodeWrap::before {
    content: '验证码';
  }
  .phoneWrap {
    input {
      width: calc(100% - 3.8rem - 4rem);
      padding: 0 3.8rem 0 4rem;
    }
    .clearIcon {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 3rem;
      background-image: url('./../assets/icon_clear.png');
      background-size: 40%;
      background-repeat: no-repeat;
      background-position: center;
      -vendor-animation-duration: 0.2s;
      animation-duration: 0.2s;
    }
  }
  .smsCodeWrap {
    input {
      width: calc(100% - 5.4rem - 4rem);
      padding: 0 5.4rem 0 4rem;
    }
    .getSmsCodeBtn {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 5.4rem;
      text-align: center;
      line-height: 3rem;
      font-size: 0.8rem;
      color: #ffffff;
      background-color: #bdbdbd;
      transition: all 0.2s;
    }
    .canUse {
      background-color: #d67681;
    }
  }
  .toLoginBtn {
    position: relative;
    display: block;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    margin-top: 2.2rem;
    text-align: center;
    background-color: #bdbdbd;
    color: #ffffff;
    transition: all 0.2s;
    font-size: 0.8rem;
  }
  .toLoginBtnCanUse {
    background-color: #d67681;
  }
}
</style>
