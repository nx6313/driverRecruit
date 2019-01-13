import DialogMsg from './msg.js'
import DialogPrompt from './prompt.js'
import DialogSign from './sign.js'

export default {
    install: function (Vue) {
        Vue.component(DialogMsg.name, DialogMsg)
        Vue.component(DialogPrompt.name, DialogPrompt)
        Vue.component(DialogSign.name, DialogSign)

        Vue.prototype.$dialog_msg = DialogMsg.installMsg
        Vue.prototype.$dialog_prompt = DialogPrompt.installPrompt
        Vue.prototype.$dialog_sign = DialogSign.installSign
    }
}
