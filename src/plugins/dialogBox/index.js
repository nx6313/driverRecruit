import DialogMsg from './msg.js'
import DialogPrompt from './prompt.js'
import DialogSign from './sign.js'
import DialogCardDetection from './card-detection.js'

export default {
    install: function (Vue) {
        Vue.component(DialogMsg.name, DialogMsg)
        Vue.component(DialogPrompt.name, DialogPrompt)
        Vue.component(DialogSign.name, DialogSign)
        Vue.component(DialogCardDetection.name, DialogCardDetection)

        Vue.prototype.$dialog_msg = DialogMsg.installMsg
        Vue.prototype.$dialog_prompt = DialogPrompt.installPrompt
        Vue.prototype.$dialog_sign = DialogSign.installSign
        Vue.prototype.$dialog_card_detection = DialogCardDetection.installCardDetection

        Vue.prototype.$card_detectioning_img = require('@/assets/card_detection.gif')
    }
}
