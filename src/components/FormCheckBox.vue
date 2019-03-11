<template>
    <div class="checkWrap checkBtnItem" :value="check.name" @click="selectThis(check)">
        <span :class="['checkSelect', value ? 'isSelected' : '']"></span>
        <span class="checkTxt">{{check.title}}<span class="checkTxtMin">{{check.minTitle}}</span></span>
    </div>
</template>

<script>
export default {
    name: 'formRadio',
    props: {
        check: {
            default() {
                return []
            }
        },
        value: {
            default: ''
        }
    },
    methods: {
        selectThis: function(check) {
            this.$emit('input', !this.value)
        }
    }
}
</script>

<style lang="less" scoped>
.checkBtnItem {
    position: relative;
    top: 0;
    bottom: 0;
    height: 2rem;
    line-height: 2rem;
    margin: auto;
    display: inline-block;
    font-size: 0.8rem;
    font-weight: bold;
    .checkSelect {
        display: inline-block;
        position: relative;
        width: 0.8rem;
        height: 0.8rem;
        border: 1px solid #2C3E50;
        border-radius: 3px;
        vertical-align: middle;
    }
    .checkTxt {
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.4rem;
        .checkTxtMin {
            font-size: 0.7rem;
            color: rgb(141, 141, 141);
            font-weight: normal;
        }
    }
    .isSelected::before {
        content: '';
        display: inline-block;
        position: absolute;
        width: 0.5rem;
        height: 0.6rem;
        color: rgb(46, 46, 46);
        border-bottom: 4px solid;
        border-right: 3px solid;
        left: 0.3rem;
        top: 0;
        transform-origin: center;
        transform: translate(-20%, -30%) rotate(30deg);
        -webkit-transform: translate(-20%, -30%) rotate(30deg);
    }
}
.checkBtnItem:nth-of-type(n + 2) {
    margin-left: 1.4rem;
}
</style>
