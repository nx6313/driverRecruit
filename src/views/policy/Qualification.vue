<template>
    <!-- 申报网约车驾驶员资格证承诺书 -->
    <div class="qualification" v-if="userInfo">
        <div class="policyContentWrap">
            <p>本人 <u> {{userInfo.personName}} </u>，身份证号码 <u> {{userInfo.idcarNo}} </u>，于 {{$comfun.formatDate(currentDate, 'yyyy')}} 年 {{$comfun.formatDate(currentDate, 'MM')}} 月 {{$comfun.formatDate(currentDate, 'dd')}} 日自愿加入山西大昌网约车服务有限公司。</p>
            <p>1、本人承诺积极配合公司所提供的个人各种证件及复印件真实有效，包括:身份证（包括临时身份证及暂住证）、户口簿、驾驶证、体检表、照片等，由于本人隐瞒实情，或伪造证件，造成的后果，一切责任由本人承担，与大昌网约车服务有限公司无任何关系。</p>
            <p>2、本人承诺积极配合公司办理申报网约车驾驶员资格证，如因个人原因（没有取得太原市居住证或取得居住证不足一年的）不能申报的，造成不能继续从事此项工作的，一切后果由本人承担。</p>
            <p>3、本人承诺驾驶证无酒驾、毒驾记录，近三个计分周期内无扣满12分记录；如驾驶证存在失信情况，造成不能办理网络预约出租车资格证，导致本人离职的，一切后果由本人承担。</p>
            <p>4、本人承诺所提交的无犯罪记录证明属实，如果证明为虚假或伪造证明，由此造成不能继续从事此项工作的，一切后果由本人承担。</p>
        </div>
        <span class="readFinish" @click="readFinish" v-if="canReadFinishTime < 0">阅读完毕</span>
        <span class="readFinish readFinishTimeDown" v-if="canReadFinishTime >= 0">{{`（ ${canReadFinishTime} 秒 ） 阅读完毕`}}</span>
    </div>
</template>

<script>
export default {
    name: 'qualification',
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
                type: 'qualification'
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
