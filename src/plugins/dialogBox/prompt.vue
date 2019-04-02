<template>
  <div v-if="isShow" id="dialog-prompt-wrap" class="confirm-alert-wrap">
    <div class="shade animated fadeIn" @click="shadeClosePrompt"></div>
    <div class="react-confirm-alert-wrap prompt-content animated fadeIn" ref="prompt-content">
      <div class="react-confirm-alert-body">
        <h1 :style="isLogin ? { textAlign: 'center', fontWeight: 'bold' } : {}">{{title}}</h1>
        {{msg}}
        <template v-if="isLogin">
          <div class="send-sms-code-wrap">
            <input
              class="react-confirm-alert-prompt"
              type="text"
              placeholder="请输入您的登录账号"
              v-model="promptInput"
              ref="prompt-input-account"
            >
            <span class="send-sms-code-btn" @click="sendLoginSmsCode">发送验证码</span>
          </div>
          <input
            class="react-confirm-alert-prompt"
            type="text"
            placeholder="请输入您收到的短信验证码"
            v-model="promptCodeInput"
            ref="prompt-input-code"
          >
          <div v-if="rule !== undefined && hasStartInput" class="ruleTip">
            <span v-if="isOkForRule" class="ok">{{ruleOkTip}}</span>
            <span v-if="!isOkForRule" class="error">{{ruleErrorTip}}</span>
          </div>
        </template>
        <template v-if="!isLogin">
          <input
            v-if="!isMultiline"
            class="react-confirm-alert-prompt"
            type="text"
            :placeholder="hint"
            v-model="promptInput"
            ref="prompt-input"
          >
          <textarea
            v-if="isMultiline"
            class="react-confirm-alert-prompt multiline"
            type="text"
            :placeholder="hint"
            v-model="promptInput"
            ref="prompt-input"
            v-text="defalutValue != null ? defalutValue : ''"
          />
          <div v-if="rule !== undefined && hasStartInput" class="ruleTip">
            <span v-if="isOkForRule" class="ok">{{ruleOkTip}}</span>
            <span v-if="!isOkForRule" class="error">{{ruleErrorTip}}</span>
          </div>
        </template>
        <div class="react-confirm-alert-button-group" :style="isLogin ? { justifyContent: 'space-around' } : {}">
          <template v-for="(btn, index) in buttons">
            <button
              v-bind:todo="btn"
              v-bind:key="index"
              @click="clickBtn(index, btn.onClick)"
              :class="'btn-' + (index == 0 ? 'cancel' : 'ok')"
              :ref="'btn-' + index"
              :style="index == 1 && ((rule !== undefined && !isOkForRule) || isLogin) ? { 'background': '#119CAD' } : {}"
              v-if="(showCancel && index == 0) || index == 1"
            >{{btn.label}}</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dialog-prompt",
  data() {
    return {
      isShow: true,
      shadeClose: false,
      title: "",
      msg: "",
      hint: "",
      promptInput: "",
      promptCodeInput: "",
      rule: undefined,
      isOkForRule: false,
      hasStartInput: false,
      ruleOkTip: "",
      ruleErrorTip: "",
      buttons: [
        {
          label: "取消",
          onClick: () => {}
        },
        {
          label: "确认",
          onClick: () => {}
        }
      ],
      showCancel: true,
      ruleCallBack: () => {},
      isMultiline: false,
      isLogin: false,
      sendSmsCodeCallBack: () => {},
      defalutValue: null
    };
  },
  beforeMount() {
    let dialogPrompt = document.querySelector("#dialog-prompt-wrap");
    if (dialogPrompt && dialogPrompt.parentNode) {
      dialogPrompt.parentNode.removeChild(dialogPrompt);
    }
    document.body.addEventListener("touchmove", this.preventDefault, {
      passive: false
    });
    document.body.style.overflow = "hidden";
  },
  methods: {
    preventDefault(e) {
      e.preventDefault();
    },
    shadeClosePrompt() {
      if (this.shadeClose) {
        this.$refs["prompt-content"].classList.remove("fadeIn");
        this.$refs["prompt-content"].classList.add("fadeOut");
        setTimeout(() => {
          this.destoryPrompt();
        }, 0.2 * 1000);
      }
    },
    destoryPrompt() {
      this.isShow = false;
      document.body.removeEventListener("touchmove", this.preventDefault);
      document.body.style.overflow = "auto";
    },
    promptVerify(val) {
      this.hasStartInput = true;
      if (this.rule != undefined) {
        if (!this.rule.test(val.trim())) {
          this.isOkForRule = false;
          this.ruleCallBack({
            result: false,
            btns: {
              cancelBtn: this.$refs["btn-0"],
              okBtn: this.$refs["btn-1"]
            }
          });
        } else {
          this.isOkForRule = true;
          this.ruleCallBack({
            result: true,
            btns: {
              cancelBtn: this.$refs["btn-0"],
              okBtn: this.$refs["btn-1"]
            }
          });
        }
      }
    },
    clickBtn(index, btnEvent) {
      if (index == 1) {
        if (this.isLogin) {
          if (this.$refs["prompt-input-account"].value.trim() == '') {
            this.$comfun.showToast(this, "请输入您的登录账号");
            return false;
          }
          if (this.$refs["prompt-input-code"].value.trim() == '') {
            this.$comfun.showToast(this, "请输入您收到的短信验证码");
            return false;
          }
        } else if (this.rule != undefined && !this.isOkForRule) {
          this.$comfun.showToast(this, "请先输入");
          return false;
        }
      }
      if (this.isLogin) {
        let res = btnEvent(this.$refs["prompt-input-account"].value.trim(), this.$refs["prompt-input-code"].value.trim());
        if (res === false) return false;
      } else {
        let res = btnEvent(this.$refs["prompt-input"].value.trim());
        if (res === false) return false;
      }
      this.$refs["prompt-content"].classList.remove("fadeIn");
      this.$refs["prompt-content"].classList.add("fadeOut");
      setTimeout(() => {
        this.destoryPrompt();
      }, 0.2 * 1000);
    },
    sendLoginSmsCode() {
      if (this.rule != undefined && !this.isOkForRule) {
        this.$comfun.showToast(this, "请输入正确的登录账号");
        return false;
      }
      this.sendSmsCodeCallBack(this.promptInput.trim())
    }
  },
  watch: {
    promptInput: function(val) {
      this.promptVerify(val);
    }
  }
};
</script>

<style lang="less" scoped>
.confirm-alert-wrap {
  user-select: none;
  div.shade {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background: rgba(61, 61, 61, 0.4);
  }
  div.react-confirm-alert-wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: rgba(61, 61, 61, 0.4);
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    opacity: 0;
    animation: react-confirm-alert-fadeIn 0.3s 0.2s forwards;
    div.react-confirm-alert-body {
      width: 80vw;
      padding: 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      box-shadow: 0 20px 75px rgba(0, 0, 0, 0.13);
      color: #666;
      h1 {
        font-size: 1rem;
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
        font-size: 0.8rem;
        font-weight: bold;
        span.ok {
          color: #008507;
        }
        span.error {
          color: #850000;
        }
      }
      div.react-confirm-alert-button-group {
        margin-bottom: 0.6rem;
        button {
          outline: none;
          background: #333;
          border: none;
          display: inline-block;
          padding: 6px 18px;
          color: #eee;
          margin-right: 0px;
          border-radius: 5px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        button:nth-of-type(n + 2) {
          margin-left: 10px;
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
      .send-sms-code-wrap {
        position: relative;
        input {
          width: calc(100% - 20px - 6rem - 0.4rem);
        }
        .send-sms-code-btn {
          width: 6rem;
          line-height: 2rem;
          text-align: center;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto 0;
          background: #3a3a3a;
          color: #ffffff;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
