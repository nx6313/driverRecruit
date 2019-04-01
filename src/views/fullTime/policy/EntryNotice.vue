<template>
    <!-- 入职须知 -->
    <div class="entryNotice" v-if="userInfo">
        <div class="policyContentWrap">
            <p>本人 <u> {{userInfo.personName}} </u>，{{$comfun.formatDate(currentDate, 'yyyy')}} 年 {{$comfun.formatDate(currentDate, 'MM')}} 月 {{$comfun.formatDate(currentDate, 'dd')}} 日自愿加入山西大昌网约车服务有限公司，本人承诺积极配合公司经办人员办理相关入职手续，并于 5 个工作日之内完成以下手续办理及材料提交，如果超过时限，将视为我自动放弃在贵公司的工作机会。</p>
        </div>
        <div class="line doTitle">请上传以下文件</div>
        <template v-for="(doItem, doIndex) in doItems">
            <div v-bind:key="`title-${doIndex}`" :class="['line', 'doItemWrap', doItem.isUnfold ? 'isUnfold' : '', doItem.isOk ? 'isOk' : '']" @click="unfoldDoItem(doItem)">{{doItem.title}}<span class="min" v-if="doItem.minTitle">（{{doItem.minTitle}}）</span><i :class="['arrows', doItem.isUnfold ? 'isUnfoldArrows' : '']"></i></div>
            <div v-bind:key="`unfold-${doIndex}`" :class="['line', 'doItemUnfoldWrap', doItem.isUnfold ? 'isUnfoldContent' : '']" v-if="doItem.isUnfold">
                <template v-if="doIndex === 0">
                    <div :class="['cardWrap', 'userPhotoWrap', userPhotoBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择红底正装照片" accept="image/*" @change="selectFile($event, 'user_photo', doItem)">
                        <img class="cardDisplay showBorder" v-lazy="require('@/assets/user_photo.png')">
                        <span v-if="userPhotoBase64 != null" class="imgPreview hasBorder" :style="userPhotoBase64 != null ? { 'background-image': `url(${userPhotoBase64})` } : {}"></span>
                    </div>
                </template>
                <template v-if="doIndex === 1">
                    <div :class="['cardWrap', 'salaryCardWrap', salaryCardBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择建行工资卡" accept="image/*" @change="selectFile($event, 'salary_card', doItem)">
                        <img class="cardDisplay showBorder" v-lazy="require('@/assets/salary_card.png')">
                        <span v-if="salaryCardBase64 != null" class="imgPreview hasBorder" :style="salaryCardBase64 != null ? { 'background-image': `url(${salaryCardBase64})` } : {}"></span>
                    </div>
                    <div class="inputWrap">
                        <input class="salaryCardAddress" type="text" placeholder="请输入开户行地址" v-model="salaryCardAddress">
                        <span>开户行地址</span>
                    </div>
                </template>
                <template v-if="doIndex === 2">
                    <div :class="['cardWrap', 'salaryCardWrap', accountCardBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择户口簿个人页" accept="image/*" @change="selectFile($event, 'account_card', doItem)">
                        <img class="cardDisplay showBorder" v-lazy="require('@/assets/user_hk.png')">
                        <span v-if="accountCardBase64 != null" class="imgPreview hasBorder" :style="accountCardBase64 != null ? { 'background-image': `url(${accountCardBase64})` } : {}"></span>
                    </div>
                </template>
                <template v-if="doIndex === 3">
                    <div :class="['cardWrap', 'salaryCardWrap', liverBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择肝功能体检报告" accept="image/*" @change="selectFile($event, 'liver', doItem)">
                        <div class="cardDisplay showBorder h8"></div>
                        <span v-if="liverBase64 != null" class="imgPreview hasBorder" :style="liverBase64 != null ? { 'background-image': `url(${liverBase64})` } : {}"></span>
                    </div>
                </template>
                <template v-if="doIndex === 4">
                    <div :class="['cardWrap', 'salaryCardWrap', heartBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择心电体检报告" accept="image/*" @change="selectFile($event, 'heart', doItem)">
                        <div class="cardDisplay showBorder h8"></div>
                        <span v-if="heartBase64 != null" class="imgPreview hasBorder" :style="heartBase64 != null ? { 'background-image': `url(${heartBase64})` } : {}"></span>
                    </div>
                </template>
                <template v-if="doIndex === 5">
                    <div :class="['cardWrap', 'salaryCardWrap', xLightBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择X光胸透体检报告" accept="image/*" @change="selectFile($event, 'x_light', doItem)">
                        <div class="cardDisplay showBorder h8"></div>
                        <span v-if="xLightBase64 != null" class="imgPreview hasBorder" :style="xLightBase64 != null ? { 'background-image': `url(${xLightBase64})` } : {}"></span>
                    </div>
                </template>
            </div>
        </template>
        <span class="readFinish" @click="readFinish" v-if="canReadFinishTime < 0">上传且阅读完毕</span>
        <span class="readFinish readFinishTimeDown" v-if="canReadFinishTime >= 0">{{`（ ${canReadFinishTime} 秒 ） 上传且阅读完毕`}}</span>
    </div>
</template>

<script>
export default {
    name: 'entryNotice',
    data() {
        return {
            canReadFinishTime: 10, // 可以点击上传且阅读完毕的倒计时
            userInfo: null,
            doItems: [
                {
                    title: '一寸红底正装照片',
                    minTitle: '正装深色领带',
                    isUnfold: false,
                    isOk: false
                },
                {
                    title: '建行工资卡',
                    minTitle: '请填写开户行信息',
                    isUnfold: false,
                    isOk: false
                },
                {
                    title: '户口簿个人页',
                    minTitle: '只上传个人页',
                    isUnfold: false,
                    isOk: false
                },
                {
                    title: '肝功能体检报告',
                    minTitle: '',
                    isUnfold: false,
                    isOk: false
                },
                {
                    title: '心电体检报告',
                    minTitle: '',
                    isUnfold: false,
                    isOk: false
                },
                {
                    title: 'X光胸透体检报告',
                    minTitle: '',
                    isUnfold: false,
                    isOk: false
                }
            ],
            // 证件照
            userPhoto: null,
            userPhotoBase64: null,
            // 工资卡
            salaryCard: null,
            salaryCardBase64: null,
            salaryCardAddress: '',
            // 户口簿
            accountCard: null,
            accountCardBase64: null,
            // 肝功
            liver: null,
            liverBase64: null,
            // 心电
            heart: null,
            heartBase64: null,
            // x光
            xLight: null,
            xLightBase64: null
        }
    },
    computed: {
        currentDate: function() {
            return new Date()
        }
    },
    mounted() {
        this.userInfo = this.$store.state.driverRecruitData.auditState
        this.userPhotoBase64 = this.$store.state.driverRecruitData.policyDataInfo.userPhoto
        this.salaryCardBase64 = this.$store.state.driverRecruitData.policyDataInfo.salaryCard
        this.salaryCardAddress = this.$store.state.driverRecruitData.policyDataInfo.salaryCardAddress || ''
        this.accountCardBase64 = this.$store.state.driverRecruitData.policyDataInfo.accountCard
        this.liverBase64 = this.$store.state.driverRecruitData.policyDataInfo.liver
        this.heartBase64 = this.$store.state.driverRecruitData.policyDataInfo.heart
        this.xLightBase64 = this.$store.state.driverRecruitData.policyDataInfo.xLight
        if (this.userPhotoBase64 !== null) {
            this.doItems[0].isOk = true
        }
        if (this.salaryCardBase64 !== null && this.salaryCardAddress !== '') {
            this.doItems[1].isOk = true
        }
        if (this.accountCardBase64 !== null) {
            this.doItems[2].isOk = true
        }
        if (this.liverBase64 !== null) {
            this.doItems[3].isOk = true
        }
        if (this.heartBase64 !== null) {
            this.doItems[4].isOk = true
        }
        if (this.xLightBase64 !== null) {
            this.doItems[5].isOk = true
        }
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
        unfoldDoItem: function(doItem) {
            // 先关闭所有展开
            if (!doItem.isUnfold) {
                for (let doIndex in this.doItems) {
                    this.doItems[doIndex].isUnfold = false
                }
            }
            // 打开或关闭本条目
            doItem.isUnfold = !doItem.isUnfold
        },
        selectFile: function(event, type, doItem) {
            if (type == 'user_photo') {
                this.userPhoto = event.target.files[0]
                this.imgPreview(this.userPhoto, type, doItem)
            } else if (type == 'salary_card') {
                this.salaryCard = event.target.files[0]
                this.imgPreview(this.salaryCard, type, doItem)
            } else if (type == 'account_card') {
                this.accountCard = event.target.files[0]
                this.imgPreview(this.accountCard, type, doItem)
            } else if (type == 'liver') {
                this.liver = event.target.files[0]
                this.imgPreview(this.liver, type, doItem)
            } else if (type == 'heart') {
                this.heart = event.target.files[0]
                this.imgPreview(this.heart, type, doItem)
            } else if (type == 'x_light') {
                this.xLight = event.target.files[0]
                this.imgPreview(this.xLight, type, doItem)
            }
        },
        imgPreview: function(file, type, doItem) {
            if (!file || !window.FileReader) return false
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (event) => {
                if (type == 'user_photo') {
                    this.uploadCardFile(this.userPhoto, (path) => {
                        this.userPhotoBase64 = event.target.result
                        doItem.isOk = true
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'userPhoto',
                            value: path
                        })
                    }, () => {
                        this.userPhoto = null
                        this.userPhotoBase64 = null
                    })
                } else if (type == 'salary_card') {
                    this.uploadCardFile(this.salaryCard, (path) => {
                        this.salaryCardBase64 = event.target.result
                        if (this.salaryCardAddress.trim() != '') {
                            doItem.isOk = true
                        }
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'salaryCard',
                            value: path
                        })
                    }, () => {
                        this.salaryCard = null
                        this.salaryCardBase64 = null
                    })
                } else if (type == 'account_card') {
                    this.uploadCardFile(this.accountCard, (path) => {
                        this.accountCardBase64 = event.target.result
                        doItem.isOk = true
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'accountCard',
                            value: path
                        })
                    }, () => {
                        this.accountCard = null
                        this.accountCardBase64 = null
                    })
                } else if (type == 'liver') {
                    this.uploadCardFile(this.liver, (path) => {
                        this.liverBase64 = event.target.result
                        doItem.isOk = true
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'liver',
                            value: path
                        })
                    }, () => {
                        this.liver = null
                        this.liverBase64 = null
                    })
                } else if (type == 'heart') {
                    this.uploadCardFile(this.heart, (path) => {
                        this.heartBase64 = event.target.result
                        doItem.isOk = true
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'heart',
                            value: path
                        })
                    }, () => {
                        this.heart = null
                        this.heartBase64 = null
                    })
                } else if (type == 'x_light') {
                    this.uploadCardFile(this.xLight, (path) => {
                        this.xLightBase64 = event.target.result
                        doItem.isOk = true
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'xLight',
                            value: path
                        })
                    }, () => {
                        this.xLight = null
                        this.xLightBase64 = null
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
        readFinish: function() {
            if (this.userPhoto == null || this.salaryCard == null || this.salaryCardAddress == '' || this.accountCard == null || this.liver == null || this.heart == null || this.xLight == null) {
                this.$comfun.showToast(this, '请先上传所有需要的文件内容')
                return false
            }
            this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                key: 'salaryCardAddress',
                value: this.salaryCardAddress
            })
            this.$comfun.showLoading(this, 'applyRuleRead', false)
            this.$comfun.http_post(this, this.$api.applyRuleRead, {
                phone: this.$store.state.userBaseInfo.phone,
                d_type: this.$store.state.userBaseInfo.dType,
                type: 'induction',
                'induction.photo': this.$store.state.driverRecruitData.policyDataInfo.userPhoto,
                'induction.bankcar': this.$store.state.driverRecruitData.policyDataInfo.salaryCard,
                'induction.bankaddress': this.$store.state.driverRecruitData.policyDataInfo.salaryCardAddress,
                'induction.residence': this.$store.state.driverRecruitData.policyDataInfo.accountCard,
                'induction.liver': this.$store.state.driverRecruitData.policyDataInfo.liver,
                'induction.ecg': this.$store.state.driverRecruitData.policyDataInfo.heart,
                'induction.xray': this.$store.state.driverRecruitData.policyDataInfo.xLight
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
    },
    watch: {
        salaryCardAddress: function(val) {
            if (this.salaryCardBase64 != null && val.trim() != '') {
                this.doItems[1].isOk = true
            } else {
                this.doItems[1].isOk = false
            }
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
    background: #f0eed7;
    color: #33374b;
}
.line {
    position: relative;
    background: #ffffff;
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
    color: #33374b;
}
.line:nth-last-of-type(n + 2)::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #f2f2f2;
    transition: all 0.3s ease 0s;
}
.isUnfold:nth-last-of-type(n + 2)::after {
    left: 0.8rem;
    right: 0.8rem;
}
.doTitle {
    padding: 0.8rem 0.9rem;
}
.doItemWrap {
    padding-left: 2.8rem;
    .min {
        font-size: 0.5rem;
    }
    .arrows {
        position: absolute;
        display: inline-block;
        width: 1.4rem;
        height: 1.4rem;
        right: 0.8rem;
        top: 0;
        bottom: 0;
        margin: auto 0;
        background-image: url('./../../../assets/arrows.png');
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center;
        transform: rotate(180deg);
        transition: transform 0.3s ease 0s;
    }
    .isUnfoldArrows {
        transform: rotate(0deg);
    }
}
.doItemWrap::before {
    content: '';
    position: absolute;
    left: 1.2rem;
    top: 0;
    bottom: 0;
    margin: auto 0;
    width: 1rem;
    background-image: url('./../../../assets/icon_policy_file_up.jpg');
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
}
.isOk::before {
    background-image: url('./../../../assets/icon_policy_file_up_success.jpg');
}
.doItemUnfoldWrap {
    .cardWrap {
        position: relative;
        left: 0;
        right: 0;
        margin: 0 auto;
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
    .userPhotoWrap {
        width: 6rem;
    }
    .salaryCardWrap {
        width: 13rem;
    }
    .inputWrap {
        position: relative;
        left: 0;
        right: 0;
        margin: 0 auto;
        .salaryCardAddress {
            display: block;
            width: calc(100% - 0.6rem - 5rem);
            margin-top: 0.4rem;
            border: none;
            padding: 0.4rem 0.6rem 0.4rem 5rem;
            background: #dee7f1;
            border-radius: 4px;
            color: rgb(48, 48, 48);
            font-size: 0.8rem;
        }
        span {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0.34rem;
            font-size: 0.8rem;
            line-height: 1.9rem;
            font-weight: bold;
        }
        span::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: -0.3rem;
            width: 1px;
            background: #c9d2dd;
        }
    }
    .inputWrap input {
        position: relative;
        top: 0;
        bottom: 0;
        padding-left: 4rem;
    }
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
