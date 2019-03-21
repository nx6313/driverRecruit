var touchStartX = null // 开始滑动的起点x坐标
var touchStartY = null // 开始滑动的起点y坐标
var touchDistanceX = 0 // 滑动的x方向距离
var touchDistanceY = 0 // 滑动的y方向距离
var objX = null // 元素本来的x坐标(每次拖拽时更新)
var objY = null // 元素本来的y坐标(每次拖拽时更新)
var objXReal = null // 元素本来的x坐标(不更新)
var objYReal = null // 元素本来的y坐标(不更新)
var speedX = 0 // x方向要求的速度，用于惯性移动
var speedY = 0 // y方向要求的速度，用于惯性移动
var lastX = 0 // x方向最后一次的距离，用于惯性移动
var lastY = 0 // y方向最后一次的距离，用于惯性移动
var inertiaTimer = null // 惯性移动定时器
var friction = 0.95 // 惯性移动 - 摩擦系数
var overstepPadding = 5 // 拖拽边界间距

export default {
  install: function (Vue) {
    /** 滑动指令 */
    Vue.directive('touch', {
      bind: function(el, binding, vnode, oldVnode) {
        el.addEventListener('touchstart', touchStartEvent, { passive: false })
        el.addEventListener('touchmove', e => touchMoveEvent(e, binding), { passive: false })
        el.addEventListener('touchend', e => touchEndEvent(e, binding), { passive: false })
      },
      inserted: function() {},
      update: function() {},
      componentUpdated: function() {},
      unbind: function(el) {
        el.removeEventListener("touchstart", touchStartEvent)
        el.removeEventListener("touchmove", touchMoveEvent)
        el.removeEventListener("touchend", touchEndEvent)
      }
    })
    /** 拖拽指令 */
    Vue.directive('drag', {
      bind: function(el, binding, vnode, oldVnode) {
        el.addEventListener('touchstart', e => touchStartEvent(e, el), { passive: false })
        el.addEventListener('touchmove', e => touchMoveEvent(e, binding, el), { passive: false })
        el.addEventListener('touchend', e => touchEndEvent(e, binding, el), { passive: false })
      },
      inserted: function(el) {
        setTimeout(() => {
          objXReal = el.offsetLeft
          objYReal = el.offsetTop
          lastX = el.offsetLeft
          lastY = el.offsetTop
        }, 400)
      },
      update: function() {},
      componentUpdated: function() {},
      unbind: function(el) {
        objXReal = null
        objYReal = null
        el.removeEventListener("touchstart", touchStartEvent)
        el.removeEventListener("touchmove", touchMoveEvent)
        el.removeEventListener("touchend", touchEndEvent)
      }
    })
  }
}

// 滑动事件 - 开始滑动
let touchStartEvent = function(e, el) {
  e.preventDefault()
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  if (el) {
    objX = el.offsetLeft
    objY = el.offsetTop
  }
  speedX = 0
  speedY = 0
}
// 滑动事件 - 滑动中
let touchMoveEvent = function(e, binding, el) {
  e.preventDefault()
  if (touchStartX == null || touchStartY == null) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }
  touchDistanceX = e.touches[0].clientX - touchStartX
  touchDistanceY = e.touches[0].clientY - touchStartY
  if (binding.arg == 'moveUpDown' || binding.arg == 'moveLeftRight') {
    if (binding.arg == 'moveUpDown') {
      if (binding.value instanceof Array) {
        if (binding.value.length > 0 && binding.value[0] instanceof Function) binding.value[0](touchDistanceY)
      }
    } else if (binding.arg == 'moveLeftRight') {
      if (binding.value instanceof Array) {
        if (binding.value.length > 0 && binding.value[0] instanceof Function) binding.value[0](touchDistanceX)
      }
    }
  } else {
    if (el) {
      speedX = el.offsetLeft - lastX
      speedY = el.offsetTop - lastY
      lastX = el.offsetLeft
      lastY = el.offsetTop
      if (objX == null || objY == null) {
        objX = el.offsetLeft
        objY = el.offsetTop
      }
      let dragAbout = ['top', 'left']
      if (binding.arg == 'config' && Array.isArray(binding.value.about)) dragAbout = binding.value.about
      if (dragAbout.length > 0 && dragAbout.length < 3 && dragAbout.every(v => ['top', 'right', 'bottom', 'left'].includes(v))) {
        let elWidth = el.getBoundingClientRect().width
        let elHeight = el.getBoundingClientRect().height
        if (dragAbout[0] == 'top' || dragAbout[1] == 'top') {
          let toTop = touchDistanceY + objY
          el.style.top = (() => {
            if (binding.value.overstep === false) {
              if (toTop < 0 + overstepPadding) toTop = 0 + overstepPadding
              if (toTop > window.screen.availHeight - elHeight - overstepPadding) toTop = window.screen.availHeight - elHeight - overstepPadding
            }
            return toTop
          }).apply() + 'px'
        }
        if (dragAbout[0] == 'bottom' || dragAbout[1] == 'bottom') {
          let toBottom = window.screen.availHeight - (touchDistanceY + objY) - elHeight
          el.style.bottom = (() => {
            if (binding.value.overstep === false) {
              if (toBottom < 0 + overstepPadding) toBottom = 0 + overstepPadding
              if (toBottom > window.screen.availHeight - elHeight - overstepPadding) toBottom = window.screen.availHeight - elHeight - overstepPadding
            }
            return toBottom
          }).apply() + 'px'
        }
        if (dragAbout[0] == 'left' || dragAbout[1] == 'left') {
          let toLeft = touchDistanceX + objX
          el.style.left = (() => {
            if (binding.value.overstep === false) {
              if (toLeft < 0 + overstepPadding) toLeft = 0 + overstepPadding
              if (toLeft > window.screen.availWidth - elWidth - overstepPadding) toLeft = window.screen.availWidth - elWidth - overstepPadding
            }
            return toLeft
          }).apply() + 'px'
        }
        if (dragAbout[0] == 'right' || dragAbout[1] == 'right') {
          let toRight = window.screen.availWidth - (touchDistanceX + objX) - elWidth
          el.style.right = (() => {
            if (binding.value.overstep === false) {
              if (toRight < 0 + overstepPadding) toRight = 0 + overstepPadding
              if (toRight > window.screen.availWidth - elWidth - overstepPadding) toRight = window.screen.availWidth - elWidth - overstepPadding
            }
            return toRight
          }).apply() + 'px'
        }
      }
    }
  }
}
// 滑动事件 - 滑动结束
let touchEndEvent = function(e, binding, el) {
  e.preventDefault()
  if (binding.value instanceof Array) {
    if (binding.value.length > 1 && binding.value[1] instanceof Function) binding.value[1](binding.arg == 'moveUpDown' ? touchDistanceY : touchDistanceX)
  } else {
    if (binding.value instanceof Function) binding.value(binding.arg == 'moveUpDown' ? touchDistanceY : touchDistanceX)
  }
  if (el) {
    if (binding.arg == 'config') {
      if (binding.value.recover === true) {
        // 拖拽结束，恢复至原本位置
        let dragAbout = ['top', 'left']
        if (binding.arg == 'config' && Array.isArray(binding.value.about)) dragAbout = binding.value.about
        if (dragAbout.length > 0 && dragAbout.length < 3 && dragAbout.every(v => ['top', 'right', 'bottom', 'left'].includes(v))) {
          el.style.WebkitTransition = 'all 0.3s ease-out'
          el.style.transition = 'all 0.3s ease-out'
          setTimeout(() => {
            el.style.WebkitTransition = ''
            el.style.transition = ''
          }, 0.31 * 1000)
          let elWidth = el.getBoundingClientRect().width
          let elHeight = el.getBoundingClientRect().height
          if (dragAbout[0] == 'top' || dragAbout[1] == 'top') el.style.top = objYReal + 'px'
          if (dragAbout[0] == 'bottom' || dragAbout[1] == 'bottom') el.style.bottom = (window.screen.availHeight - objYReal - elHeight) + 'px'
          if (dragAbout[0] == 'left' || dragAbout[1] == 'left') el.style.left = objXReal + 'px'
          if (dragAbout[0] == 'right' || dragAbout[1] == 'right') el.style.right = (window.screen.availWidth - objXReal - elWidth) + 'px'
        }
      } else if (binding.value.inertia === true) {
        // 拖拽结束，惯性移动停止
        let dragAbout = ['top', 'left']
        if (binding.arg == 'config' && Array.isArray(binding.value.about)) dragAbout = binding.value.about
        if (dragAbout.length > 0 && dragAbout.length < 3 && dragAbout.every(v => ['top', 'right', 'bottom', 'left'].includes(v))) {
          let elWidth = el.getBoundingClientRect().width
          let elHeight = el.getBoundingClientRect().height
          clearInterval(inertiaTimer)
          inertiaTimer = setInterval(() => {
            speedX *= friction
            speedY *= friction
            if (dragAbout[0] == 'top' || dragAbout[1] == 'top') el.style.top = (() => {
              let toTop = el.offsetTop + speedY
              if (toTop < 0 + overstepPadding) toTop = 0 + overstepPadding
              if (toTop > window.screen.availHeight - elHeight - overstepPadding) toTop = window.screen.availHeight - elHeight - overstepPadding
              return toTop
            }).apply() + 'px'
            if (dragAbout[0] == 'bottom' || dragAbout[1] == 'bottom') el.style.bottom = (() => {
              let toBottom = window.screen.availHeight - (el.offsetTop + speedY) - elHeight
              if (toBottom < 0 + overstepPadding) toBottom = 0 + overstepPadding
              if (toBottom > window.screen.availHeight - elHeight - overstepPadding) toBottom = window.screen.availHeight - elHeight - overstepPadding
              return toBottom
            }).apply() + 'px'
            if (dragAbout[0] == 'left' || dragAbout[1] == 'left') el.style.left = (() => {
              let toLeft = el.offsetLeft + speedX
              if (toLeft < 0 + overstepPadding) toLeft = 0 + overstepPadding
              if (toLeft > window.screen.availWidth - elWidth - overstepPadding) toLeft = window.screen.availWidth - elWidth - overstepPadding
              return toLeft
            }).apply() + 'px'
            if (dragAbout[0] == 'right' || dragAbout[1] == 'right') el.style.right = (() => {
              let toRight = window.screen.availWidth - (el.offsetLeft + speedX) - elWidth
              if (toRight < 0 + overstepPadding) toRight = 0 + overstepPadding
              if (toRight > window.screen.availWidth - elWidth - overstepPadding) toRight = window.screen.availWidth - elWidth - overstepPadding
              return toRight
            }).apply() + 'px'
            if (Math.abs(speedX) < 1) speedX = 0
            if (Math.abs(speedY) < 1) speedY = 0
            if (speedX == 0 && speedY == 0) {
              clearInterval(inertiaTimer)
              speedX = 0
              speedY = 0
            }
          }, 10)
        }
      }
    }
  }
  touchStartX = null
  touchStartY = null
  touchDistanceX = 0
  touchDistanceY = 0
  objX = null
  objY = null
}
