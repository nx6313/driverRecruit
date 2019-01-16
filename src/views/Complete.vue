<template>
    <div class="complete">
        <img :src="require('@/assets/icon_audit_pass.png')">
        <span class="tip">您已成为大昌网约车司机，快去赚钱吧！</span>
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
        width: 10rem;
    }
    .tip {
        margin-top: 2rem;
        display: block;
        text-align: center;
        font-size: 0.9rem;
        color: #2e2e2e;
    }
}
</style>
