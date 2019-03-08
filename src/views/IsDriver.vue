<template>
    <div class="isDriver">
        <img v-lazy="require('@/assets/icon_audit_pass.png')">
        <span class="tip">您已成为大昌网约车司机，快去赚钱吧！</span>
    </div>
</template>

<script>
export default {
    name: 'isDriver'
}
</script>

<style lang="less" scoped>
.isDriver {
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
}
</style>
