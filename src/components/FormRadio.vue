<template>
    <div class="radioWrap">
        <div v-for="(radio, radioIndex) in radios" v-bind:key="radioIndex" class="radioBtnItem" :value="radio.name" @click="selectThis(radio)">
            <span :class="['radioSelect', radio.name == value ? 'isSelected' : '']"></span>
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
            this.$emit('input', radio.name)
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
            position: relative;
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
        .isSelected::before {
            content: '';
            display: inline-block;
            position: absolute;
            width: 0.6rem;
            height: 0.6rem;
            background: radial-gradient(#ffffff, #2C3E50, rgb(63, 93, 121), #516437, rgb(207, 180, 27));
            border-radius: 50%;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            box-shadow: 0 0 10px rgba(165, 160, 30, 0.8);
            animation: eyeAnim 6s infinite alternate;
            -webkit-transition: all 1s ease-in-out;
            transition: all 1s ease;
        }
    }
    .radioBtnItem:nth-of-type(n + 2) {
        margin-left: 1.4rem;
    }

    @keyframes eyeAnim {
        0% {
            -webkit-transform: scale(0.6);
            transform: scale(0.6);
        }
        60% {
            -webkit-transform: translate(-1px, -1px) skew(2deg, 4deg) rotate(-10deg);
            transform: translate(-1px, -1px) skew(2deg, 4deg) rotate(-10deg);
        }
        70% {
            -webkit-transform: translate(-1px, -1px) rotate(10deg);
            transform: translate(-1px, -1px) rotate(10deg);
        }
        80% {
            -webkit-transform: scale(0.8);
            transform: scale(0.8);
        }
        100% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }
}
</style>
