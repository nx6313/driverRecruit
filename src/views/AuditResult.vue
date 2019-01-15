<template>
  <div class="auditResult">
    <div v-if="isAuditing" class="userIsAuditing">
      <img :src="require('@/assets/icon_audit.png')">
      <span>我们会在一个工作日内进行初审，请耐心等待</span>
      <span>初审结果将以短信形式发送至您的手机，请注意查看</span>
    </div>
    <div v-if="!isAuditing" class="userHasAudit">
      <span class="title">您好，{{$store.state.driverRecruitData.auditState.personName}} {{$store.state.driverRecruitData.auditState.personSex ? ($store.state.driverRecruitData.auditState.personSex.indexOf('男') >= 0 ? '先生' : ($store.state.driverRecruitData.auditState.personSex.indexOf('女') >= 0 ? '女士' : '先生/女士')) : '先生/女士'}}</span>
      <span class="content">请您在 {{$store.state.driverRecruitData.auditState.time ? ($comfun.formatDate(new Date($store.state.driverRecruitData.auditState.time), 'yyyy') == $comfun.formatDate(new Date(), 'yyyy') ? $comfun.formatDate(new Date($store.state.driverRecruitData.auditState.time), '今年 M 月 d 日 h 点 m 分') : $comfun.formatDate(new Date($store.state.driverRecruitData.auditState.time), 'yy 年 M 月 d 日 h 点 m 分')) : '_ _'}} 之前到公司参加面试，详细内容我们已发送到您的 <u>{{$store.state.driverRecruitData.auditState.phone}}</u> 短信中，请注意查收。</span>
      <img class="seal" v-if="isAuditPass" :src="require('@/assets/icon_audit_pass.png')">
      <img class="seal" v-if="!isAuditPass" :src="require('@/assets/icon_audit_reject.png')">
    </div>
  </div>
</template>

<script>
export default {
  name: 'auditResult',
  data() {
    return {
      isAuditing: this.$store.state.driverRecruitData.auditState.state,
      isAuditPass: this.$store.state.driverRecruitData.auditState.auditPass
    }
  },
  mounted() {
    this.$comfun.showLoading(this, 'applyDriver', false)
    this.$comfun.http_post(this, 'api/member/applyDriver').then((request) => {
      this.$comfun.hideLoading('applyDriver')
      if (request.data.status == 'OK') {
        this.$store.commit('updateDriverRecruitState', {
          state: request.data.data.state
        })
        this.isAuditing = request.data.data.state == this.$store.state.driverRecruit.stateRule.AUDITING
        this.isAuditPass = request.data.data.state != this.$store.state.driverRecruit.stateRule.AUDIT_NO_PASS
        this.$store.commit('setDriverRecruitData_AuditState', {
          auditState: {
            state: this.isAuditing,
            auditPass: this.isAuditPass,
            personName: request.data.data.personName,
            phone: request.data.data.phone,
            idcarNo: request.data.data.idcarNo,
            personSex: request.data.data.personSex,
            // eslint-disable-next-line
            time: request.data.data.time ? request.data.data.time.replace(/\-/g, "/") : null
          }
        })
      } else {
        this.$comfun.showToast(this, request.data.msg)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.userIsAuditing {
  text-align: center;
  padding-top: 8rem;
  img {
    width: 8rem;
    margin-bottom: 1.4rem;
  }
  span {
    display: block;
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.8rem;
  }
}
.userHasAudit {
  font-size: 0.8rem;
  padding: 1.2rem 1rem;
  span {
    display: block;
  }
  .title {
    font-size: 0.92rem;
  }
  .content {
    line-height: 1.6rem;
    margin-top: 1.4rem;
    text-indent: 2em;
  }
  .seal {
    width: 8rem;
    margin-top: -2.6rem;
    float: right;
  }
}
</style>
