<template>
    <!-- 无兼职工作申明 -->
    <div class="noPartTimeJob" v-if="userInfo">
        <div class="policyContentWrap">
            <p>本人 <u> {{userInfo.personName}} </u>，{{$comfun.formatDate(currentDate, 'yyyy')}} 年 {{$comfun.formatDate(currentDate, 'MM')}} 月 {{$comfun.formatDate(currentDate, 'dd')}} 日自愿加入山西大昌网约车服务有限公司，本人承诺所提交的无犯罪记录证明属实，如此证明为虚假或伪造证明，由此造成不能继续从事此项工作的，一切后果由本人承担。</p>
        </div>
        <span class="readFinish" @click="readFinish" v-if="canReadFinishTime < 0">阅读完毕</span>
        <span class="readFinish readFinishTimeDown" v-if="canReadFinishTime >= 0">{{`（ ${canReadFinishTime} 秒 ） 阅读完毕`}}</span>
    </div>
</template>

<script>
export default {
    name: 'noPartTimeJob',
    data() {
        return {
            canReadFinishTime: 60, // 可以点击阅读完毕的倒计时
            userInfo: null
        }
    },
    computed: {
        currentDate: function() {
            return new Date()
        }
    },
    mounted() {
        this.userInfo = this.$store.state.driverRecruitData.auditState
    },
    created() {
        let lockTime = setInterval(() => {
          this.canReadFinishTime--
          if (this.canReadFinishTime <= 0) {
            this.canReadFinishTime = -1
            clearInterval(lockTime)
          }
        }, 1000)
    },
    methods: {
        readFinish: function() {
            this.$comfun.showLoading(this, 'applyRuleRead', false)
            this.$comfun.http_post(this, 'api/member/applyRuleRead', {
                type: 'porttime'
            }).then((request) => {
                this.$comfun.hideLoading('applyRuleRead')
                if (request.data.status == 'OK') {
                    this.$router.back()
                } else {
                    this.$comfun.showToast(this, request.data.msg)
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.policyContentWrap {
    position: relative;
    padding: 1rem 1rem 0.7rem;
    text-indent: 2em;
    font-size: 0.9rem;
    line-height: 1.8rem;
    color: #33374b;
    text-align: left;
}

.readFinish {
  position: relative;
  display: block;
  width: calc(100% - 2.4rem);
  background: #2b2b2b;
  color: #ffffff;
  text-align: center;
  left: 1.2rem;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  margin-top: 1.8rem;
  font-size: 0.8rem;
  border-radius: 2px;
  box-shadow: 0px 0px 2px #4e4e4ea6;
  margin-bottom: 2.2rem;
}

.readFinishTimeDown {
    background: #969696;
}
</style>
