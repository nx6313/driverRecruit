<template>
  <div class="pageWrap">
    <BaseInfoItem title="填写资料" :titleIcon="require('@/assets/logo.png')" :inputs="input1"/>
    <div class="tip tipFirst">我们会在三个工作日给您回电，请注意接听电话</div>
    <div class="tip">您也可以拨打电话：<a :href="`tel:${contactPhone}`">{{contactPhone}}</a>（{{contactPeople}}）进行咨询</div>
    <span class="toSubmit" @click="toSubmit">提交</span>
  </div>
</template>

<script>
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
          hint: '请输入您的单位名称',
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
    toSubmit: function() {}
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
