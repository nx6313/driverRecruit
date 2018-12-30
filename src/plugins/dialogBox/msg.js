import Vue from 'vue'
import Msg from './msg.vue'

Msg.installMsg = function (options) {
  var MsgComment = Vue.extend(Msg)
  var comment = new MsgComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}

export default Msg
