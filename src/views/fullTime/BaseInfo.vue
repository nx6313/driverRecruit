<template>
  <div class="baseInfo">
    <BaseInfoItem title="健康状况" :titleIcon="require('@/assets/logo.png')" question="您是否得过以下疾病（包括类似的症状，或者接受过类似症状的治疗）？" :answers="answers_1" isMultiple="true" ref="question1"/>
    <BaseInfoItem title="消息来源" :titleIcon="require('@/assets/logo.png')" question="您是如何得知加盟信息的？" :answers="answers_2" isMultiple="true" ref="question2"/>
    <BaseInfoItem title="网约车经历" :titleIcon="require('@/assets/logo.png')" question="您是否有过跑网约车平台的经历？" :answers="answers_3" isMultiple="true" ref="question3"/>
    <span class="toNextStep" @click="toSubmit">提交</span>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'
import BaseInfoItem from '@/components/BaseInfoItem.vue'

export default {
  name: 'baseInfo',
  components: {
    BaseInfoItem
  },
  data() {
    return {
      isMustSelect: false,
      answers_1: ['癫痫', '心脏病', '各类传染性疾病', '精神类疾病', '各类贫血、败血症', '高血压等血栓性疾病', '阑尾炎'],
      answers_2: ['人才市场', '微信', '平台', '推荐人姓名及联系方式[league_recommend]'],
      answers_3: ['滴滴', '首汽', '曹操专车', '神州专车']
    }
  },
  created() {
    // this.$store.dispatch('clearDriverRecruitData_BaseInfo')
  },
  methods: {
    toSubmit: function() {
      // 判断用户的身份证照片、驾驶证照片信息是否完整
      if (!(this.$store.state.driverRecruitData.cardInfo && this.$store.state.driverRecruitData.cardInfo.idCardA && this.$store.state.driverRecruitData.cardInfo.idCardB
        && this.$store.state.driverRecruitData.cardInfo.driveCardA && this.$store.state.driverRecruitData.cardInfo.driveCardB)) {
          this.$comfun.showToast(this, '证件照信息不完善，无法提交')
          return false
      }
      let question1 = this.$refs.question1.getResult()
      let question2 = this.$refs.question2.getResult()
      let question3 = this.$refs.question3.getResult()
      if (this.isMustSelect) {
        if (question1 && question2 && question3) {
          this.saveUserBaseInfo(question1, question2, question3)
        } else {
          this.$comfun.showToast(this, '请您先完善信息')
        }
      } else {
        this.saveUserBaseInfo(question1, question2, question3)
      }
      this.submit()
    },
    saveUserBaseInfo: function(question1, question2, question3) {
      this.$store.commit('setDriverRecruitData_BaseInfo', {
        baseInfo: {
          q1: { question: '您是否得过以下疾病（包括类似的症状，或者接受过类似症状的治疗）？', answer: question1 },
          q2: { question: '您是如何得知加盟信息的？', answer: question2 },
          q3: { question: '您是否有过跑网约车平台的经历？', answer: question3 }
        }
      })
    },
    submit: function() {
      let health = this.$store.state.driverRecruitData.baseInfo ? this.$store.state.driverRecruitData.baseInfo.q1.answer : null
      let league = this.$store.state.driverRecruitData.baseInfo ? this.$store.state.driverRecruitData.baseInfo.q2.answer : null
      let experience = this.$store.state.driverRecruitData.baseInfo ? this.$store.state.driverRecruitData.baseInfo.q3.answer : null
      let leagueRecommend = null
      if (league != null && this.$vctool.isArray(league)) {
        league.map(v => {
          if (v.hasOwnProperty('filterKey')) {
            if (v['filterKey'] === 'league_recommend') {
              leagueRecommend = v['filterValue']
            }
          }
        })
      }
      if (leagueRecommend != null) {
        if (SOME_RULES.emoji.test(leagueRecommend.trim())) { this.$comfun.showToast(this, '推荐人姓名及联系方式中不能含有特殊字符'); return false }
        if (leagueRecommend.trim().length > 20) { this.$comfun.showToast(this, '推荐人姓名及联系方式内容过长，不得超过20个字符'); return false }
      }
      if (health != null && !this.$vctool.isArray(health) && health.val != null && SOME_RULES.emoji.test(health.val.trim())) { this.$comfun.showToast(this, '其他健康状况中不能含有特殊字符'); return false }
      if (health != null && !this.$vctool.isArray(health) && health.val != null && health.val.trim().length > 80) { this.$comfun.showToast(this, '其他健康状况内容过长，不得超过80个字符'); return false }
      if (league != null && !this.$vctool.isArray(league) && league.val != null && SOME_RULES.emoji.test(league.val.trim())) { this.$comfun.showToast(this, '其他消息来源中不能含有特殊字符'); return false }
      if (league != null && !this.$vctool.isArray(league) && league.val != null && league.val.trim().length > 80) { this.$comfun.showToast(this, '其他消息来源内容过长，不得超过80个字符'); return false }
      if (experience != null && !this.$vctool.isArray(experience) && experience.val != null && SOME_RULES.emoji.test(experience.val.trim())) { this.$comfun.showToast(this, '其他网约车经历中不能含有特殊字符'); return false }
      if (experience != null && !this.$vctool.isArray(experience) && experience.val != null && experience.val.trim().length > 80) { this.$comfun.showToast(this, '其他网约车经历内容过长，不得超过80个字符'); return false }
      this.$comfun.showLoading(this, 'baseInfoApplyInfo', false)
      this.$comfun.http_post(this, this.$api.applyInfo, {
        'apply.d_type': this.$store.state.userBaseInfo.dType,
        'apply.idcard_positive': this.$store.state.driverRecruitData.cardInfo.idCardA,
        'apply.idcard_reverse': this.$store.state.driverRecruitData.cardInfo.idCardB,
        'apply.driverlicense_positive': this.$store.state.driverRecruitData.cardInfo.driveCardA,
        'apply.driverlicense_reverse': this.$store.state.driverRecruitData.cardInfo.driveCardB,
        'apply.health': health != null && this.$vctool.isArray(health) ? health.map(v => { return v.key }).join(',') : (health != null && !this.$vctool.isArray(health) ? health.key : null),
        'apply.health_other': health != null && !this.$vctool.isArray(health) ? health.val : null,
        'apply.league': league != null && this.$vctool.isArray(league) ? league.map(v => { return v.key }).join(',') : (league != null && !this.$vctool.isArray(league) ? league.key : null),
        'apply.league_recommend': leagueRecommend !== null ? leagueRecommend.trim() : null,
        'apply.league_other': league != null && !this.$vctool.isArray(league) ? league.val : null,
        'apply.experience': experience != null && this.$vctool.isArray(experience) ? experience.map(v => { return v.key }).join(',') : (experience != null && !this.$vctool.isArray(experience) ? experience.key : null),
        'apply.experience_other': experience != null && !this.$vctool.isArray(experience) ? experience.val : null,
        'apply.person_name': this.$store.state.driverRecruitData.baseInfoComplete.personName,
        'apply.person_sex': this.$store.state.driverRecruitData.baseInfoComplete.personSex,
        'apply.idcar_no': this.$store.state.driverRecruitData.baseInfoComplete.idcarNo,
        'apply.address_detail': this.$store.state.driverRecruitData.baseInfoComplete.addressDetail,
        'apply.driverlicense_no': this.$store.state.driverRecruitData.baseInfoComplete.driverlicenseNo,
        'apply.phone': this.$store.state.driverRecruitData.baseInfoComplete.phone
        // 'sms_code': this.$store.state.driverRecruitData.baseInfoComplete.smsCode
      }).then((request) => {
        this.$comfun.hideLoading('baseInfoApplyInfo')
        if (request.data.status == 'OK') {
          this.$store.commit('setDriverRecruitData_AuditState', {
            auditState: {
              state: true,
              auditPass: false,
              personName: this.$store.state.driverRecruitData.auditState.personName,
              phone: this.$store.state.driverRecruitData.auditState.phone,
              idcarNo: this.$store.state.driverRecruitData.auditState.idcarNo,
              personSex: this.$store.state.driverRecruitData.auditState.personSex,
              time: this.$store.state.driverRecruitData.auditState.time
            }
          })
          // 基本信息资料提交成功，跳转到信息展示页面
          this.$router.replace('/fullTime/auditResult')
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.toNextStep {
  position: relative;
  display: block;
  width: calc(100% - 2.4rem);
  background: #33374b;
  color: #ffffff;
  text-align: center;
  left: 1.2rem;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  margin-top: 1.8rem;
  font-size: 0.8rem;
  border-radius: 2px;
  box-shadow: 0px 0px 2px #4e4e4ea6;
  margin-bottom: 2.2rem;
}
</style>
