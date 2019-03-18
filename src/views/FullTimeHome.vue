<template>
  <div class="fullTimeHome" :style="{ transform: `translateY(-${coverTranslateY}rem)` }">
    <div class="recruitCover" v-lazy:background-image="require('@/assets/full_time_home.jpg')" v-touch:moveUpDown="toNextPage"></div>
    <div class="arrowTipWrap" v-if="coverTranslateY == 0">
      <p class="arrowIcon"></p>
    </div>
    <div class="btnWrap">
      <span class="btn" @click="toDetailPage">了解详情</span>
    </div>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'

export default {
  name: 'fullTimeHome',
  inject: ['reload'],
  data() {
    return {
      coverTranslateY: 0,
      userDriverRecruitState: -10,
      driverRecruitState: {
        USER_IS_DRIVER: 0, // 该用户已经是司机了
        NORMAL: -1, // 该用户还未提交任何资料
        AUDITING: 20, // 该用户提交的资料正在审核中
        AUDIT_PASS: 21, // 该用户提交的资料审核已通过，通知其来公司面试
        AUDIT_NO_PASS: 22, // 该用户提交的资料审核未通过
        INTERVIEW_PASS: 31, // 该用户已通过公司面试，需要阅读具体规则
        INTERVIEW_NO_PASS: 32, // 该用户未通过公司面试
        RULEING: 40, // 该用户提交的规则资料正在审核中
        RULE_PASS: 41, // 该用户提交的规则资料已通过审核
        RULE_NO_PASS_NO_UPDATE: 42, // 该用户提交的规则资料未通过审核，不可修改
        RULE_NO_PASS_CAN_UPDATE: 43, // 该用户提交的规则资料未通过审核，可修改后重新提交
        RULE_HAS_RUZHI: 51, // 该用户已入职
        RULE_NO_RUZHI: 52 // 该用户通过所有审核，单还未入职
      }
    }
  },
  beforeCreate() {
    this.coverTranslateY = 0
  },
  created() {
    this.$store.commit('setDriverRecruitStateRule', {
      stateRule: this.driverRecruitState
    })
    this.getUserDriverRecruit()
  },
  computed: {
    getLinkTo: function() {
      let link = '/'
      if (this.userDriverRecruitState == this.driverRecruitState.USER_IS_DRIVER) {
        // 该用户已经是司机了
        link = '/fullTime/complete'
      } else if (this.userDriverRecruitState == this.driverRecruitState.NORMAL) {
        // 该用户还未提交任何资料
        link = '/fullTime/baseInfoComplete'
      } else if (this.userDriverRecruitState == this.driverRecruitState.AUDITING) {
        // 该用户提交的资料正在审核中
        link = '/fullTime/auditResult'
      } else if (this.userDriverRecruitState == this.driverRecruitState.AUDIT_PASS) {
        // 该用户提交的资料审核已通过，通知其来公司面试
        link = '/fullTime/auditResult'
      } else if (this.userDriverRecruitState == this.driverRecruitState.AUDIT_NO_PASS) {
        // 该用户提交的资料审核未通过
        link = '/fullTime/auditResult'
      } else if (this.userDriverRecruitState == this.driverRecruitState.INTERVIEW_PASS) {
        // 该用户已通过公司面试，需要阅读具体规则
        link = '/fullTime/policyRuleList'
      } else if (this.userDriverRecruitState == this.driverRecruitState.INTERVIEW_NO_PASS) {
        // 该用户未通过公司面试
        link = '/fullTime/complete'
      } else if (this.userDriverRecruitState == this.driverRecruitState.RULEING) {
        // 该用户提交的规则资料正在审核中
        link = '/fullTime/complete'
      } else if (this.userDriverRecruitState == this.driverRecruitState.RULE_PASS) {
        // 该用户提交的规则资料已通过审核
        link = '/fullTime/complete'
      } else if (this.userDriverRecruitState == this.driverRecruitState.RULE_NO_PASS_NO_UPDATE) {
        // 该用户提交的规则资料未通过审核，不可修改
        link = '/fullTime/complete'
      } else if (this.userDriverRecruitState == this.driverRecruitState.RULE_NO_PASS_CAN_UPDATE) {
        // 该用户提交的规则资料未通过审核，可修改后重新提交
        link = '/fullTime/complete'
      } else if (this.userDriverRecruitState == this.driverRecruitState.RULE_HAS_RUZHI) {
        // 该用户已入职
        link = '/fullTime/complete'
      } else if (this.userDriverRecruitState == this.driverRecruitState.RULE_NO_RUZHI) {
        // 该用户通过所有审核，单还未入职
        link = '/fullTime/complete'
      }
      return link
    }
  },
  methods: {
    getUserDriverRecruit: function() {
      this.$comfun.showLoading(this, 'applyDriver', false)
      this.$comfun.http_post(this, this.$api.applyDriver, {
        phone: this.$store.state.userBaseInfo.phone,
        d_type: this.$store.state.userBaseInfo.dType
      }).then((request) => {
        this.$comfun.hideLoading('applyDriver')
        // eslint-disable-next-line
        console.log('专职司机', request.data)
        if (request.data.status == 'OK') {
          this.userDriverRecruitState = request.data.data.state
          this.$store.commit('updateDriverRecruitState', {
            state: request.data.data.state
          })
          let aduitingState = this.userDriverRecruitState == this.driverRecruitState.AUDITING
          let auditPassState = this.userDriverRecruitState != this.driverRecruitState.AUDIT_NO_PASS
          this.$store.commit('setDriverRecruitData_AuditState', {
            auditState: {
              state: aduitingState,
              auditPass: auditPassState,
              personName: request.data.data.personName,
              phone: request.data.data.phone,
              idcarNo: request.data.data.idcarNo,
              personSex: request.data.data.personSex,
              // eslint-disable-next-line
              time: request.data.data.time ? request.data.data.time.replace(/\-/g, "/") : null
            }
          })
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    toNextPage: function(distance) {
      if (distance < 0) {
        this.coverTranslateY = 6
      } else {
        this.coverTranslateY = 0
      }
    },
    toDetailPage: function() {
      if (this.getLinkTo == '/') {
        this.reload()
      } else {
        this.$router.replace(this.getLinkTo)
        this.coverTranslateY = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fullTimeHome {
  font-size: 0;
  transition: all 0.4s;
  height: 100vh;
}

.recruitCover {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%;
  background-color: #E6E2E4;
}

.arrowTipWrap {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 0.8rem;
  width: 5rem;
  height: 5rem;
  pointer-events: none;
  .arrowIcon {
    display: inline-block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 4rem;
    height: 4rem;
    margin: auto;
    pointer-events: none;
    background-image: url('./../assets/up_to_open.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    animation: st 1.5s infinite ease-in-out;
  }
}

.btnWrap {
  position: relative;
  height: 6rem;
  color: #ffffff;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  .btn {
    position: relative;
    margin-top: 1.8rem;
    height: 2rem;
    line-height: 2rem;
    font-size: 0.9rem;
    display: inline-block;
    padding: 0 1rem;
    border-radius: 4px;
    background: #E3B142;
    color: #242424;
    border: 1px solid #242424;
    letter-spacing: 1px;
    opacity: 0.9;
    text-shadow: rgba(0, 0, 0, 0.3) 0px 1px 2px;
    box-shadow: rgba(255, 255, 255, 0.25) 0px 1px 0px, inset rgba(255, 255, 255, 0.25) 0px 1px 0px, inset rgba(0, 0, 0, 0.25) 0px 0px 0px, inset rgba(255, 255, 255, 0.03) 0px 20px 0px, inset rgba(0, 0, 0, 0.15) 0px -20px 20px, inset rgba(255, 255, 255, 0.05) 0px 20px 20px;
    transition: all 0.1s linear;
  }
  .btn:nth-of-type(n + 2) {
    margin-left: 2rem;
  }
}

@keyframes st {
  0%, 30% {
    opacity: 0;
    transform: translate(0,10px);
  }
  60% {
    opacity: 1;
    transform: translate(0,0);
  }
  100% {
    opacity: 0;
    transform: translate(0,-8px);
  }
}
</style>
