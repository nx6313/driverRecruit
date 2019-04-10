import Vue from 'vue'
import Sign from './sign.vue'

Sign.installSign = function (options) {
  var SignComment = Vue.extend(Sign)
  var comment = new SignComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
  return comment
}

export default Sign
