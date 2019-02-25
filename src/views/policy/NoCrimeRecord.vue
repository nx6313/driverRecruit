<template>
    <!-- 无犯罪记录证明 -->
    <div class="noCrimeRecord" v-if="userInfo">
        <div class="policyContentWrap">
            <p>本人 <u> {{userInfo.personName}} </u>，{{$comfun.formatDate(currentDate, 'yyyy')}} 年 {{$comfun.formatDate(currentDate, 'MM')}} 月 {{$comfun.formatDate(currentDate, 'dd')}} 日自愿加入山西大昌网约车服务有限公司，本人承诺所提交的无犯罪记录证明属实，如此证明为虚假或伪造证明，由此造成不能继续从事此项工作的，一切后果由本人承担。</p>
        </div>
        <div :class="['cardWrap', 'noCrimeRecordWrap', noCrimeRecordBase64 == null ? 'normalCardWrap' : '']">
            <input type="file" class="fileInput" title="请选择无犯罪记录证明照片" accept="image/*" @change="selectFile($event, 'no_crime_record')">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/no_crime.png')">
            <span v-if="noCrimeRecordBase64 != null" class="imgPreview hasBorder" :style="noCrimeRecordBase64 != null ? { 'background-image': `url(${noCrimeRecordBase64})` } : {}"></span>
        </div>
        <span class="uploadTip">上传犯罪记录证明</span>
        <router-link to="/policy/noCrimeRecordDec" class="uploadTipLink" tag="span">如何申请 “ 无犯罪记录证明 ”</router-link>
        <span class="readFinish" @click="readFinish" v-if="canReadFinishTime < 0">阅读完毕</span>
        <span class="readFinish readFinishTimeDown" v-if="canReadFinishTime >= 0">{{`（ ${canReadFinishTime} 秒 ） 阅读完毕`}}</span>
    </div>
</template>

<script>
export default {
    name: 'noCrimeRecord',
    data() {
        return {
            canReadFinishTime: 60, // 可以点击阅读完毕的倒计时
            userInfo: null,
            noCrimeRecord: null,
            noCrimeRecordBase64: null
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
        selectFile: function(event, type) {
            if (type == 'no_crime_record') {
                this.noCrimeRecord = event.target.files[0]
                this.imgPreview(this.noCrimeRecord, type)
            }
        },
        imgPreview: function(file, type) {
            if (!window.FileReader) return false
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (event) => {
                if (type == 'no_crime_record') {
                    this.uploadCardFile(this.noCrimeRecord, (path) => {
                        this.noCrimeRecordBase64 = event.target.result
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'noCrimeRecord',
                            value: path
                        })
                    }, () => {
                        this.noCrimeRecord = null
                        this.noCrimeRecordBase64 = null
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
            if (this.noCrimeRecord == null) {
                this.$comfun.showToast(this, '请先上传无犯罪记录证明图片文件')
                return false
            }
            this.$comfun.showLoading(this, 'applyRuleRead', false)
            this.$comfun.http_post(this, this.$api.applyRuleRead, {
                type: 'crime',
                'crime.path': this.$store.state.driverRecruitData.policyDataInfo.noCrimeRecord
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

<style scoped>
body, html {
  background: rgb(233, 167, 167) !important;
}
</style>

<style lang="less" scoped>
.noCrimeRecord {
    text-align: center;
}

.policyContentWrap {
    position: relative;
    padding: 1rem 1rem 0.7rem;
    text-indent: 2em;
    font-size: 0.9rem;
    line-height: 1.8rem;
    color: #33374b;
    text-align: left;
}

.cardWrap {
    width: 13rem;
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
    background-image: url('./../../assets/icon_upload_camera.png');
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
    pointer-events: none;
}

.noCrimeRecordWrap {
    margin-top: 0.8rem;
}

.uploadTip {
    display: block;
    text-align: center;
    font-size: 0.92rem;
    margin-top: 0.2rem;
}

.uploadTipLink {
    position: relative;
    display: inline-block;
    text-align: center;
    font-size: 0.6rem;
    margin-top: 3rem;
    margin-bottom: 3.6rem;
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
