<template>
  <div class="baseInfoComplete">
    <BaseInfoItem title="完善信息" :titleIcon="require('@/assets/logo.png')" :inputs="input1"/>
    <span class="toSubmit" @click="toSubmit">提交</span>
  </div>
</template>

<script>
import BaseInfoItem from '@/components/BaseInfoItem.vue'

export default {
  name: 'baseInfoComplete',
  components: {
    BaseInfoItem
  },
  data() {
    return {
      input1: [
        {
          label: '姓名',
          hint: '请输入您的姓名',
          type: 'text',
          model: ''
        },
        {
          label: '性别',
          type: 'select',
          range: [ { name: '男', value: '男' }, { name: '女', value: '女' } ],
          model: '男'
        },
        {
          label: '身份证号',
          hint: '请输入您的身份证号',
          type: 'text',
          model: ''
        },
        {
          label: '现居住地',
          hint: '请输入您的现居住地',
          type: 'text',
          model: ''
        },
        {
          label: '驾驶证',
          type: 'select',
          range: [ { name: 'C1', value: 'C1' }, { name: 'C2', value: 'C2' } ],
          model: 'C1'
        },
        {
          label: '手机号',
          hint: '请输入您的手机号',
          type: 'sendSmsCode',
          send: (phone) => {
            return this.$comfun.http_post(this, 'api/member/applySms', {
              phone: phone
            })
          },
          callBack: (request) => {
            if (request.data.status == 'OK') {
              this.$comfun.showToast(this, '验证码短信已发送，请注意查收')
            } else {
              this.$comfun.showToast(this, request.data.msg)
            }
          },
          model: ''
        },
        {
          label: '验证码',
          hint: '请输入您的现居住地',
          type: 'smsCodeText',
          codeCount: 6,
          model: ''
        }
      ]
    }
  },
  methods: {
    toSubmit: function() {
      // 判断用户的身份证照片、驾驶证照片信息是否完整
      if (!(this.$store.state.driverRecruitData.cardInfo && this.$store.state.driverRecruitData.cardInfo.idCardA && this.$store.state.driverRecruitData.cardInfo.idCardB
        && this.$store.state.driverRecruitData.cardInfo.driveCardA && this.$store.state.driverRecruitData.cardInfo.driveCardB)) {
          this.$comfun.showToast(this, '证件照信息不完善，无法提交')
          return false
      }
      // 判断用户填写的完善信息是否完整
      if (this.input1[0].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的姓名'); return false }
      if (this.input1[2].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的身份证号'); return false }
      if (this.input1[3].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的现居住地'); return false }
      if (this.input1[5].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的手机号'); return false }
      if (this.input1[6].model.trim() == '') { this.$comfun.showToast(this, '请先输入您收到的短信验证码'); return false }
      this.$comfun.showLoading(this, 'baseInfoApplyInfo', false)
      this.submit()
    },
    submit: function() {
      let health = this.$store.state.driverRecruitData.baseInfo ? this.$store.state.driverRecruitData.baseInfo.q1.answer : null
      let league = this.$store.state.driverRecruitData.baseInfo ? this.$store.state.driverRecruitData.baseInfo.q2.answer : null
      let experience = this.$store.state.driverRecruitData.baseInfo ? this.$store.state.driverRecruitData.baseInfo.q3.answer : null
      this.$comfun.http_post(this, 'api/member/applyInfo', {
        'apply.idcard_positive': this.$store.state.driverRecruitData.cardInfo.idCardA,
        'apply.idcard_reverse': this.$store.state.driverRecruitData.cardInfo.idCardB,
        'apply.driverlicense_positive': this.$store.state.driverRecruitData.cardInfo.driveCardA,
        'apply.driverlicense_reverse': this.$store.state.driverRecruitData.cardInfo.driveCardB,
        'apply.health': health != null && this.$vctool.isArray(health) ? health.map(v => { return v.answer }).join(',') : null,
        'apply.health_other': health != null && !this.$vctool.isArray(health) ? health : null,
        'apply.league': league != null && this.$vctool.isArray(league) ? league.map(v => { return v.answer }).join(',') : null,
        'apply.league_other': league != null && !this.$vctool.isArray(league) ? league : null,
        'apply.experience': experience != null && this.$vctool.isArray(experience) ? experience.map(v => { return v.answer }).join(',') : null,
        'apply.experience_other': experience != null && !this.$vctool.isArray(experience) ? experience : null,
        'apply.person_name': this.input1[0].model.trim(),
        'apply.person_sex': this.input1[1].model,
        'apply.idcar_no': this.input1[2].model.trim(),
        'apply.address_detail': this.input1[3].model.trim(),
        'apply.driverlicense_no': this.input1[4].model,
        'apply.phone': this.input1[5].model.trim(),
        'sms_code': this.input1[6].model.trim()
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
          this.$router.replace('/auditResult')
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.toSubmit {
  position: relative;
  display: block;
  width: calc(100% - 2.4rem);
  background: #2b2b2b;
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
