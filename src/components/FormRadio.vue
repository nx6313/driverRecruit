<template>
    <div class="radioWrap">
        <div v-for="(radio, radioIndex) in radios" v-bind:key="radioIndex" class="radioBtnItem" :value="radio.name" @click="selectThis(radio)">
            <span class="radioSelect"></span>
            <span class="radioTxt">{{radio.value}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'formRadio',
    props: {
        radios: {
            default() {
                return []
            }
        },
        value: {
            default: ''
        }
    },
    methods: {
        selectThis: function(radio) {
            this.$emit('input', radio.value)
        }
    }
}
</script>

<style lang="less" scoped>
.radioWrap {
    position: absolute;
    left: 5rem;
    top: 0;
    bottom: 0;
    height: 2rem;
    line-height: 2rem;
    margin: auto;
    .radioBtnItem {
        display: inline-block;
        height: 2rem;
        line-height: 2rem;
        font-size: 0.8rem;
        font-weight: bold;
        .radioSelect {
            display: inline-block;
            width: 0.8rem;
            height: 0.8rem;
            border: 1px solid #2C3E50;
            border-radius: 50%;
            vertical-align: middle;
        }
        .radioTxt {
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.4rem;
        }
    }
    .radioBtnItem:nth-of-type(n + 2) {
        margin-left: 1.4rem;
    }
}
</style>
