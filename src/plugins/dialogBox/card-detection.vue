<template>
  <div v-if="isShow" id="dialog-card-detection-wrap" class="dialog-card-detection-wrap">
    <div class="card-detection-shade animated fadeIn" @click="shadeClose ? close.apply() : () => {}"></div>
    <div class="card-detection-content animated fadeIn" ref="card-detection-content">
      <div>
        <span>{{tip || '正在检测证件是否有效'}}</span>
        <img v-lazy="require('@/assets/card_detection.gif')">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-card-detection',
  data () {
    return {
      isShow: true,
      shadeClose: false,
      tip: null
    }
  },
  beforeMount () {
    let dialogCardDetection = document.querySelector('#dialog-card-detection-wrap')
    if (dialogCardDetection && dialogCardDetection.parentNode) {
      dialogCardDetection.parentNode.removeChild(dialogCardDetection)
    }
  },
  methods: {
    close () {
      this.$refs['card-detection-content'].classList.remove('fadeIn')
      this.$refs['card-detection-content'].classList.add('fadeOut')
      setTimeout(() => {
          this.isShow = false
      }, 0.2 * 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.card-detection-shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 99999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -vendor-animation-delay: 0.1s;
  animation-delay: 0.1s;
  background-image: url('./../../assets/black_point_bg.png');
  background-color: rgba(0, 0, 0, .8);
}
.card-detection-content {
  position: fixed;
  top: 30vh;
  width: 100%;
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 999999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  user-select: none;
  div {
    position: relative;
    display: inline-block;
    border-radius: 3px;
    span {
      display: block;
      color: #ffffff;
      font-size: 0.9rem;
      text-shadow: 0px 4px 20px #000000;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-color: #ffffff;
      background-image: -webkit-linear-gradient(-45deg, rgba(255, 255, 255, 0.8) 30%, #57c9e2 50%, rgba(255, 255, 255, 0.8) 70%);
      background-blend-mode: hard-light;
      background-size: 200%;
      animation: shine 2.4s infinite;
      -webkit-animation: shine 2.4s infinite;
    }
  }
}

@keyframes shine {
  from {
    background-position: 150%;
  }
  to {
    background-position: -50%;
  }
}
</style>
