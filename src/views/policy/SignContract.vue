<template>
    <div class="signContract">
        <span class="toSignBtn" @click="toSign">{{signImgData == null ? '点击签名' : ''}}<img v-if="signImgData != null" :src="signImgData"></span>
        <span class="readFinish" @click="readFinish" v-if="canReadFinishTime < 0">阅读完毕</span>
        <span class="readFinish readFinishTimeDown" v-if="canReadFinishTime >= 0">{{`（ ${canReadFinishTime} 秒 ） 阅读完毕`}}</span>
    </div>
</template>

<script>
export default {
    name: 'signContract',
    data() {
        return {
            canReadFinishTime: 60, // 可以点击阅读完毕的倒计时
            signImgData: null
        }
    },
    created() {
        let lockTime = setInterval(() => {
          this.canReadFinishTime--
          if (this.canReadFinishTime <= 0) {
            this.canReadFinishTime = -1
            clearInterval(lockTime)
          }
        }, 1000)
    },
    methods: {
        toSign: function() {
            this.$comfun.showSignPanel(this, (base64, imgFile) => {
                this.signImgData = base64
            })
        },
        readFinish: function() {

        }
    }
}
</script>

<style lang="less" scoped>
.toSignBtn {
    position: relative;
    display: block;
    width: 8rem;
    height: 4rem;
    line-height: 4rem;
    background: #e7dc9b;
    text-align: center;
    font-size: 0.9rem;
    margin: 2rem 2rem 3rem;
    float: right;
    img {
        position: absolute;
        width: 4rem;
        height: 8rem;
        top: -2rem;
        left: 2rem;
        transform: rotate(-90deg);
        transform-origin: center center;
    }
}
.toSignBtn::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #303030;
}

.readFinish {
  clear: both;
  position: relative;
  display: block;
  width: calc(100% - 2.4rem);
  background: #2b2b2b;
  color: #ffffff;
  text-align: center;
  left: 1.2rem;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  margin-top: 1.8rem;
  font-size: 0.8rem;
  border-radius: 2px;
  box-shadow: 0px 0px 2px #4e4e4ea6;
  margin-bottom: 2.2rem;
}

.readFinishTimeDown {
    background: #969696;
}
</style>
