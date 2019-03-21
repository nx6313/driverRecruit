<template>
  <div id="marquee-wrap" class="wrap">
    <div id="marquee-box">
      <div id="marquee">{{text}}</div>
      <div id="marquee-copy"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'marquee',
  props: ['lists'],
  data () {
    return {
      text: ''
    }
  },
  methods: {
    move () {
      let wrapWidth = document.getElementById('marquee-wrap').getBoundingClientRect().width
      let width = document.getElementById('marquee').getBoundingClientRect().width
      let copy = document.getElementById('marquee-copy')
      if (width > wrapWidth) {
        let box = document.getElementById('marquee-box')
        copy.innerText = this.text // 文字副本填充
        let distance = 0 // 位移距离
        //设置位移
        setInterval(function () {
          distance = distance - 1
          // 如果位移超过文字宽度，则回到起点
          if (-distance >= width) {
            distance = 16
          }
          box.style.transform = 'translateX(' + distance + 'px)'
        }, 40)
      } else {
        copy.style.display = 'none'
      }
    }
  },
  // 把父组件传入的arr转化成字符串
  mounted: function () {
    for (let i = 0; i < this.lists.length; i++) {
      if (this.text == '')
        this.text += this.lists[i]
      else
        this.text += '  ' + this.lists[i]
    }
  },
  // 更新的时候运动
  updated: function () {
    this.move()
  }
}
</script>

<style lang="less" scoped>
.wrap {
  overflow: hidden;
  user-select: none;
  pointer-events: none;
}
#marquee-box {
  width: 80000%;
}
#marquee-box div {
  float: left;
}
#marquee-copy {
  margin-left: 16px;
}
</style>
