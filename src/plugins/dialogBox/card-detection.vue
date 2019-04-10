<template>
  <div v-if="isShow" id="dialog-card-detection-wrap" class="dialog-card-detection-wrap">
    <div class="card-detection-shade animated fadeIn" ref="card-detection-shade" @click="shadeClose ? close.apply() : () => {}"></div>
    <div class="card-detection-content animated fadeIn" ref="card-detection-content">
      <div>
        <span class="title">{{tip || '正在检测证件是否有效'}}</span>
        <img :src="$card_detectioning_img">
        <span class="curStep">{{stepInfo || '正在检测中'}}</span>
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
      tip: null,
      stepInfo: null
    }
  },
  beforeMount () {
    let dialogCardDetection = document.querySelector('#dialog-card-detection-wrap')
    if (dialogCardDetection && dialogCardDetection.parentNode) {
      dialogCardDetection.parentNode.removeChild(dialogCardDetection)
    }
    document.body.addEventListener("touchmove", this.preventDefault, {
      passive: false
    })
    document.body.style.overflow = "hidden"
  },
  methods: {
    preventDefault(e) {
      e.preventDefault()
    },
    close () {
      this.$refs['card-detection-shade'].classList.remove('fadeIn')
      this.$refs['card-detection-shade'].classList.add('fadeOut')
      this.$refs['card-detection-content'].classList.remove('fadeIn')
      this.$refs['card-detection-content'].classList.add('fadeOut')
      setTimeout(() => {
        this.isShow = false
        document.body.removeEventListener("touchmove", this.preventDefault)
        document.body.style.overflow = "auto"
      }, 0.7 * 1000)
    },
    updateStepInfo (stepInfo) {
      this.stepInfo = stepInfo
    }
  }
}
</script>

<style lang="less" scoped>
.card-detection-shade {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 99999;
  -vendor-animation-duration: 0.6s;
  animation-duration: 0.6s;
  background-image: url('./../../assets/black_point_bg.png');
  background-color: rgba(0, 0, 0, .8);
}
.card-detection-content {
  position: fixed;
  top: 28vh;
  width: 100%;
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 999999;
  -vendor-animation-duration: 0.6s;
  animation-duration: 0.6s;
  user-select: none;
  pointer-events: none;
  div {
    position: relative;
    display: inline-block;
    border-radius: 3px;
    span {
      display: block;
      color: #ffffff;
      font-size: 0.9rem;
      text-shadow: 0px 4px 20px #000000;
    }
    .title {
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
    img {
      width: 70%;
      margin-top: 1.4rem;
      box-shadow: 0 0 40px #9be3f3;
      background-color: #3aa6be;
      border-radius: 8px;
      animation: detectioning 1.2s infinite alternate;
      -webkit-animation: detectioning 1.2s infinite alternate;
    }
    .curStep {
      position: relative;
      margin-top: 1.6rem;
      font-size: 0.76rem;
      color: #e8fbff;
      font-weight: normal;
    }
    .curStep::after {
      content: '.';
      position: relative;
      animation: detectioningTip 3.2s infinite;
      -webkit-animation: detectioningTip 3.2s infinite;
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

@keyframes detectioning {
  from {
    box-shadow: 0 0 40px #3aa6be;
  }
  to {
    box-shadow: 0 0 40px #9be3f3;
  }
}

@keyframes detectioningTip {
  0% {
    content: '.';
  }
  20% {
    content: '..';
  }
  40% {
    content: '...';
  }
  60% {
    content: '....';
  }
  80% {
    content: '.....';
  }
  100% {
    content: '......';
  }
}
</style>
