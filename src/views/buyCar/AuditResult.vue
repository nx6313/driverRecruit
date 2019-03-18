<template>
  <div class="auditResult">
    <div v-if="isAuditing" class="userIsAuditing">
      <img v-lazy="require('@/assets/icon_audit.png')">
      <span>我们会在一个工作日内进行审核，请耐心等待</span>
      <span>审核结果将以短信形式发送至您的手机，请注意查看</span>
    </div>
    <div v-if="!isAuditing" class="userHasAudit">
      <span class="content" v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.AUDIT_PASS">您的加盟申请已通过，正在等待入职，请您耐心等待，或联系 <a :href="`tel:${contactPhone}`">{{contactPhone}}</a>（{{contactPeople}}） 咨询详情</span>
      <span class="content" v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.AUDIT_NO_PASS">您的加盟申请已被驳回</span>
      <span class="content" v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.INTERVIEW_PASS">您的加盟申请未通过，请修改相关信息</span>
      <span class="content" v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_HAS_RUZHI">恭喜您已成为大昌网约车加盟司机，快去赚钱吧</span>
      <span class="content" v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_RUZHI">您没有选择入职大昌网约车加盟司机，或联系 <a :href="`tel:${contactPhone}`">{{contactPhone}}</a>（{{contactPeople}}） 咨询详情</span>
      <img class="seal" v-if="isAuditPass" v-lazy="require('@/assets/icon_audit_pass.png')">
      <img class="seal" v-if="!isAuditPass" v-lazy="require('@/assets/icon_audit_reject.png')">
      <router-link v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.INTERVIEW_PASS" to="/buyCar/baseInfo1" class="againCommit" tag="span" replace>返回重新修改相关信息</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'buyCarAuditResult',
  data() {
    return {
      isAuditing: this.$store.state.driverRecruitData.auditState.state,
      isAuditPass: this.$store.state.driverRecruitData.auditState.auditPass,
      contactPhone: '13753111557',
      contactPeople: '曹经理'
    }
  },
  mounted() {
    this.$comfun.showLoading(this, 'applyDriver', false)
    this.$comfun.http_post(this, this.$api.applyDriver, {
      phone: this.$store.state.userBaseInfo.phone,
      d_type: this.$store.state.userBaseInfo.dType
    }).then((request) => {
      this.$comfun.hideLoading('applyDriver')
      if (request.data.status == 'OK') {
        this.$store.commit('updateDriverRecruitState', {
          state: request.data.data.state
        })
        this.isAuditing = request.data.data.state == this.$store.state.driverRecruit.stateRule.AUDITING
        this.isAuditPass = request.data.data.state == this.$store.state.driverRecruit.stateRule.AUDIT_PASS || request.data.data.state == this.$store.state.driverRecruit.stateRule.RULE_HAS_RUZHI || request.data.data.state == this.$store.state.driverRecruit.stateRule.RULE_NO_RUZHI
        this.$store.commit('setDriverRecruitData_AuditState', {
          auditState: {
            state: this.isAuditing,
            auditPass: this.isAuditPass
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
    height: 7rem;
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
  position: relative;
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

  .againCommit {
    position: relative;
    display: block;
    width: calc(100% - 8vw);
    left: 4vw;
    background: #33374b;
    color: #ffffff;
    text-align: center;
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
    margin-top: 8rem;
    font-size: 0.8rem;
    border-radius: 2px;
    box-shadow: 0px 0px 2px #4e4e4ea6;
  }
}
</style>
