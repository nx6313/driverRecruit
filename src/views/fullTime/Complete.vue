<template>
    <div class="complete">
        <img v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULEING" v-lazy="require('@/assets/icon_audit.png')">
        <img v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_PASS || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.USER_IS_DRIVER || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_HAS_RUZHI || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_RUZHI" v-lazy="require('@/assets/icon_audit_pass.png')">
        <img v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_NO_UPDATE || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_CAN_UPDATE || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.INTERVIEW_NO_PASS" v-lazy="require('@/assets/icon_audit_reject.png')">
        <span v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULEING" class="tip">
            <span class="tipTitle">审核中 · · ·</span>
            <span>我们会在一个工作日进行初审，请耐心等待</span>
        </span>
        <span v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_PASS || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.USER_IS_DRIVER || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_HAS_RUZHI" class="tip">您已成为大昌网约车自营司机，快去赚钱吧！</span>
        <span v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_PASS || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.USER_IS_DRIVER || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_RUZHI" class="tip">您已成为大昌网约车自营司机，正在等待入职，请您耐心等待<br>或联系 <a :href="`tel:${contactPhone}`">{{contactPhone}}</a>（{{contactPeople}}） 咨询详情</span>
        <span v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_NO_UPDATE || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_CAN_UPDATE" class="tip">您的信息审核未通过</span>
        <span v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.INTERVIEW_NO_PASS" class="tip">抱歉，您未通过公司面试</span>
        <router-link v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_CAN_UPDATE" to="/fullTime/policyRuleList" class="againCommit" tag="span" replace>返回重新修改相关信息</router-link>
    </div>
</template>

<script>
export default {
    name: 'complete',
    data() {
        return {
            contactPhone: '13753111557',
            contactPeople: '曹经理'
        }
    }
}
</script>

<style lang="less" scoped>
.complete {
    text-align: center;
    padding-top: 10rem;
    img {
        width: 7rem;
    }
    .tip {
        margin-top: 2rem;
        display: block;
        text-align: center;
        font-size: 0.9rem;
        color: #2e2e2e;
        .tipTitle {
            display: block;
            font-size: 0.96rem;
            font-weight: bold;
            margin-bottom: 0.8rem;
        }
    }

    .againCommit {
        position: relative;
        display: block;
        width: 92vw;
        background: #33374b;
        color: #ffffff;
        text-align: center;
        left: 4vw;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        margin-top: 4.8rem;
        font-size: 0.8rem;
        border-radius: 2px;
        box-shadow: 0px 0px 2px #4e4e4ea6;
    }
}
</style>
