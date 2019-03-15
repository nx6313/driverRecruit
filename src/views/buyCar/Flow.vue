<template>
  <div class="pageWrap">
    <div class="flowWrap">
      <p>① 司机提交姓名、身份证号、电话信息</p>
      <p>② 平台协助司机审核是否具备办理资质</p>
      <p>③ 我们会通知您去驾校培训、考试（费用由司机承担，770元含照片，培训周期4天）</p>
    </div>
    <FormCheckBox class="isNeedHelp" v-model="needHelp" :check="{ name: true, title: '需要帮我办理', minTitle: '（大昌出行将免费协助您办理）' }"/>
    <span class="iKnow" @click="iKnow">我知道了</span>
  </div>
</template>

<script>
import FormCheckBox from '@/components/FormCheckBox.vue'

export default {
  name: 'buyCarFlow',
  components: {
    FormCheckBox
  },
  data() {
    return {
      needHelp: false
    }
  },
  mounted() {
    if (this.$store.state.driverRecruitData.baseInfoComplete.needHelpGetcertification == 1) {
      this.needHelp = true
    }
  },
  methods: {
    iKnow: function() {
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'needHelpGetcertification',
        value: this.needHelp ? '1' : '0'
      })
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.pageWrap {
  position: relative;
  .flowWrap {
    margin-top: 4rem;
    margin-bottom: 6rem;
    font-size: 0.9rem;
    margin-left: 2rem;
    margin-right: 2rem;
    p {
      padding: 0;
      margin: 0;
      line-height: 1.6rem;
    }
    p:nth-of-type(n + 2) {
      margin-top: 2rem;
    }
  }
}

.isNeedHelp {
  margin-left: 1.2rem;
}

.iKnow {
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
