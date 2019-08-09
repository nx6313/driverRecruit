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
      <span class="againCommit" @click="backAgainCommit">返回重新修改相关信息</span>
      <div class="reasonTip" v-if="reason">
        <span class="reasonTitle">失败原因：</span>
        <span v-html="reason"></span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      auditResult: 1, // 1：信息提交、2：已经是城际专车司机、3：审核失败
      reason: null
    }
  },
  created () {
    if (this.$route.query.status) {
      switch (Number(this.$route.query.status)) {
        case 1:
          this.auditResult = 2
          break;
        case 2:
          this.auditResult = 3
          break;
        case 3:
          this.auditResult = 1
          break;
      }
      this.reason = this.$route.query.reason
    } else {
      this.auditResult = 1
      this.$comfun.showLoading(this, 'getIntercityStatus', false)
      this.$comfun.http_post(this, this.$api.getIntercityStatus, {
        phone: this.$store.state.userBaseInfo.phone
      }).then(statusData => {
        this.$comfun.hideLoading('getIntercityStatus')
        console.log('城际专车', statusData.data)
        switch (Number(statusData.data.data.num)) {
          case 1:
            this.auditResult = 2
            break;
          case 2:
            this.auditResult = 3
            break;
          case 3:
            this.auditResult = 1
            break;
        }
        this.reason = statusData.data.data.message
      })
    }
  },
  methods: {
    backAgainCommit () {
      this.$router.replace({
        path: '/cityCarHome',
        query: {
          outAgain: true
        }
      })
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
  .reasonTip {
    position: relative;
    font-size: 0.8rem;
    margin-top: 1.4rem;
    text-align: left;
    color: rgb(145, 145, 145);
    width: calc(100% - 22vw);
    span {
      position: relative;
      display: block;
      line-height: 1.2rem;
      padding-left: 2em;
    }
    .reasonTitle {
      padding-left: 0;
      margin-bottom: 0.4rem;
      color: rgb(110, 110, 110);
    }
  }
  .againCommit {
    position: relative;
    display: block;
    width: calc(100% - 18vw);
    background: #33374b;
    color: #ffffff;
    text-align: center;
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
    margin-top: 1rem;
    font-size: 0.8rem;
    border-radius: 2px;
    box-shadow: 0px 0px 2px #4e4e4ea6;
  }
}
</style>
