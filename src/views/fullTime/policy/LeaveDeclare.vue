<template>
    <!-- 提交《离职证明》申明 -->
    <div class="leaveDeclare" v-if="userInfo">
        <template v-if="hasLeaveDeclare">
            <div class="policyContentWrap">
                <p>本人 <u> {{userInfo.personName}} </u>，身份证号码 <u> {{userInfo.idcarNo}} </u>，确认已于 <span :class="leaveYear ? 'notEmpty' : 'empty'" v-html="leaveYear ? leaveYear : ''" @click="selectPicker('year')"></span> 年 <span :class="leaveMonth ? 'notEmpty' : 'empty'" v-html="leaveMonth ? leaveMonth : ''" @click="selectPicker('month')"></span> 月 <span :class="leaveDay ? 'notEmpty' : 'empty'" v-html="leaveDay ? leaveDay : ''" @click="selectPicker('day')"></span> 日与之前原单位 <span :class="leaveCompany ? 'notEmpty' : 'empty'" v-html="leaveCompany ? leaveCompany : ''" @click="toInput('company')"></span>公司 解除 / 终止劳动关系，且无任何经济纠纷。</p>
                <span class="statement">特此声明！</span>
            </div>
            <div :class="['cardWrap', 'leaveDeclareWrap', leaveDeclareBase64 == null ? 'normalCardWrap' : '']">
                <input type="file" class="fileInput" title="请选择《离职证明》申明照片" accept="image/*" @change="selectFile($event, 'leave_declare')">
                <img class="cardDisplay showBorder" v-lazy="require('@/assets/leave_prove.png')">
                <span v-if="leaveDeclareBase64 != null" class="imgPreview hasBorder" :style="leaveDeclareBase64 != null ? { 'background-image': `url(${leaveDeclareBase64})` } : {}"></span>
            </div>
            <span class="uploadTip">上传《离职证明》申明</span>
            <div class="uploadTipLinkWrap">
                <span class="uploadTipLink" @click="changeHasLeaveDeclare(false)">无法提交《离职证明》申明？</span>
            </div>
        </template>
        <template v-if="!hasLeaveDeclare">
            <div class="policyContentWrap">
                <p>本人 <u> {{userInfo.personName}} </u>，身份证号码 <u> {{userInfo.idcarNo}} </u>，确认已于 <span :class="leaveYear ? 'notEmpty' : 'empty'" v-html="leaveYear ? leaveYear : ''" @click="selectPicker('year')"></span> 年 <span :class="leaveMonth ? 'notEmpty' : 'empty'" v-html="leaveMonth ? leaveMonth : ''" @click="selectPicker('month')"></span> 月 <span :class="leaveDay ? 'notEmpty' : 'empty'" v-html="leaveDay ? leaveDay : ''" @click="selectPicker('day')"></span> 日与之前原单位 <span :class="leaveCompany ? 'notEmpty' : 'empty'" v-html="leaveCompany ? leaveCompany : ''" @click="toInput('company')"></span>公司 解除 / 终止劳动关系，且无任何经济纠纷，由于 <span :class="leaveReason ? 'notEmpty' : 'empty'" v-html="leaveReason ? leaveReason : ''" @click="toInput('reason')"></span> 原因，无法提交《离职证明》，今后如因此出现任何问题，本人自行负责，与贵公司无任何权利义务之争。</p>
                <span class="statement">特此声明！</span>
            </div>
            <span class="tipInfo">如果您从未有过其他工作，以上信息请忽略，直接点击 “ 阅读完毕 ” 即可。</span>
            <div class="uploadTipLinkWrap cantLeaveDeclareTipLink">
                <span class="uploadTipLink" @click="changeHasLeaveDeclare(true)">可以提交《离职证明》申明？</span>
            </div>
        </template>
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
            leaveDeclare: null,
            leaveDeclareBase64: null,
            hasLeaveDeclare: true
        }
    },
    mounted() {
        this.userInfo = this.$store.state.driverRecruitData.auditState
        this.leaveDeclareBase64 = this.$store.state.driverRecruitData.policyDataInfo.leaveDeclare
        this.leaveYear = this.$store.state.driverRecruitData.policyDataInfo.leaveYear
        this.leaveMonth = this.$store.state.driverRecruitData.policyDataInfo.leaveMonth
        this.leaveDay = this.$store.state.driverRecruitData.policyDataInfo.leaveDay
        this.leaveCompany = this.$store.state.driverRecruitData.policyDataInfo.leaveCompany
        this.leaveReason = this.$store.state.driverRecruitData.policyDataInfo.leaveReason
        this.hasLeaveDeclare = this.$store.state.driverRecruitData.policyDataInfo.hasLeaveDeclare === null ? true : this.$store.state.driverRecruitData.policyDataInfo.hasLeaveDeclare
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
        selectFile: function(event, type) {
            if (type == 'leave_declare') {
                this.leaveDeclare = event.target.files[0]
                this.imgPreview(this.leaveDeclare, type)
            }
        },
        imgPreview: function(file, type) {
            if (!file || !window.FileReader) return false
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (event) => {
                if (type == 'leave_declare') {
                    this.uploadCardFile(this.leaveDeclare, (path) => {
                        this.leaveDeclareBase64 = event.target.result
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'leaveDeclare',
                            value: path
                        })
                    }, () => {
                        this.leaveDeclare = null
                        this.leaveDeclareBase64 = null
                    })
                }
            }
        },
        uploadCardFile: function(file, callBack, errorCallBack) {
            this.$comfun.showLoading(this, 'uploadCardFile', false)
            this.$comfun.http_file(this, this.$api.file, file).then((request) => {
                this.$comfun.hideLoading('uploadCardFile')
                if (request.data.status == 'OK') {
                    callBack(request.data.data.path)
                } else {
                    this.$comfun.showToast(this, request.data.msg || '发生了未知的错误')
                    errorCallBack()
                }
            }, error => {
                errorCallBack()
            })
        },
        selectPicker: function(type) {
            if (type == 'year') {
                let yearPickerData = []
                for (let y = 1990; y <= parseInt(this.$comfun.formatDate(new Date(), 'yyyy')); y++) {
                    yearPickerData.push(y)
                }
                this.$comfun.showPicker('离职日期 - 年', [yearPickerData], (result) => {
                    this.leaveMonth = null
                    this.leaveDay = null
                    this.leaveYear = result[0].value
                })
            } else if (type == 'month') {
                if (this.leaveYear == null) {
                    this.selectPicker('year')
                    return false
                }
                this.$comfun.showPicker('离职日期 - 月', [['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']], (result) => {
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
                this.$comfun.showPicker('离职日期 - 日', [dayPickerData], (result) => {
                    this.leaveDay = result[0].value
                })
            }
        },
        toInput: function(type) {
            if (type == 'company') {
                this.$comfun.showDialogWithPrompt(this, '请输入您的原单位名称', undefined, true, '输入原单位名称', undefined, undefined, undefined, (leaveCompany) => {
                    this.leaveCompany = leaveCompany
                }, undefined, true)
            } else if (type == 'reason') {
                this.$comfun.showDialogWithPrompt(this, '请输入您在原单位无法离职原因', undefined, true, '输入原单位无法离职原因', undefined, undefined, undefined, (leaveReason) => {
                    this.leaveReason = leaveReason
                }, undefined, true)
            }
        },
        readFinish: function() {
            if (this.hasLeaveDeclare && (this.leaveYear == null || this.leaveMonth == null || this.leaveDay == null || this.leaveCompany == null)) {
                this.$comfun.showToast(this, '请先填写离职证明信息')
                return false
            }
            this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                key: 'leaveYear',
                value: this.leaveYear
            })
            this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                key: 'leaveMonth',
                value: this.leaveMonth
            })
            this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                key: 'leaveDay',
                value: this.leaveDay
            })
            this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                key: 'leaveCompany',
                value: this.leaveCompany
            })
            this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                key: 'leaveReason',
                value: this.leaveReason
            })
            this.$comfun.showLoading(this, 'applyRuleRead', false)
            this.$comfun.http_post(this, this.$api.applyRuleRead, {
                phone: this.$store.state.userBaseInfo.phone,
                d_type: this.$store.state.userBaseInfo.dType,
                type: 'departure',
                'departure.leave_declare': this.$store.state.driverRecruitData.policyDataInfo.leaveDeclare,
                'departure.leave_year': this.leaveYear,
                'departure.leave_month': this.leaveMonth,
                'departure.leave_date': this.leaveDay,
                'departure.company': this.leaveCompany,
                'departure.reason': this.leaveReason
            }).then((request) => {
                this.$comfun.hideLoading('applyRuleRead')
                if (request.data.status == 'OK') {
                    // this.$router.replace('/fullTime/policyRuleList')
                    this.$router.back()
                } else {
                    this.$comfun.showToast(this, request.data.msg)
                }
            })
        },
        changeHasLeaveDeclare(val) {
            this.hasLeaveDeclare = val
            this.leaveDeclare = null
            this.leaveDeclareBase64 = null
            this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                key: 'leaveDeclare',
                value: null
            })
            this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                key: 'hasLeaveDeclare',
                value: val
            })
        }
    }
}
</script>

<style lang="less" scoped>
.leaveDeclare {
    position: relative;
}

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

.tipInfo {
    position: relative;
    display: block;
    padding: 1rem 1rem 0.7rem;
    margin-top: 6rem;
    font-size: 0.8rem;
    padding-left: 3rem;
    color: #969696;
}
.tipInfo::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: 0.6rem;
    width: 2rem;
    height: 1.6rem;
    display: block;
    background-image: url('./../../../assets/icon_d_info.png');
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: center;
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

.cardWrap {
    width: 13rem;
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
    clear: both;
    .fileInput {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
    }
    .cardDisplay {
        position: relative;
        width: 100%;
        pointer-events: none;
    }
    .showBorder {
        border: 1px dashed #c6c6c6;
        padding: 0.2rem;
        width: calc(100% - 0.4rem - 2px);
    }
    .imgPreview {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-color: #ffffff;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
    .hasBorder {
        width: calc(100% - 0.4rem + 2px);
        height: calc(100% - 0.4rem - 2px - 1px);
        top: calc(1px + 0.1rem);
        left: calc(1px + 0.1rem);
        border-radius: 2px;
    }
}

.normalCardWrap::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 2.8rem;
    background-image: url('./../../../assets/icon_upload_camera.png');
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
    pointer-events: none;
}

.leaveDeclareWrap {
    margin-top: 0.8rem;
}

.uploadTip {
    display: block;
    text-align: center;
    font-size: 0.92rem;
    margin-top: 0.2rem;
}

.uploadTipLinkWrap {
    text-align: center;
    margin-top: 4rem;
    margin-bottom: 3rem;
}

.cantLeaveDeclareTipLink {
    margin-top: 1rem;
}

.uploadTipLink {
    position: relative;
    display: inline-block;
    text-align: center;
    font-size: 0.8rem;
    color: #0078ff;
}

.uploadTipLink::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: #0078ff;
}
</style>
