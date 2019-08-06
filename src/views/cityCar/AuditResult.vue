<template>
  <div class="auditResultWrap">
    <template v-if="auditResult == 1">
      <img v-lazy="require('@/assets/icon_audit_ok.png')">
      <span class="title">您的信息已提交</span>
      <span class="tip">请耐心等待工作人员联系您</span>
    </template>
    <template v-if="auditResult == 2">
      <img v-lazy="require('@/assets/icon_audit_ok.png')">
      <span class="title">您已经是城际专线司机了</span>
    </template>
    <template v-if="auditResult == 3">
      <img v-lazy="require('@/assets/icon_audit_err.png')">
      <span class="title">审核失败</span>
      <span class="tip">您暂时不符合我们的要求，谢谢您对我们的关注与支持</span>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      auditResult: 3 // 1：信息提交、2：已经是城际专车司机、3：审核失败
    }
  }
}
</script>

<style lang="less" scoped>
.auditResultWrap {
  position: relative;
  text-align: center;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8rem 0;
  img {
    position: relative;
    width: 5rem;
    height: 5rem;
  }
  .title {
    position: relative;
    margin-top: 1.8rem;
    font-size: 1rem;
    color: rgb(43, 43, 43);
    font-weight: bold;
  }
  .tip {
    position: relative;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    color: rgb(168, 168, 168);
    max-width: 70%;
  }
}
</style>
