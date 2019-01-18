<template>
    <div class="complete">
        <img v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULEING" :src="require('@/assets/icon_audit.png')">
        <img v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_PASS" :src="require('@/assets/icon_audit_pass.png')">
        <img v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_NO_UPDATE || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_CAN_UPDATE" :src="require('@/assets/icon_audit_reject.png')">
        <span v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULEING" class="tip">
            <span class="tipTitle">审核中 · · ·</span>
            <span>我们会在一个工作日进行初审，请耐心等待</span>
        </span>
        <span v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_PASS" class="tip">您已成为大昌网约车司机，快去赚钱吧！</span>
        <span v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_NO_UPDATE || $store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_CAN_UPDATE" class="tip">您的信息审核未通过</span>
        <router-link v-if="$store.state.driverRecruit.state == $store.state.driverRecruit.stateRule.RULE_NO_PASS_CAN_UPDATE" to="/policyRuleList" class="againCommit" tag="span">返回重新修改相关信息</router-link>
    </div>
</template>

<script>
export default {
    name: 'complete'
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
        background: #2b2b2b;
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
