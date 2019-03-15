<template>
  <div class="pageWrap">
    <BaseInfoItem title="填写资料" :titleIcon="require('@/assets/logo.png')" :inputs="input1"/>
    <div class="tip tipFirst">我们会在三个工作日给您回电，请注意接听电话</div>
    <div class="tip">您也可以拨打电话：<a :href="`tel:${contactPhone}`">{{contactPhone}}</a>（{{contactPeople}}）进行咨询</div>
    <span class="toSubmit" @click="toSubmit">提交</span>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'
import BaseInfoItem from '@/components/BaseInfoItem.vue'

export default {
  name: 'rentCarIntention',
  components: {
    BaseInfoItem
  },
  data() {
    return {
      input1: [
        {
          label: '城市',
          hint: '请输入您的所在城市',
          type: 'text',
          model: ''
        },
        {
          label: '单位名称',
          hint: '请输入您的单位名称（可不填）',
          type: 'text',
          model: ''
        },
        {
          label: '负责人',
          hint: '请输入负责人姓名',
          type: 'text',
          model: ''
        },
        {
          label: '联系方式',
          hint: '请输入您的联系方式',
          type: 'text',
          model: ''
        },
        {
          label: '用车需求',
          hint: '请填写您的用车需求',
          type: 'textarea',
          model: ''
        }
      ],
      contactPhone: '13753111557',
      contactPeople: '曹经理'
    }
  },
  methods: {
    toSubmit: function() {
      if (this.input1[0].model.trim() == '') { this.$comfun.showToast(this, '请先输入您所在的城市'); return false }
      if (SOME_RULES.emoji.test(this.input1[0].model.trim())) { this.$comfun.showToast(this, '城市中不能含有特殊字符'); return false }
      if (this.input1[1].model.trim() != '' && SOME_RULES.emoji.test(this.input1[1].model.trim())) { this.$comfun.showToast(this, '单位名称中不能含有特殊字符'); return false }
      if (this.input1[2].model.trim() == '') { this.$comfun.showToast(this, '请先输入负责人姓名'); return false }
      if (SOME_RULES.emoji.test(this.input1[2].model.trim())) { this.$comfun.showToast(this, '负责人姓名中不能含有特殊字符'); return false }
      if (this.input1[3].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的联系方式'); return false }
      if (!SOME_RULES.phone.test(this.input1[3].model.trim())) { this.$comfun.showToast(this, '请输入正确的联系方式'); return false }
      this.$store.commit('setDriverRecruitData_IntentionInfo', {
        intentionInfo: {
          city: this.input1[0].model.trim(),
          company: this.input1[1].model.trim(),
          principal: this.input1[2].model.trim(),
          contact: this.input1[3].model.trim(),
          useCarCause: this.input1[4].model.trim()
        }
      })
      this.$comfun.showLoading(this, 'saveApplyDriverIntentionForJoinIn', false)
      this.$comfun.http_post(this, this.$api.saveApplyDriverIntention, {
        // 'intention.d_type': this.$store.state.userBaseInfo.dType,
        'intention.city': this.input1[0].model.trim(),
        'intention.company_name': this.input1[1].model.trim(),
        'intention.leader': this.input1[2].model.trim(),
        'intention.phone': this.input1[3].model.trim(),
        'intention.car_demand': this.input1[4].model.trim()
      }).then((request) => {
        this.$comfun.hideLoading('saveApplyDriverIntentionForJoinIn')
        if (request.data.status == 'OK') {
          this.$comfun.showToast(this, '意向资料提交成功')
          this.$router.back()
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pageWrap {
  position: relative;
  .tip {
    font-size: 0.8rem;
    padding: 0 1.2rem;
    line-height: 1.6rem;
    a {
      color: #0a998d;
    }
  }
  .tipFirst {
    margin-top: 1.4rem;
  }
}

.toSubmit {
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
