<template>
    <!-- 入职须知 -->
    <div class="entryNotice" v-if="userInfo">
        <div class="policyContentWrap">
            <p>本人 <u> {{userInfo.personName}} </u>，{{$comfun.formatDate(new Date(), 'yyyy')}} 年 {{$comfun.formatDate(new Date(), 'MM')}} 月 {{$comfun.formatDate(new Date(), 'dd')}} 日自愿加入山西大昌网约车服务有限公司，本人承诺积极配合公司经办人员办理相关入职手续，并于 5 个工作日之内完成以下手续办理及材料提交，如果超过时限，将视为我自动放弃在贵公司的工作机会。</p>
        </div>
        <div class="line doTitle">请上传以下文件</div>
        <template v-for="(doItem, doIndex) in doItems">
            <div v-bind:key="`title-${doIndex}`" :class="['line', 'doItemWrap', doItem.isUnfold ? 'isUnfold' : '', doItem.isOk ? 'isOk' : '']" @click="unfoldDoItem(doItem)">{{doItem.title}}<span class="min" v-if="doItem.minTitle">（{{doItem.minTitle}}）</span><i :class="['arrows', doItem.isUnfold ? 'isUnfoldArrows' : '']"></i></div>
            <div v-bind:key="`unfold-${doIndex}`" :class="['line', 'doItemUnfoldWrap', doItem.isUnfold ? 'isUnfoldContent' : '']" v-if="doItem.isUnfold">
                <template v-if="doIndex === 0">
                    <div :class="['cardWrap', 'userPhotoWrap', userPhotoBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择红底正装照片" accept="image/*" @change="selectFile($event, 'user_photo', doItem)">
                        <img class="cardDisplay showBorder" :src="require('@/assets/salary_card.png')">
                        <span v-if="userPhotoBase64 != null" class="imgPreview hasBorder" :style="userPhotoBase64 != null ? { 'background-image': `url(${userPhotoBase64})` } : {}"></span>
                    </div>
                </template>
                <template v-if="doIndex === 1">
                    <div :class="['cardWrap', 'salaryCardWrap', salaryCardBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择建行工资卡" accept="image/*" @change="selectFile($event, 'salary_card', doItem)">
                        <img class="cardDisplay showBorder" :src="require('@/assets/salary_card.png')">
                        <span v-if="salaryCardBase64 != null" class="imgPreview hasBorder" :style="salaryCardBase64 != null ? { 'background-image': `url(${salaryCardBase64})` } : {}"></span>
                    </div>
                </template>
                <template v-if="doIndex === 2">
                    <div :class="['cardWrap', 'salaryCardWrap', salaryCardBase64 == null ? 'normalCardWrap' : '']">
                        <input type="file" class="fileInput" title="请选择户口簿个人页" accept="image/*" @change="selectFile($event, 'salary_card', doItem)">
                        <img class="cardDisplay showBorder" :src="require('@/assets/salary_card.png')">
                        <span v-if="salaryCardBase64 != null" class="imgPreview hasBorder" :style="salaryCardBase64 != null ? { 'background-image': `url(${salaryCardBase64})` } : {}"></span>
                    </div>
                </template>
                <template v-if="doIndex === 3">0</template>
                <template v-if="doIndex === 4">0</template>
                <template v-if="doIndex === 5">0</template>
                <template v-if="doIndex === 6">6</template>
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
            canReadFinishTime: 60, // 可以点击上传且阅读完毕的倒计时
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
                },
                {
                    title: '其他',
                    minTitle: '',
                    isUnfold: false,
                    isOk: false
                }
            ],
            salaryCard: null,
            salaryCardBase64: null,
            userPhoto: null,
            userPhotoBase64: null
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
            if (type == 'salary_card') {
                this.salaryCard = event.target.files[0]
                this.imgPreview(this.salaryCard, type, doItem)
            }
        },
        imgPreview: function(file, type, doItem) {
            if (!window.FileReader) return false
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (event) => {
                if (type == 'salary_card') {
                    this.salaryCardBase64 = event.target.result
                    this.uploadCardFile(this.salaryCard, (path) => {
                        doItem.isOk = true
                        this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                            key: 'salaryCard',
                            value: path
                        })
                    })
                }
            }
        },
        uploadCardFile: function(file, callBack) {
            this.$comfun.showLoading(this, 'uploadCardFile', false)
            this.$comfun.http_file(this, 'file', file).then((request) => {
                this.$comfun.hideLoading('uploadCardFile')
                if (request.data.status == 'OK') {
                    callBack(request.data.data.path)
                } else {
                    this.$comfun.showToast(this, request.data.msg || '发生了未知的错误')
                }
            })
        },
        readFinish: function() {
            this.$comfun.showLoading(this, 'applyRule', false)
            this.$comfun.http_post(this, 'api/member/applyRule', {
                'rule.induction': 1
            }).then((request) => {
                this.$comfun.hideLoading('applyRule')
                if (request.data.status == 'OK') {
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
    background: #f9f8f1;
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
        background-image: url('./../../assets/arrows.png');
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
    background-image: url('./../../assets/icon_policy_file_up.jpg');
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
}
.isOk::before {
    background-image: url('./../../assets/icon_policy_file_up_success.jpg');
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
        background-image: url('./../../assets/icon_upload_camera.png');
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center;
        pointer-events: none;
    }
    .userPhotoWrap {
        width: 8rem;
    }
    .salaryCardWrap {
        width: 13rem;
    }
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
