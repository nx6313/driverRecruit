<template>
    <!-- 无法提交《离职证明》申明 -->
    <div class="leaveDeclare" v-if="userInfo">
        <div class="policyContentWrap">
            <p>本人 <u> {{userInfo.personName}} </u>，身份证号码 <u> {{userInfo.idcarNo}} </u>，确认已于 <span :class="leaveYear ? 'notEmpty' : 'empty'" v-html="leaveYear ? leaveYear : ''" @click="selectPicker('year')"></span> 年 <span :class="leaveMonth ? 'notEmpty' : 'empty'" v-html="leaveMonth ? leaveMonth : ''" @click="selectPicker('month')"></span> 月 <span :class="leaveDay ? 'notEmpty' : 'empty'" v-html="leaveDay ? leaveDay : ''" @click="selectPicker('day')"></span> 日与之前原单位 <span :class="leaveCompany ? 'notEmpty' : 'empty'" v-html="leaveCompany ? leaveCompany : ''" @click="toInput('company')"></span>公司 解除 / 终止劳动关系，且无任何经济纠纷，由于 <span :class="leaveReason ? 'notEmpty' : 'empty'" v-html="leaveReason ? leaveReason : ''" @click="toInput('reason')"></span> 原因，无法提交《离职证明》，今后如因此出现任何问题，本人自行负责，与贵公司无任何权利义务之争。</p>
            <span class="statement">特此声明！</span>
        </div>
        <span class="readFinish" @click="readFinish" v-if="canReadFinishTime < 0">阅读完毕</span>
        <span class="readFinish readFinishTimeDown" v-if="canReadFinishTime >= 0">{{`（ ${canReadFinishTime} 秒 ） 阅读完毕`}}</span>
    </div>
</template>

<script>
export default {
    name: 'leaveDeclare',
    data() {
        return {
            canReadFinishTime: 10, // 可以点击阅读完毕的倒计时
            userInfo: null,
            leaveYear: null,
            leaveMonth: null,
            leaveDay: null,
            leaveCompany: null,
            leaveReason: null,
            currentPicker: null,
            currentPromptDialog: null
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
    beforeRouteLeave(to, from, next) {
        // if (this.currentPicker && this.currentPicker.cancelled !== true) this.currentPicker.destory()
        if (this.currentPromptDialog) this.currentPromptDialog.destory()
        next()
    },
    methods: {
        selectPicker: function(type) {
            if (type == 'year') {
                let yearPickerData = []
                for (let y = 1990; y <= parseInt(this.$comfun.formatDate(new Date(), 'yyyy')); y++) {
                    yearPickerData.push(y)
                }
                this.currentPicker = this.$comfun.showPicker('离职日期 - 年', [yearPickerData], (result) => {
                    this.leaveMonth = null
                    this.leaveDay = null
                    this.leaveYear = result[0].value
                })
            } else if (type == 'month') {
                if (this.leaveYear == null) {
                    this.selectPicker('year')
                    return false
                }
                this.currentPicker = this.$comfun.showPicker('离职日期 - 月', [['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']], (result) => {
                    this.leaveDay = null
                    this.leaveMonth = result[0].value
                })
            } else if (type == 'day') {
                if (this.leaveYear == null) {
                    this.selectPicker('year')
                    return false
                }
                if (this.leaveMonth == null) {
                    this.selectPicker('month')
                    return false
                }
                let dayPickerData = []
                for (let d = 1; d <= parseInt(this.$comfun.formatDate(this.$comfun.getLastDay(this.leaveYear, this.leaveMonth), 'dd')); d++) {
                    dayPickerData.push(d)
                }
                this.currentPicker = this.$comfun.showPicker('离职日期 - 日', [dayPickerData], (result) => {
                    this.leaveDay = result[0].value
                })
            }
        },
        toInput: function(type) {
            if (type == 'company') {
                this.currentPromptDialog = this.$comfun.showDialogWithPrompt(this, '请输入您的原单位名称', undefined, true, '输入原单位名称', undefined, undefined, undefined, (leaveCompany) => {
                    this.leaveCompany = leaveCompany
                }, undefined, true)
            } else if (type == 'reason') {
                this.currentPromptDialog = this.$comfun.showDialogWithPrompt(this, '请输入您在原单位无法离职原因', undefined, true, '输入原单位无法离职原因', undefined, undefined, undefined, (leaveReason) => {
                    this.leaveReason = leaveReason
                }, undefined, true)
            }
        },
        readFinish: function() {
            // if (this.leaveYear == null || this.leaveMonth == null || this.leaveDay == null || this.leaveCompany == null || this.leaveReason == null) {
            //     this.$comfun.showToast(this, '请先填写无法离职信息')
            //     return false
            // }
            this.$comfun.showLoading(this, 'applyRuleRead', false)
            this.$comfun.http_post(this, this.$api.applyRuleRead, {
                type: 'departure',
                'departure.leave_year': this.leaveYear,
                'departure.leave_month': this.leaveMonth,
                'departure.leave_date': this.leaveDay,
                'departure.company': this.leaveCompany,
                'departure.reason': this.leaveReason
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
    .notEmpty {
        position: relative;
        display: inline-block;
        padding: 0 0.6rem;
        text-indent: 0;
        color: #0d2fc5;
    }
    .empty {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 1rem;
    }
    .notEmpty::after, .empty::after {
        content: '';
        position: absolute;
        left: -2px;
        right: -2px;
        bottom: -4px;
        height: 1px;
        background: #33374b;
    }
    .notEmpty::after {
        bottom: 4px;
    }
    .statement {
        float: right;
        margin-bottom: 3rem;
    }
}

.readFinish {
  clear: both;
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
