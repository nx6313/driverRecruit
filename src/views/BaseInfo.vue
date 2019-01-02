<template>
  <div class="baseInfo">
    <BaseInfoItem title="健康状况" question="是否得过以下疾病（包括类似的症状，或者接受过类似症状的治疗）？" :answers="answers_1"/>
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
      answers_1: ['癫痫', '心脏病', '各类传染性疾病', '精神类疾病', '各类贫血、败血症', '高血压等血栓性疾病', '阑尾炎']
    }
  }
}
</script>

<style lang="less" scoped>

</style>
