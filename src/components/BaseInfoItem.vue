<template>
  <div class="baseInfoItem">
    <div class="itemTitleWrap">
      <img class="itemTitleIcon" :src="titleIcon">
      <span class="itemTitleContent">{{title}}</span>
    </div>
    <template v-if="inputs.length == 0">
      <div class="itemQuestionSelectWrap">
        <span class="questionContent">{{question}}</span>
        <div class="answersWrap">
          <span v-for="(answer, index) in answers" v-bind:key="index" @click="selectThisAnswer(index, answer)" :class="['answerItem', thisAnswerSelected(index, answer) ? 'current-selected' : '']">{{answer}}</span>
        </div>
      </div>
      <input type="text" :placeholder="otherAnswerHint" v-model="otherAnswer" :class="['otherAnswer', otherAnswer != null ? 'other-answer-selected' : '']" @click="writeOtherAnswer(true)" @blur="writeOtherAnswer(false)">
    </template>
    <template v-if="inputs.length > 0">
      <div v-for="(input, index) in inputs" v-bind:key="index" :class="['formInputItem', `input-item-${index}`]">
        <span class="inputLabel">{{input.label}}</span>
        <input class="textInput" v-if="input.type == 'text'" type="text" :placeholder="input.hint" v-model="input.model">
        <VueGroup v-model="input.model" class="btnSelect" v-if="input.type == 'select'">
          <VueGroupButton v-for="(select, selectIndex) in input.range" v-bind:key="selectIndex" class="selectBtnItem round" :value="select.name">{{select.value}}</VueGroupButton>
        </VueGroup>
        <VueSwitch class="radioSwitch" v-if="input.type == 'radio'" v-model="input.model"></VueSwitch>
        <div class="sendSmsCodeWrap" v-if="input.type == 'sendSmsCode'">
          <input class="textInput" type="text" :placeholder="input.hint" v-model="input.model">
          <VueButton :class="['sendBtn', canUseSendSmsCodeBtn(input.model)]" @click="sendSmsCode(input.model, input)">{{hasSendSmsCode ? `${sendSmsCodeTime}秒后重新发送` : '发送验证码'}}</VueButton>
        </div>
        <div class="smsCodeTextWrap" v-if="input.type == 'smsCodeText'">
          <input class="textInput" type="text" v-model="input.model" :maxlength="input.codeCount" v-focus="[codeBox, index]" v-on:input="codeBoxInput(input.model, index)" v-on:blur="codeBoxBlur(index)">
          <span :class="['codeCell', currentInputCodeBox >= 0 && currentInputCodeBox == codeIndex ? 'isInput' : '']" v-for="(code, codeIndex) in input.codeCount" v-bind:key="codeIndex" :style="{ left: `${5 + codeIndex * 2.4}rem` }" @click="focusToInputCode(index, codeIndex, input.model)">{{codeBoxGet(index, codeIndex)}}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'

export default {
  name: 'BaseInfoItem',
  props: {
    titleIcon: {
      default: require('@/assets/logo.png')
    },
    title: {
      default: '基础信息标题'
    },
    question: {
      default: '基础信息提示问题'
    },
    answers: {
      default() {
        return []
      }
    },
    otherAnswerHint: {
      default: '其他'
    },
    isMultiple: {
      default: false
    },
    inputs: {
      /**
       * label、model、hint、type(text、radio、select、sendSmsCode、smsCodeText)、range(对于select)、send(对于sendSmsCode)、callBack(对于sendSmsCode)、codeCount(对于smsCodeText)
       */
      default() {
        return []
      }
    }
  },
  data () {
    return {
      selectAnswer: null,
      otherAnswer: null,
      hasSendSmsCode: false,
      sendSmsCodeTime: 60, // 可以再次发送短信验证码的倒计时
      currentInputCodeBox: -1,
      codeBox: new Map()
    }
  },
  created() {
    for (let inputIndex in this.inputs) {
      if (this.inputs[inputIndex].type == 'smsCodeText') {
        this.codeBox.set(inputIndex, {
          focus: false,
          inputInfo: this.inputs[inputIndex],
          codeBoxArray: new Array(this.inputs[inputIndex].codeCount)
        })
      }
    }
  },
  directives: {
    focus: {
      inserted: (el, binding) => {
        if (binding.value[0].get(String(binding.value[1])).focus) el.focus()
      },
      update: (el, binding) => {
        if (binding.value[0].get(String(binding.value[1])).focus) el.focus()
      }
    }
  },
  methods: {
    selectThisAnswer: function(index, answer) {
      this.otherAnswer = null
      let thisSelected = { index: index, answer: answer }
      if (this.isMultiple) {
        if (this.selectAnswer == null) this.selectAnswer = []
        let hasThis = false
        let hasInIndex = -1
        for (let selectedIndex in this.selectAnswer) {
          if (this.selectAnswer[selectedIndex].index == index && this.selectAnswer[selectedIndex].answer == answer) {
            hasThis = true
            hasInIndex = selectedIndex
            break
          }
        }
        if (hasThis) {
          this.selectAnswer.splice(hasInIndex, 1)
        } else {
          this.selectAnswer.push(thisSelected)
        }
      } else {
        this.selectAnswer = thisSelected
      }
    },
    thisAnswerSelected: function(index, answer) {
      if (this.isMultiple) {
        return this.selectAnswer!= null && (() => {
          let hasThis = false
          for (let selectedIndex in this.selectAnswer) {
            if (this.selectAnswer[selectedIndex].index == index && this.selectAnswer[selectedIndex].answer == answer) {
              hasThis = true
              break
            }
          }
          return hasThis
        }).apply()
      } else {
        return this.selectAnswer!= null && this.selectAnswer.index == index
      }
    },
    writeOtherAnswer: function(focus) {
      if (focus) {
        this.otherAnswer = ''
        this.selectAnswer = null
      } else {
        if (this.otherAnswer == '') this.otherAnswer = null
      }
    },
    canUseSendSmsCodeBtn: function(phone) {
      if (phone && SOME_RULES.phone.test(phone.trim()) && !this.hasSendSmsCode) {
        return 'canUse'
      }
      return 'cantUse'
    },
    sendSmsCode: function(phone, input) {
      if (this.canUseSendSmsCodeBtn(phone) == 'canUse') {
        this.$comfun.showLoading(this, 'sendSmsCodeForDriverRecruitBaseInfo', false)
        input.send(phone).then((request) => {
          this.$comfun.hideLoading('sendSmsCodeForDriverRecruitBaseInfo')
          input.callBack(request)
        })
        this.hasSendSmsCode = true
        let lockTime = setInterval(() => {
          this.sendSmsCodeTime--
          if (this.sendSmsCodeTime <= 0) {
            this.hasSendSmsCode = false
            this.sendSmsCodeTime = 60
            clearInterval(lockTime)
          }
        }, 1000)
      }
    },
    codeBoxGet: function(keyIndex, codeIndex) {
      return this.codeBox.get(String(keyIndex)).codeBoxArray[codeIndex]
    },
    focusToInputCode: function(keyIndex, codeIndex, currentValue) {
      this.currentInputCodeBox = currentValue.length > this.codeBox.get(String(keyIndex)).inputInfo.codeCount - 1 ? this.codeBox.get(String(keyIndex)).inputInfo.codeCount - 1 : currentValue.length
      this.codeBox.get(String(keyIndex)).focus = true
    },
    codeBoxInput: function(value, keyIndex) {
      let inputInfo = this.codeBox.get(String(keyIndex)).inputInfo
      this.codeBox.get(String(keyIndex)).codeBoxArray = new Array(this.codeBox.get(String(keyIndex)).codeCount)
      for (let i = 0; i < value.length; i++) {
        this.codeBox.get(String(keyIndex)).codeBoxArray[i] = value.split("")[i]
      }
      this.currentInputCodeBox = value.length > inputInfo.codeCount - 1 ? inputInfo.codeCount - 1 : value.length
    },
    codeBoxBlur: function(keyIndex) {
      this.codeBox.get(String(keyIndex)).focus = false
      this.currentInputCodeBox = -1
    },
    getResult: function() {
      if (this.isMultiple) {
        return (this.selectAnswer != null && this.selectAnswer.length > 0 ? this.selectAnswer : null) || this.otherAnswer
      }
      return this.selectAnswer || this.otherAnswer
    }
  }
}
</script>

<style lang="less" scoped>
.baseInfoItem {
  padding-bottom: 1.2rem;
  background: #ffffff;
}
.itemTitleWrap {
  position: relative;
  background: #F5F5F5;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  .itemTitleIcon {
    width: 1.3rem;
    height: 1.3rem;
    vertical-align: middle;
  }
  .itemTitleContent {
    vertical-align: middle;
    display: inline-block;
    margin-left: 0.5rem;
    font-size: 1rem;
    color: #33374b;
  }
}
.itemQuestionSelectWrap {
  position: relative;
  .questionContent {
    display: block;
    font-size: 0.9rem;
    color: #33374b;
    padding: 0.8rem 0.7rem;
  }
  .answersWrap {
    display: inline-flex;
    display: -webkit-inline-flex; /* Safari */
    flex-wrap: wrap;
    padding: 0 0.8rem;
    margin-top: -0.8rem;
    .answerItem {
      position: relative;
      padding: 0.3rem 0.8rem;
      background: #e1e2ec;
      color: #33374b;
      border: 1px solid #e1e2ec;
      font-size: 0.9rem;
      border-radius: 10rem;
      margin-top: 0.8rem;
      margin-right: 0.6rem;
    }
    .current-selected {
      border: 1px solid #db3a09;
      background: #ffffff;
    }
  }
}
.otherAnswer {
  width: calc(100% - 1.6rem - 1.6rem);
  margin: 0 0.8rem;
  padding: 0.4rem 0.8rem;
  background: #e1e2ec;
  border-radius: 10rem;
  outline: none;
  color: #33374b;
  margin-top: 0.8rem;
  font-size: 0.9rem;
  border: 1px solid #e1e2ec;
}
.other-answer-selected {
  border: 1px solid #db3a09;
  background: #ffffff;
}
.formInputItem {
  position: relative;
  height: 3.2rem;
  .inputLabel {
    position: absolute;
    display: inline-block;
    font-size: 0.94rem;
    left: 1rem;
    height: 1.2rem;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .textInput {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 5rem;
    display: block;
    width: calc(100% - 5rem - 00.6rem - 0.6rem);
    border: none;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    font-size: 0.9rem;
    outline: none;
  }
  .btnSelect {
    position: absolute;
    left: 5rem;
    top: 0;
    bottom: 0;
    height: 1.5rem;
    margin: auto;
    .selectBtnItem {
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 0.8rem;
      font-weight: bold;
    }
  }
  .radioSwitch {
    position: absolute;
    left: 5rem;
    top: 0;
    bottom: 0;
    height: 1.2rem;
    margin: auto;
  }
  .sendSmsCodeWrap {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    .sendBtn {
      position: absolute;
      height: 1.7rem;
      padding: 0 0.5rem;
      background: #0eaf7a;
      color: #fff;
      top: 0;
      bottom: 0;
      right: 1rem;
      margin: auto;
      font-size: 0.8rem;
    }
    .cantUse {
      background: #adadad;
    }
  }
  .smsCodeTextWrap {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .textInput {
      color: transparent;
      top: 100%;
      padding: 0;
    }
    .codeCell {
      position: absolute;
      display: inline-block;
      width: 1.8rem;
      height: 1.8rem;
      line-height: 1.8rem;
      background: #ffffff;
      color: #33374b;
      border: 1px solid #2c2c2c;
      border-radius: 3px;
      text-align: center;
      top: 0;
      bottom: 0;
      left: 5rem;
      margin: auto;
      font-size: 0.8rem;
      box-shadow: 0 0 1px #c9c9c9;
    }
    .isInput {
      font-weight: bold;
      animation: codeBoxInput 0.6s infinite alternate;
    }
    .isInput::after {
      content: '';
      display: block;
      position: absolute;
      left: 0.4rem;
      right: 0.4rem;
      bottom: 0.32rem;
      height: 1px;
      background: #2c2c2c;
      animation: codeBoxInputAfter 0.6s infinite alternate;
    }
  }
}
.formInputItem::after {
  content: '';
  position: absolute;
  display: block;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #f5f5f5;
}
.formInputItem:nth-last-of-type(1)::after {
  content: '';
  height: 0;
}

@keyframes codeBoxInput {
  0% { background: #4dafc0; color: #073535; }
  100% { background: #ffffff; color: #33374b; }
}
@keyframes codeBoxInputAfter {
  0% { background: #2c2c2c; }
  100% { background: #ffffff; }
}
</style>
