<template>
  <div class="baseInfo">
    <BaseInfoItem title="健康状况" :titleIcon="require('@/assets/logo.png')" question="您是否得过以下疾病（包括类似的症状，或者接受过类似症状的治疗）？" :answers="answers_1" isMultiple="true" ref="question1"/>
    <BaseInfoItem title="消息来源" :titleIcon="require('@/assets/logo.png')" question="您是如何得知加盟信息的？" :answers="answers_2" isMultiple="true" ref="question2"/>
    <BaseInfoItem title="网约车经历" :titleIcon="require('@/assets/logo.png')" question="您是否有过跑网约车平台的经历？" :answers="answers_3" isMultiple="true" ref="question3"/>
    <span class="toNextStep" @click="toNext">下一步</span>
  </div>
</template>

<script>
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
      answers_2: ['人才市场', '微信', '平台', '推荐'],
      answers_3: ['滴滴', '首汽', '曹操专车', '神州专车']
    }
  },
  created() {
    // this.$store.dispatch('clearDriverRecruitData_BaseInfo')
  },
  methods: {
    toNext: function() {
      let question1 = this.$refs.question1.getResult()
      let question2 = this.$refs.question2.getResult()
      let question3 = this.$refs.question3.getResult()
      if (this.isMustSelect) {
        if (question1 && question2 && question3) {
          this.saveUserBaseInfo(question1, question2, question3)
          this.$router.push('/baseInfoComplete')
        } else {
          this.$comfun.showToast(this, '请您先认真填写基本信息')
        }
      } else {
        this.saveUserBaseInfo(question1, question2, question3)
        this.$router.push('/baseInfoComplete')
      }
    },
    saveUserBaseInfo: function(question1, question2, question3) {
      this.$store.commit('setDriverRecruitData_BaseInfo', {
        baseInfo: {
          q1: { question: '您是否得过以下疾病（包括类似的症状，或者接受过类似症状的治疗）？', answer: question1 },
          q2: { question: '您是如何得知加盟信息的？', answer: question2 },
          q3: { question: '您是否有过跑网约车平台的经历？', answer: question3 }
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
