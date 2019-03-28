<template>
  <div class="pageWrap">
    <swiper :options="bannerOption" class="bannerWrap">
      <swiper-slide v-for="(banner, bannerIndex) in banners" v-bind:key="bannerIndex">
        <div class="bannerContentWrap" :style="{ backgroundImage: `url(${banner})` }"></div>
      </swiper-slide>
    </swiper>
    <img class="dcLogo" v-lazy="require('@/assets/dc_logo.png')">
    <div class="pageContentWrap selecter">
      <div class="topTip">成为大昌出行司机</div>
      <div class="title">收入更稳定，更多上升空间，更多权益保障</div>
      <div class="dec">稳定体面的事业选择，为您和家人带来更好的生活。</div>
      <div class="selecterWrap" :style="{ height: `calc(3.1rem * ${Math.ceil(selecters.length / 2)} + 1.6rem + 0.9rem * (${Math.ceil(selecters.length / 2)} - 1))` }">
        <div class="currentProgressOfAuditForFullTime" v-if="progressOfAudit != null && progressOfAudit != ''">
          <span class="tip">申请自营司机进度：</span>
          <span class="trail">
            <Marquee :lists="[progressOfAudit]"></Marquee>
          </span>
        </div>
        <div :class="['selecterItemWrap', sel.isRecommend ? 'selecterItemIsRecommend' : '']" v-for="(sel, selIndex) in selecters" v-bind:key="selIndex" @click="toADriverRecruit(sel.key)">
          <span class="selecterItemName">{{sel.name}}</span>
          <span class="selecterItemTip">了解详情</span>
        </div>
      </div>
    </div>
    <div class="pageContentWrap currentNews">
      <swiper :options="newsOption" class="newsBannerWrap">
        <swiper-slide v-for="(newsBanner, newsBannerIndex) in newsBanners" v-bind:key="newsBannerIndex">
          <div class="newsTxt">{{newsBanner}}</div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="pageContentWrap dcGoMerit">
      <div class="title">大昌出行的优势</div>
      <div class="meritWrap">
        <img v-lazy="require('@/assets/merit_1.png')">
        <img v-lazy="require('@/assets/merit_2.png')">
        <img v-lazy="require('@/assets/merit_3.png')">
      </div>
    </div>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'
import Marquee from '@/components/Marquee.vue'

export default {
  name: 'index',
  inject: ['reload'],
  components: {
    Marquee
  },
  data() {
    return {
      autoShowLoginDialog: false,
      bannerOption: {
        autoplay: {
          disableOnInteraction: false,
          delay: 8000
        },
        effect: 'fade',
        lazy: true,
        loop: true
      },
      banners: [
        require('@/assets/index_banner_1.png')
      ],
      newsOption: {
        autoplay: {
          disableOnInteraction: false
        },
        allowTouchMove: false,
        direction: 'vertical',
        height: 30,
        lazy: true,
        loop: true
      },
      newsBanners: [
        '王师傅 135****0806 申请了租车加盟',
        '李师傅 138****0214 申请了自营车加盟',
        '刘师傅 137****6251 申请了购车加盟',
        '张师傅 183****1025 申请了带车加盟',
        '刘师傅 137****4578 申请了自营车加盟',
        '牛师傅 186****1457 申请了自营车加盟',
        '姚师傅 137****3002 申请了带车加盟',
        '王师傅 137****3651 申请了租车加盟',
        '刘师傅 135****0369 申请了购车加盟',
        '牛师傅 137****3251 申请了租车加盟',
        '郑师傅 138****2680 申请了自营车加盟',
        '韩师傅 137****3612 申请了购车加盟',
        '刘师傅 138****0194 申请了租车加盟',
        '刘师傅 183****3521 申请了购车加盟',
        '朱师傅 186****8415 申请了带车加盟',
        '冯师傅 137****9521 申请了自营车加盟',
        '赵师傅 183****6517 申请了购车加盟',
        '蒋师傅 138****2541 申请了带车加盟',
        '杨师傅 137****3650 申请了购车加盟',
        '牛师傅 186****0680 申请了租车加盟',
        '刘师傅 183****3061 申请了购车加盟',
        '许师傅 135****8463 申请了租车加盟'
      ],
      progressOfAudit: '',
      selecters: [
        // {
        //   key: '4',
        //   name: '租车加盟',
        //   isRecommend: true
        // },
        // {
        //   key: '2',
        //   name: '购车加盟',
        //   isRecommend: false
        // },
        {
          key: '1',
          name: '专车全职',
          isRecommend: false
        },
        {
          key: '3',
          name: '带车加盟',
          isRecommend: true
        }
      ],
      userIsDriver: null
    }
  },
  computed: {
    userPhone() {
      return this.$store.state.userBaseInfo.phone
    }
  },
  created() {
    this.$store.dispatch('clearAll')
    // this.$store.dispatch('clearUserBaseInfo')
    this.$store.commit('updateServiceType', {
      type: this.$comfun.getServiceType(this)
    })
    if (this.autoShowLoginDialog) {
      // this.showLoginDialog()
    }
    if (this.$comfun.hasAuthInfo(this)) {
      this.isDriver(this.userPhone)
    }
  },
  methods: {
    showLoginDialog: function() {
      let myreg = SOME_RULES.phone
      this.$comfun.showDialogForLogin(this, '请您先进行登录', '欢迎来到大昌出行司机招募，首先请输入您的手机号进行登录（任意手机号都可以哦）', myreg, '账号格式正确', '请输入正确的手机号', (phoneNumber) => {
        this.applySms(phoneNumber)
      }, (phone, code) => {
        this.applyDriverSmsCode(phone, code)
      })
    },
    isDriver: function(phone, callBack) {
      this.$comfun.showLoading(this, 'isDriver', false)
      this.$comfun.http_post(this, this.$api.isDriver, {
        phone: phone
      }).then((request) => {
        this.$comfun.hideLoading('isDriver')
        console.log('司机招募首页', request.data)
        if (request.data.status == 'OK') {
          this.progressOfAudit = request.data.data.progressOfAudit || ''
          this.$store.commit('updateUserBaseInfoPhone', {
            phone: request.data.data.phone
          })
          if (request.data.data.state === 1) {
            this.userIsDriver = false
          } else {
            this.userIsDriver = true
          }
          if (callBack) callBack()
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    applySms: function(phone) {
      this.$comfun.showLoading(this, 'applySms', false)
      this.$comfun.http_post(this, this.$api.applySms, {
        phone: phone
      }).then((request) => {
        this.$comfun.hideLoading('applySms')
        if (request.data.status == 'OK') {
          this.$comfun.showToast(this, '验证码短信已发送，请注意查收')
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    applyDriverSmsCode: function(phone, smsCode) {
      this.$comfun.showLoading(this, 'applyDriverSmsCode', false)
      this.$comfun.http_post(this, this.$api.applyDriverSmsCode, {
        phone: phone,
        sms_code: smsCode
      }).then((request) => {
        this.$comfun.hideLoading('applyDriverSmsCode')
        if (request.data.status == 'OK') {
          this.$store.commit('updateUserBaseInfoPhone', {
            phone: phone
          })
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    toADriverRecruit: function(key) {
      if (!this.$comfun.hasAuthInfo(this) && this.$store.state.userBaseInfo.phone == null) {
        // this.showLoginDialog()
        this.$comfun.showToast(this, '未检测到登录信息，请先登录')
        return false
      } else {
        this.$store.commit('updateUserBaseInfoDType', {
          dType: key
        })
        if (this.userIsDriver === true) {
          // 已经是司机了
          this.$router.push('/isDriver')
        } else if (this.userIsDriver === false) {
          if (key === '1') {
            // 自营专职加盟
            this.$router.push('/fullTimeHome')
          } else if (key === '2') {
            // 购车加盟
            this.$router.push('/buyCarHome')
          } else if (key === '3') {
            // 带车加盟
            this.$router.push('/haveCarHome')
          } else if (key === '4') {
            // 租车加盟
            this.$router.push('/rentCarHome')
          }
        } else {
          this.isDriver(this.$store.state.userBaseInfo.phone, () => {
            if (this.userIsDriver === true) {
              // 已经是司机了
              this.$router.push('/isDriver')
            } else if (this.userIsDriver === false) {
              if (key === '1') {
                // 自营专职加盟
                this.$router.push('/fullTimeHome')
              } else if (key === '2') {
                // 购车加盟
                this.$router.push('/buyCarHome')
              } else if (key === '3') {
                // 带车加盟
                this.$router.push('/haveCarHome')
              } else if (key === '4') {
                // 租车加盟
                this.$router.push('/rentCarHome')
              }
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pageWrap {
  position: relative;
  .bannerWrap {
    position: relative;
    padding-bottom: 3rem;
    .bannerContentWrap {
      position: relative;
      height: 10rem;
      background-size: 100vw;
      background-repeat: no-repeat;
      background-position: bottom;
      background-color: #ffffff;
    }
    .bannerContentWrap::before {
      content: '';
      position: absolute;
      display: inline-block;
      width: 100%;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rem;
      background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), #ffffff); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), #ffffff); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), #ffffff); /* Firefox 3.6 - 15 */
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), #ffffff);
    }
    .bannerContentWrap::after {
      content: '';
      position: absolute;
      display: inline-block;
      width: 100%;
      bottom: -3rem;
      left: 0;
      right: 0;
      height: 3rem;
      background: -webkit-linear-gradient(top, #ffffff, rgba(0, 0, 0, 0)); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(bottom, #ffffff, rgba(0, 0, 0, 0)); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(bottom, #ffffff, rgba(0, 0, 0, 0)); /* Firefox 3.6 - 15 */
      background: linear-gradient(to bottom, #ffffff, rgba(0, 0, 0, 0));
    }
  }
  .dcLogo {
    position: absolute;
    width: 6rem;
    top: 1rem;
    left: 1rem;
    z-index: 9;
  }
  .pageContentWrap {
    position: relative;
    width: 90vw;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 3px;
    top: -3.6rem;
    box-shadow: 0px 4px 4px 0px rgba(192, 192, 192, 0.1);
    overflow: hidden;
    z-index: 9;
  }
  .pageContentWrap:nth-of-type(n + 2) {
    margin-top: 0.4rem;
  }
  .pageContentWrap:last-of-type {
    top: 0rem;
    margin-top: -3.2rem;
    margin-bottom: 1.4rem;
  }
  .selecter {
    padding: 0.4rem 1.2rem;
    width: calc(90vw - 2.4rem);
    .topTip {
      display: inline-block;
      background: -webkit-linear-gradient(left, #F94343, #F98C43); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #F94343, #F98C43); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #F94343, #F98C43); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #F94343, #F98C43);
      padding: 0.08rem 0.4rem;
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: bold;
      margin-top: 0.6rem;
      border-radius: 2px;
    }
    .title {
      font-size: 1.4rem;
      font-weight: bold;
      color: #303030;
      margin-top: 0.6rem;
    }
    .dec {
      font-size: 0.9rem;
      color: #9e9e9e;
      margin-top: 1rem;
    }
    .selecterWrap {
      position: relative;
      display: -webkit-flex;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
      align-items: center;
      margin-top: 2rem;
      margin-bottom: 0.9rem;
      .selecterItemWrap {
        position: relative;
        display: inline-block;
        width: calc(100% / 2 - 0.5rem);
        border-radius: 6px;
        background-color: #FF5252;
        color: #ffffff;
        text-align: center;
        padding: 0.4rem 0;
        height: 3.1rem;
        .selecterItemName {
          display: block;
          font-size: 1rem;
        }
        .selecterItemTip {
          display: inline-block;
          padding: 0.06rem 0.4rem;
          border-radius: 6px;
          font-size: 0.7rem;
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: rgb(255, 226, 226);
          margin-top: 0.4rem;
        }
      }
      .selecterItemIsRecommend::before {
        content: '';
        position: absolute;
        top: -0.94rem;
        left: -0.2rem;
        width: 2.4rem;
        height: 2rem;
        background-image: url('./../assets/icon_recommend.png');
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center;
      }
      .currentProgressOfAuditForFullTime {
        position: absolute;
        top: -1.4rem;
        left: 0;
        font-size: 0.7rem;
        padding-left: 1.2rem;
        color: #363636;
        width: calc(100% - 1.4rem);
        white-space: nowrap;
        overflow: hidden;
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        span.tip {
          display: inline-block;
          vertical-align: middle;
        }
        span.trail {
          display: inline-block;
          vertical-align: middle;
          width: auto;
          color: #757575;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .currentProgressOfAuditForFullTime::before {
        content: '';
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background-image: url('./../assets/icon_info.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 100%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
  .currentNews {
    text-align: center;
    pointer-events: none;
    .newsBannerWrap {
      position: relative;
      height: 1.8rem;
      line-height: 1.9rem;
      .newsTxt {
        background: #ffffff;
        font-size: 0.88rem;
        color: #747474;
      }
    }
  }
  .dcGoMerit {
    padding: 0.8rem 1.2rem;
    width: calc(90vw - 2.4rem);
    .title {
      position: relative;
      font-size: 0.94rem;
      font-weight: bold;
      padding-left: 0.7rem;
    }
    .title::before {
      content: '';
      position: absolute;
      top: 0.1rem;
      bottom: 0.1rem;
      left: 0.2rem;
      width: 2px;
      background: #FF5252;
    }
    .meritWrap {
      position: relative;
      margin-top: 1rem;
      img {
        width: 100%;
        height: 5.4rem;
      }
      img:nth-of-type(n + 2) {
        margin-top: 0.6rem;
      }
    }
  }
}
</style>
