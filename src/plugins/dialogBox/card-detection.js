import Vue from 'vue'
import CardDetection from './card-detection.vue'

CardDetection.installCardDetection = function (options) {
  var CardDetectionComment = Vue.extend(CardDetection)
  var comment = new CardDetectionComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
  return comment
}

export default CardDetection
