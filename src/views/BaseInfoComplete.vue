<template>
  <div class="baseInfoComplete">
    <BaseInfoItem title="完善信息" :titleIcon="require('@/assets/logo.png')" :inputs="input1" ref="input1"/>
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
          range: [ { name: '1', value: '男' }, { name: '2', value: '女' } ],
          model: '1'
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
          hint: '请输入您的驾驶证',
          type: 'text',
          model: ''
        }
      ]
    }
  },
  methods: {
    toSubmit: function() {
      let input1 = this.$refs.input1
    }
  }
}
</script>

<style lang="less" scoped>
.toSubmit {
  position: relative;
  display: block;
  width: 92vw;
  background: #2b2b2b;
  color: #ffffff;
  text-align: center;
  left: 4vw;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  margin-top: 1.8rem;
  font-size: 0.8rem;
  border-radius: 2px;
  box-shadow: 0px 0px 2px #4e4e4ea6;
  margin-bottom: 2.2rem;
}
</style>
