<template>
  <div class="baseInfoItem">
    <div class="itemTitleWrap">
      <img class="itemTitleIcon" src="http://pic.xoyo.com/bbs/2010/11/30/10113010300bdf68f9f96b70e4.jpg">
      <span class="itemTitleContent">{{title}}</span>
    </div>
    <div class="itemQuestionSelectWrap">
      <span class="questionContent">{{question}}</span>
      <div class="answersWrap">
        <span v-for="(answer, index) in answers" v-bind:key="index" class="answerItem">{{answer}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInfoItem',
  props: {
    title: {
      default: '基础信息标题'
    },
    question: {
      default: '基础信息提示问题'
    },
    answers: {
      default: []
    }
  }
}
</script>

<style lang="less" scoped>
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
    font-size: 0.8rem;
    color: #33374b;
  }
}
.itemQuestionSelectWrap {
  position: relative;
  .questionContent {
    display: block;
    font-size: 0.7rem;
    color: #33374b;
    padding: 0.8rem 0.7rem;
  }
  .answersWrap {
    display: inline-flex;
    display: -webkit-inline-flex; /* Safari */
    flex-wrap: wrap;
    padding: 0 0.8rem;
    .answerItem {
      position: relative;
      padding: 0.3rem 0.8rem;
      background: #e1e2ec;
      color: #33374b;
      font-size: 0.8rem;
      border-radius: 100px;
    }
  }
}
</style>
