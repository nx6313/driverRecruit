var touchStartX = null // 开始滑动的起点x坐标
var touchStartY = null // 开始滑动的起点y坐标
var touchDistanceX = 0 // 滑动的x方向距离
var touchDistanceY = 0 // 滑动的y方向距离

export default {
  install: function (Vue) {
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
  }
}

// 滑动事件 - 开始滑动
let touchStartEvent = function(e) {
  e.preventDefault()
  touchStartX = e.touches[0].pageX
  touchStartY = e.touches[0].pageY
}
// 滑动事件 - 滑动中
let touchMoveEvent = function(e, binding) {
  e.preventDefault()
  if (binding.arg == 'moveUpDown' || binding.arg == 'moveLeftRight') {
    if (touchStartX == null || touchStartY == null) {
      touchStartX = e.touches[0].pageX
      touchStartY = e.touches[0].pageY
    }
    touchDistanceX = e.touches[0].pageX - touchStartX
    touchDistanceY = e.touches[0].pageY - touchStartY
    if (binding.arg == 'moveUpDown') {
      if (binding.value instanceof Array) {
        if (binding.value.length > 0 && binding.value[0] instanceof Function) binding.value[0](touchDistanceY)
      }
    } else if (binding.arg == 'moveLeftRight') {
      if (binding.value instanceof Array) {
        if (binding.value.length > 0 && binding.value[0] instanceof Function) binding.value[0](touchDistanceX)
      }
    }
  }
}
// 滑动事件 - 滑动结束
let touchEndEvent = function(e, binding) {
  e.preventDefault()
  if (binding.value instanceof Array) {
    if (binding.value.length > 1 && binding.value[1] instanceof Function) binding.value[1](binding.arg == 'moveUpDown' ? touchDistanceY : touchDistanceX)
  } else {
    if (binding.value instanceof Function) binding.value(binding.arg == 'moveUpDown' ? touchDistanceY : touchDistanceX)
  }
  touchStartX = null
  touchStartY = null
  touchDistanceX = 0
  touchDistanceY = 0
}