<template>
  <div class="baseInfoItem" :style="inputs.length == 0 ? { paddingBottom: '1.2rem' } : {}">
    <div class="itemTitleWrap">
      <img class="itemTitleIcon" v-lazy="titleIcon">
      <span class="itemTitleContent">{{title}}</span>
    </div>
    <div class="itemMinTitleWrap" v-if="minTitle">
      <span class="itemMinTitleContent">{{minTitle}}</span>
    </div>
    <template v-if="inputs.length == 0">
      <div class="itemQuestionSelectWrap">
        <span class="questionContent">{{question}}</span>
        <div class="answersWrap">
          <template v-for="(answer, index) in answers">
            <span v-bind:key="index" v-if="!/^\S+(\[\S+\]){1}$/.test(answer) && !/^(TIP>\S+){1}$/.test(answer)" @click="selectThisAnswer(index, answer)" :class="['answerItem', thisAnswerSelected(index, answer) ? 'current-selected' : '']">{{answer}}</span>
            <span v-bind:key="index" v-if="/^(TIP>\S+){1}$/.test(answer)" class="answerTipItem">{{answer.substr(4, answer.length)}}</span>
          </template>
        </div>
      </div>
      <div v-for="(answer, index) in answers" v-bind:key="index" :class="['otherInputWrap', hasThis(answer.match(/(\[\S+\]){1}$/)) ? 'other-answer-selected-for-wrap' : '']" :data-beforeContent="answer | filterAnswer">
        <input type="text" v-if="/^\S+(\[\S+\]){1}$/.test(answer)" :placeholder="answer | filterAnswer" :placeholderData="answer | filterAnswer" :class="['otherAnswer', hasThis(answer.match(/(\[\S+\]){1}$/)) ? 'other-answer-selected' : '']" :ref="`input_${answer.match(/(\[\S+\]){1}$/)[0].substr(1).substr(0, answer.match(/(\[\S+\]){1}$/)[0].length - 2)}`" @click="writeFilterAnswer(index, answer.match(/(\[\S+\]){1}$/), true, `input_${answer.match(/(\[\S+\]){1}$/)[0].substr(1).substr(0, answer.match(/(\[\S+\]){1}$/)[0].length - 2)}`)" @blur="writeFilterAnswer(index, answer.match(/(\[\S+\]){1}$/), false, `input_${answer.match(/(\[\S+\]){1}$/)[0].substr(1).substr(0, answer.match(/(\[\S+\]){1}$/)[0].length - 2)}`)">
      </div>
      <div :class="['otherInputWrap', (otherAnswer != null && otherAnswer != '') ? 'other-answer-selected-for-wrap' : '']" :data-beforeContent="otherAnswerHint">
        <input type="text" :placeholder="otherAnswerHint" v-model="otherAnswer" :class="['otherAnswer', otherAnswer != null ? 'other-answer-selected' : '']" @click="writeOtherAnswer(true)" @blur="writeOtherAnswer(false)">
      </div>
    </template>
    <template v-if="inputs.length > 0">
      <div v-for="(input, index) in inputs" v-bind:key="index" :class="['formInputItem', `input-item-${index}`, input.type == 'textarea' ? 'formInputItemIsTextArea' : '']">
        <span v-if="input.label" :class="['inputLabel', input.require ? 'thisIsMust' : '']">{{input.label}}</span>
        <input class="textInput" v-if="input.type == 'text'" type="text" :placeholder="input.hint" v-model="input.model" :readonly="input.readOnly === true" :style="input.label === undefined ? { left: '0', width: `calc(100% - 0.6rem - 0.6rem)` } : {}">
        <textarea class="textInput" v-if="input.type == 'textarea'" :placeholder="input.hint" v-model="input.model" :readonly="input.readOnly === true" :style="input.label === undefined ? { left: '0', width: `calc(100% - 0.6rem - 0.6rem)` } : {}"></textarea>
        <FormRadio v-model="input.model" :radios="input.range" v-if="input.type == 'radio'" :style="input.label === undefined ? { left: '1.6rem' } : {}"/>
        <input class="textInput" v-if="input.type == 'picker'" type="text" :placeholder="input.hint" v-model="input.model" :readonly="true" :style="input.label === undefined ? { left: '0', width: `calc(100% - 0.6rem - 0.6rem)` } : {}" @click="showPicker(input.label, input.range, input)">
        <!-- <VueGroup v-model="input.model" class="btnSelect" v-if="input.type == 'select'">
          <VueGroupButton v-for="(select, selectIndex) in input.range" v-bind:key="selectIndex" class="selectBtnItem round" :value="select.name">{{select.value}}</VueGroupButton>
        </VueGroup> -->
        <!-- <VueSwitch class="radioSwitch" v-if="input.type == 'switch'" v-model="input.model"></VueSwitch> -->
        <!-- <div class="sendSmsCodeWrap" v-if="input.type == 'sendSmsCode'">
          <input class="textInput" type="text" :placeholder="input.hint" v-model="input.model">
          <VueButton :class="['sendBtn', canUseSendSmsCodeBtn(input.model)]" @click="sendSmsCode(input.model, input)">{{hasSendSmsCode ? `${sendSmsCodeTime}秒后重新发送` : '发送验证码'}}</VueButton>
        </div> -->
        <div class="smsCodeTextWrap" v-if="input.type == 'smsCodeText'">
          <input class="textInput" type="text" v-model="input.model" :maxlength="input.codeCount" v-focus="[codeBox, index]" v-on:input="codeBoxInput(input.model, index)" v-on:blur="codeBoxBlur(index)">
          <span :class="['codeCell', currentInputCodeBox >= 0 && currentInputCodeBox == codeIndex ? 'isInput' : '']" v-for="(code, codeIndex) in input.codeCount" v-bind:key="codeIndex" :style="{ left: `${5 + codeIndex * 2.4}rem` }" @click="focusToInputCode(index, codeIndex, input.model)">{{codeBoxGet(index, codeIndex)}}</span>
        </div>
      </div>
    </template>
    <p class="slotWrap animated fadeIn" v-if="hasSlot" :style="slotStyle">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'
import FormRadio from '@/components/FormRadio.vue'

export default {
  name: 'BaseInfoItem',
  components: {
    FormRadio
  },
  props: {
    titleIcon: {
      default: require('@/assets/logo.png')
    },
    title: {
      default: '基础信息标题'
    },
    minTitle: {
      default: null
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
    hasSlot: {
      default: false
    },
    slotStyle: {
      default() {
        return {}
      }
    },
    inputs: {
      /**
       * label、model、hint、type(text、textarea、radio、switch、select、picker、sendSmsCode、smsCodeText)、range(对于select)、
       * send(对于sendSmsCode)、callBack(对于sendSmsCode)、codeCount(对于smsCodeText)、readOnly(对于text)、require
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
  filters: {
    filterAnswer: function(value) {
      if (/^\S+(\[\S+\]){1}$/.test(value)) {
        value = value.replace(/(\[\S+\]){1}$/, '')
      }
      return value;
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
      answer = answer.replace(/(\[\S+\]){1}$/, '')
      this.otherAnswer = null
      let thisSelected = { index: index, answer: answer, key: String.fromCharCode(65 + index) }
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
      answer = answer.replace(/(\[\S+\]){1}$/, '')
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
      let filterKeys = this.selectAnswer != null ? this.selectAnswer.map(v => { return v.filterKey }) : []
      this.answers.map(v => {
        if (/^\S+(\[\S+\]){1}$/.test(v)) {
          let ref = v.match(/(\[\S+\]){1}$/)[0].substr(1).substr(0, v.match(/(\[\S+\]){1}$/)[0].length - 2)
          let thisInput = this.$refs['input_' + ref][0]
          thisInput.value = ''
          let hasInIndex = filterKeys.indexOf(ref)
          if (hasInIndex >= 0) {
            this.selectAnswer.splice(hasInIndex, 1)
          }
        }
      })
      if (focus) {
        if (this.otherAnswer === null) this.selectAnswer = null
        // this.otherAnswer = ''
        // this.selectAnswer = null
      } else {
        if (this.otherAnswer == '') {
          this.otherAnswer = null
        }
      }
    },
    hasThis: function(filter) {
      if (filter != null) {
        let filterKeys = this.selectAnswer != null ? this.selectAnswer.map(v => { return v.filterKey }) : []
        return filterKeys.indexOf(filter[0].substr(1).substr(0, filter[0].length - 2)) >= 0
      }
      return false
    },
    writeFilterAnswer: function(index, filter, focus, ref) {
      let thisInput = this.$refs[ref][0]
      this.otherAnswer = null
      let filterKeys = this.selectAnswer != null ? this.selectAnswer.map(v => { return v.filterKey }) : []
      let hasInIndex = filterKeys.indexOf(filter[0].substr(1).substr(0, filter[0].length - 2))
      if (focus) {
        thisInput.placeholder = '请输入'
        if (this.selectAnswer == null) this.selectAnswer = []
        let thisSelected = { index: index, filterKey: filter[0].substr(1).substr(0, filter[0].length - 2), filterValue: '', key: String.fromCharCode(65 + index) }
        if (hasInIndex >= 0) {
          this.selectAnswer.splice(hasInIndex, 1)
        }
        this.selectAnswer.push(thisSelected)
      } else {
        thisInput.placeholder = thisInput.getAttribute('placeholderData')
        if (thisInput.value.trim() === '') {
          let filterKeys = this.selectAnswer != null ? this.selectAnswer.map(v => { return v.filterKey }) : []
          this.selectAnswer.splice(hasInIndex, 1)
          thisInput.value = ''
        }
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
      if (this.selectAnswer != null && this.selectAnswer.length > 0) {
        this.selectAnswer.map(v => {
          if (v.hasOwnProperty('filterKey')) {
            let thisInput = this.$refs['input_' + v['filterKey']][0]
            v['filterValue'] = thisInput.value.trim()
          }
        })
      }
      if (this.isMultiple) {
        return (this.selectAnswer != null && this.selectAnswer.length > 0 ? this.selectAnswer : null) || (this.otherAnswer != null ? { key: String.fromCharCode(65 + this.answers.length), val: this.otherAnswer } : null)
      }
      return this.selectAnswer || (this.otherAnswer != null ? { key: String.fromCharCode(65 + this.answers.length), val: this.otherAnswer } : null)
    },
    showPicker: function(label, range, input) {
      let defaultValue = []
      if (input.model) {
        defaultValue.push(input.model)
      }
      this.$comfun.showPicker('选择' + label, [range], (result) => {
        this.$set(input, 'model', result[0].value)
      }, null, defaultValue)
    }
  }
}
</script>

<style lang="less" scoped>
.baseInfoItem {
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
.itemMinTitleWrap {
  position: relative;
  background: #fff;
  color: #686868;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 2.9rem;
  padding-right: 0.8rem;
  font-size: 0.7rem;
}
.itemMinTitleWrap::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  left: 0.6rem;
  width: 2rem;
  height: 1.6rem;
  display: block;
  background-image: url('./../assets/icon_d_info.png');
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: center;
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
    .answerTipItem {
      position: relative;
      background: #fff;
      color: #686868;
      padding-top: 0.4rem;
      padding-bottom: 0.4rem;
      padding-left: 2.2rem;
      padding-right: 0.8rem;
      font-size: 0.7rem;
      margin-bottom: -0.8rem;
      margin-top: 0.4rem;
    }
    .answerTipItem::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      left: 0.1rem;
      width: 2rem;
      height: 1.6rem;
      display: block;
      background-image: url('./../assets/icon_d_info.png');
      background-repeat: no-repeat;
      background-size: auto 100%;
      background-position: center;
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
  .thisIsMust::after {
    content: '';
    display: block;
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    background-image: url('./../assets/input_require.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50%;
    left: -0.55rem;
    top: 0;
    bottom: 0;
    margin: auto 0;
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
  height: 0;
}
.formInputItemIsTextArea {
  height: 10rem;
  .inputLabel {
    position: absolute;
    display: inline-block;
    font-size: 0.94rem;
    left: 1rem;
    height: 1.2rem;
    top: 1rem;
    bottom: 0;
    margin: 0;
  }
  .thisIsMust::after {
    content: '';
    display: block;
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    background-image: url('./../assets/input_require.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50%;
    left: -0.55rem;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }
  .textInput {
    position: absolute;
    top: 2.4rem;
    bottom: 0;
    left: 0.4rem;
    display: block;
    width: calc(100% - 0.8rem - 00.6rem - 0.6rem);
    border: none;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    font-size: 0.9rem;
    outline: none;
    resize: none;
    margin-bottom: 0.8rem;
  }
}

@keyframes codeBoxInput {
  0% { background: #4dafc0; color: #073535; }
  100% { background: #ffffff; color: #33374b; }
}
@keyframes codeBoxInputAfter {
  0% { background: #2c2c2c; }
  100% { background: #ffffff; }
}

.otherInputWrap {
  position: relative;
}
.other-answer-selected-for-wrap::before {
  content: attr(data-beforeContent);
  background-color: #bb5151;
  position: absolute;
  top: 0.24rem;
  left: 1.8rem;
  font-size: 0.6rem;
  color: #ffffff;
  padding: 0 0.4rem;
  border-radius: 4px;
  animation: inputAnim 240ms linear forwards;
}

@keyframes inputAnim {
  from {
    opacity: 0;
    transform: translate(-10px, 0);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

.slotWrap {
  position: relative;
  padding: 0;
  margin: 0;
}
</style>
