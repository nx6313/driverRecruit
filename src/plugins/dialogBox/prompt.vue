<template>
  <div v-if="isShow" id="dialog-prompt-wrap" class="react-confirm-alert">
    <div class="react-confirm-alert-overlay animated fadeIn" @click="closePrompt">
      <div class="react-confirm-alert prompt-content animated fadeIn" ref="prompt-content">
        <div class="react-confirm-alert-body">
          <h1>{{title}}</h1>
          {{msg}}
          <input v-if="!isMultiline" class="react-confirm-alert-prompt" type="text" :placeholder="hint" v-model="promptInput" ref="prompt-input"/>
          <textarea v-if="isMultiline" class="react-confirm-alert-prompt multiline" type="text" :placeholder="hint" v-model="promptInput" ref="prompt-input"/>
          <div v-if="rule !== undefined && hasStartInput" class="ruleTip">
            <span v-if="isOkForRule" class="ok">{{ruleOkTip}}</span>
            <span v-if="!isOkForRule" class="error">{{ruleErrorTip}}</span>
          </div>
          <div class="react-confirm-alert-button-group">
            <template v-for="(btn, index) in buttons">
              <button v-bind:todo="btn" v-bind:key="index" @click="clickBtn(index, btn.onClick)" :class="'btn-' + (index == 0 ? 'cancel' : 'ok')" :ref="'btn-' + index" :style="index == 1 && rule !== undefined && !isOkForRule ? { 'background': '#8d8d8d' } : {}" v-if="(showCancel && index == 0) || index == 1">{{btn.label}}</button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-prompt',
  data () {
    return {
      isShow: true,
      shadeClose: false,
      title: '',
      msg: '',
      hint: '',
      promptInput: '',
      rule: undefined,
      isOkForRule: false,
      hasStartInput: false,
      ruleOkTip: '',
      ruleErrorTip: '',
      buttons: [
        {
          label: '取消',
          onClick: () => {}
        },
        {
          label: '确认',
          onClick: () => {}
        }
      ],
      showCancel: true,
      ruleCallBack: () => {},
      isMultiline: false
    }
  },
  beforeMount () {
    let dialogPrompt = document.querySelector('#dialog-prompt-wrap')
    if (dialogPrompt && dialogPrompt.parentNode) {
      dialogPrompt.parentNode.removeChild(dialogPrompt)
    }
  },
  methods: {
    closePrompt () {
      if (this.shadeClose) {
          this.$refs['prompt-content'].classList.remove('fadeIn')
          this.$refs['prompt-content'].classList.add('fadeOut')
          setTimeout(() => {
              this.isShow = false
          }, 0.2 * 1000)
      }
    },
    promptVerify (val) {
      this.hasStartInput = true
      if (this.rule != undefined) {
        if (!this.rule.test(val.trim())) {
          this.isOkForRule = false
          this.ruleCallBack({
            result: false,
            btns: {
              cancelBtn: this.$refs['btn-0'],
              okBtn: this.$refs['btn-1']
            }
          })
        } else {
          this.isOkForRule = true
          this.ruleCallBack({
            result: true,
            btns: {
              cancelBtn: this.$refs['btn-0'],
              okBtn: this.$refs['btn-1']
            }
          })
        }
      }
    },
    clickBtn (index, btnEvent) {
      if (index == 1 && this.rule != undefined && !this.isOkForRule) {
        this.$comfun.showToast(this, '请先输入')
        return false
      }
      let res = btnEvent(this.$refs['prompt-input'].value)
      if (res === false) return false
      this.$refs['prompt-content'].classList.remove('fadeIn')
      this.$refs['prompt-content'].classList.add('fadeOut')
      setTimeout(() => {
          this.isShow = false
      }, 0.2 * 1000)
    }
  },
  watch: {
    promptInput: function(val) {
      this.promptVerify(val)
    }
  }
}
</script>

<style lang="less" scoped>
.react-confirm-alert {
  user-select: none;
  div.react-confirm-alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: #2c2c2c6c;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    opacity: 0;
    animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
    div.react-confirm-alert-body {
      width: 70vw;
      padding: 10px;
      border-radius: 4px;
      font-size: 0.7rem;
      box-shadow: 0 20px 75px rgba(0, 0, 0, 0.13);
      color: #666;
      h1 {
        font-size: 0.8rem;
      }
      input.react-confirm-alert-prompt {
        display: block;
        width: calc(100% - 20px);
        border: none;
        padding: 8px 10px;
        background: #e9e9e9;
        margin-top: 10px;
        outline: none;
        font-size: 0.8rem;
        color: #2c2c2c;
        border-radius: 4px;
      }
      div.ruleTip {
        text-align: right;
        margin-top: 4px;
        font-size: 0.5rem;
        font-weight: bold;
        span.ok {
          color: #008507;
        }
        span.error {
          color: #850000;
        }
      }
      div.react-confirm-alert-button-group {
        button {
          outline: none;
          background: #333;
          border: none;
          display: inline-block;
          padding: 6px 18px;
          color: #eee;
          margin-right: 10px;
          border-radius: 5px;
          font-size: 12px;
          cursor: pointer;
        }
        button.btn-cancel {
          background: #8d8d8d;
        }
      }
      .multiline {
        display: block;
        width: calc(100% - 20px);
        height: 6rem;
        border: none;
        padding: 8px 10px;
        background: #e9e9e9;
        margin-top: 10px;
        outline: none;
        font-size: 0.8rem;
        color: #2c2c2c;
        border-radius: 4px;
        resize: none;
      }
    }
  }
}
</style>
