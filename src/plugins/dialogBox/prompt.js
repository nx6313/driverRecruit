import Vue from 'vue'
import Prompt from './prompt.vue'

Prompt.installPrompt = function (options) {
  var PromptComment = Vue.extend(Prompt)
  var comment = new PromptComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}

export default Prompt
