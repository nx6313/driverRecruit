<template>
    <!-- 无兼职工作申明 -->
    <div class="noPartTimeJob" v-if="userInfo">
        <div class="policyContentWrap">
            <p>本人 <u> {{userInfo.personName}} </u>，身份证号码 <u> {{userInfo.idcarNo}} </u>，承诺在大昌网约车公司就职同时没有和其他任何单位签定有劳动关系或从事任何形式的兼职工作，如有事实隐瞒，愿意接受大昌网约车公司追究违约责任，扣除10000元车辆押金。</p>
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
            canReadFinishTime: -1, // 可以点击阅读完毕的倒计时
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
            this.$comfun.http_post(this, this.$api.applyRuleRead, {
                phone: this.$store.state.userBaseInfo.phone,
                d_type: this.$store.state.userBaseInfo.dType,
                type: 'porttime'
            }).then((request) => {
                this.$comfun.hideLoading('applyRuleRead')
                if (request.data.status == 'OK') {
                    // this.$router.replace('/fullTime/policyRuleList')
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
  background: #33374b;
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
