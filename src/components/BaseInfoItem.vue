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
      </div>
    </template>
  </div>
</template>

<script>
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
       * label、model、hint、type(text、radio、select、range、sendSmsCode、smsCodeText)
       */
      default() {
        return []
      }
    }
  },
  data () {
    return {
      selectAnswer: null,
      otherAnswer: null
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
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
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
</style>
