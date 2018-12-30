import DialogMsg from './msg.js'
import DialogPrompt from './prompt.js'

export default {
    install: function (Vue) {
        Vue.component(DialogMsg.name, DialogMsg)
        Vue.component(DialogPrompt.name, DialogPrompt)

        Vue.prototype.$dialog_msg = DialogMsg.installMsg
        Vue.prototype.$dialog_prompt = DialogPrompt.installPrompt
    }
}
