<template>
  <div class="baseInfoComplete">
    <BaseInfoItem title="基础信息" :titleIcon="require('@/assets/logo.png')" :inputs="input1"/>
    <span class="toNextStep" @click="toNext">下一步</span>
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
    toNext: function() {
      // 判断用户填写的完善信息是否完整
      if (this.input1[0].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的姓名'); return false }
      if (this.input1[2].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的身份证号'); return false }
      if (this.input1[3].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的现居住地'); return false }
      if (this.input1[5].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的手机号'); return false }
      if (this.input1[6].model.trim() == '') { this.$comfun.showToast(this, '请先输入您收到的短信验证码'); return false }
      this.saveUserBaseInfo()
      this.$router.push('/cardInfo')
    },
    saveUserBaseInfo: function() {
      this.$store.commit('setDriverRecruitData_BaseInfoComplete', {
        baseInfoComplete: {
          personName: this.input1[0].model.trim(),
          personSex: this.input1[1].model.trim(),
          idcarNo: this.input1[2].model.trim(),
          addressDetail: this.input1[3].model.trim(),
          driverlicenseNo: this.input1[4].model.trim(),
          phone: this.input1[5].model.trim(),
          smsCode: this.input1[6].model.trim()
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
