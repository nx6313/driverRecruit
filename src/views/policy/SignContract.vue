<template>
    <!-- 专职司机文件签约单 -->
    <div class="signContract" v-if="userInfo">
        <div class="policyContentWrap">
            <p>本人 <u> {{userInfo.personName}} </u>，{{$comfun.formatDate(currentDate, 'yyyy')}} 年 {{$comfun.formatDate(currentDate, 'MM')}} 月 {{$comfun.formatDate(currentDate, 'dd')}} 日阅读并签阅了公司《专职司机管理制度》、《司机证件征信声明》、《无犯罪记录声明》、《驾驶人员安全承诺书》、《入职登记表》、《专职司机薪酬保密承诺书》、《与原单位解除劳动关系证明》、《申报网约车驾驶员资格证承诺书》、《与原单位解除劳动关系证明》；我承诺将严格遵守上述文件中的各项规定，如有违反，愿意承担相应处罚以及相关责任。</p>
        </div>
        <span class="toSignBtn" @click="toSign">
            <span class="tip">{{signImgData == null ? '点这里签名' : ''}}</span>
            <img v-if="signImgData != null" v-lazy="signImgData">
            <span class="signDateTime">日期：{{$comfun.formatDate(currentDate, 'yyyy/MM/dd hh:mm:ss')}}</span>
        </span>
        <span class="readFinish" @click="readFinish" v-if="canReadFinishTime < 0">签字完毕确认</span>
        <span class="readFinish readFinishTimeDown" v-if="canReadFinishTime >= 0">{{`（ ${canReadFinishTime} 秒 ） 签字完毕确认`}}</span>
    </div>
</template>

<script>
export default {
    name: 'signContract',
    data() {
        return {
            canReadFinishTime: 60, // 可以点击签字完毕确认的倒计时
            userInfo: null,
            signImgData: null
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
        toSign: function() {
            let allIsRead = true
            for (let policyIndex in this.$store.state.driverRecruitData.policyList) {
                if (policyIndex < this.$store.state.driverRecruitData.policyList.length - 1 && !this.$store.state.driverRecruitData.policyList[policyIndex].read) {
                    allIsRead = false
                    break
                }
            }
            if (!allIsRead) {
                this.$comfun.showToast(this, '请您先阅读其他的所有政策声明')
                return false
            }
            this.$comfun.showSignPanel(this, (base64, imgFile) => {
                this.signImgData = base64
                this.uploadCardFile(imgFile, (path) => {
                    this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                        key: 'signContract',
                        value: path
                    })
                }, () => {
                    this.signImgData = null
                })
            })
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
            if (this.$store.state.driverRecruitData.policyDataInfo.signContract == null) {
                this.$comfun.showToast(this, '请您先阅读签约单并签名')
                return false
            }
            this.$comfun.showLoading(this, 'applyRuleRead', false)
            this.$comfun.http_post(this, this.$api.applyRuleRead, {
                type: 'signature',
                'signature.path': this.$store.state.driverRecruitData.policyDataInfo.signContract
            }).then((request) => {
                this.$comfun.hideLoading('applyRuleRead')
                if (request.data.status == 'OK') {
                    this.$store.commit('setDriverRecruitData_PolicyListUpdateReadStatus', {
                        index: this.$store.state.driverRecruitData.policyList.map(v => { return v.id }).indexOf(this.$route.query.policyId),
                        key: 'read',
                        value: true
                    })
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
}
.toSignBtn {
    position: relative;
    display: block;
    width: 8rem;
    height: 4rem;
    line-height: 4rem;
    background: #f0eed7;
    text-align: center;
    font-size: 1.8rem;
    color: #999999;
    white-space: nowrap;
    margin: 5rem 2rem 3rem;
    float: right;
    padding-bottom: 1rem;
    padding-left: 1.4rem;
    padding-right: 1.4rem;
    img {
        position: absolute;
        width: 4rem;
        height: 8rem;
        top: -2rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        transform: rotate(-90deg);
        transform-origin: center center;
    }
    .tip {
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
    .signDateTime {
        display: block;
        position: absolute;
        left: -4rem;
        right: -4rem;
        bottom: -1.4rem;
        font-size: 0.7rem;
        color: #838383;
    }
}
.toSignBtn::after {
    content: '';
    position: absolute;
    left: -0.4rem;
    right: -0.4rem;
    bottom: 1.4rem;
    height: 1px;
    background: #aaaaaa;
    pointer-events: none;
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
