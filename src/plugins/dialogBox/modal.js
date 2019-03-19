import Vue from 'vue'
import Modal from './modal.vue'

Modal.installModal = function (options) {
  var ModalComment = Vue.extend(Modal)
  var comment = new ModalComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}

export default Modal
