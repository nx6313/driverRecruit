<template>
  <div class="cardInfo">
    <div class="cardItemWrap">
      <span>请拍摄实体身份证并上传</span>
      <div class="cardWrap">
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input v-if="showFileSelectInput" type="file" class="fileInput" title="请选择身份证正面照" accept="image/*" @change="selectFile($event, 'id_card_a')">
            <img class="cardDisplay" v-lazy="require('@/assets/id_card_a.jpg')">
            <span v-if="idCardABase64 != null" class="imgPreview" :style="idCardABase64 != null ? { 'background-image': `url(${idCardABase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传身份证正面</span>
        </div>
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input v-if="showFileSelectInput" type="file" class="fileInput" title="请选择身份证国徽面照" accept="image/*" @change="selectFile($event, 'id_card_b')">
            <img class="cardDisplay" v-lazy="require('@/assets/id_card_b.jpg')">
            <span v-if="idCardBBase64 != null" class="imgPreview" :style="idCardBBase64 != null ? { 'background-image': `url(${idCardBBase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传身份证国徽面</span>
        </div>
      </div>
    </div>
    <div class="cardItemWrap">
      <span>请拍摄驾驶证并上传</span>
      <div class="cardWrap">
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input v-if="showFileSelectInput" type="file" class="fileInput" title="请选择驾驶证正面照" accept="image/*" @change="selectFile($event, 'drive_card_a')">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/drive_card_a.jpg')">
            <span v-if="driveCardABase64 != null" class="imgPreview hasBorder" :style="driveCardABase64 != null ? { 'background-image': `url(${driveCardABase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传驾驶证正面照</span>
        </div>
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input v-if="showFileSelectInput" type="file" class="fileInput" title="请选择驾驶证副页照" accept="image/*" @change="selectFile($event, 'drive_card_b')">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/drive_card_b.jpg')">
            <span v-if="driveCardBBase64 != null" class="imgPreview hasBorder" :style="driveCardBBase64 != null ? { 'background-image': `url(${driveCardBBase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传驾驶证副页</span>
        </div>
      </div>
    </div>
    <div class="cardItemWrap">
      <span>请拍摄行驶证并上传</span>
      <div class="cardWrap">
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input v-if="showFileSelectInput" type="file" class="fileInput" title="请选择行驶证正面照" accept="image/*" @change="selectFile($event, 'run_card_a')">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/run_card_a.jpg')">
            <span v-if="runCardABase64 != null" class="imgPreview hasBorder" :style="runCardABase64 != null ? { 'background-image': `url(${runCardABase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传行驶证正面照</span>
        </div>
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input v-if="showFileSelectInput" type="file" class="fileInput" title="请选择行驶证副页照" accept="image/*" @change="selectFile($event, 'run_card_b')">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/run_card_b.jpg')">
            <span v-if="runCardBBase64 != null" class="imgPreview hasBorder" :style="runCardBBase64 != null ? { 'background-image': `url(${runCardBBase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传行驶证副页</span>
        </div>
      </div>
    </div>
    <div class="cardItemWrap">
      <span>请拍摄人车合影照片并上传</span>
      <div class="cardWrap">
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input v-if="showFileSelectInput" type="file" class="fileInput" title="请选择人车合影照片" accept="image/*" @change="selectFile($event, 'people_car_photo')">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/people_car_photo.jpg')">
            <span v-if="peopleCarPhotoBase64 != null" class="imgPreview hasBorder" :style="peopleCarPhotoBase64 != null ? { 'background-image': `url(${peopleCarPhotoBase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传人车合影照片</span>
        </div>
        <div class="cardOneWrap">
          <div class="fileWrap" @click="() => { showPeopleCarPhotoDisplay = true }">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/people_car_photo.png')">
          </div>
          <span class="cardTitle">人车合影示范照片</span>
        </div>
      </div>
    </div>
    <div class="cardTipWrap">
      <div class="cardTip">
        <img v-lazy="require('@/assets/card_ok.jpg')">
        <span>标准拍摄</span>
      </div>
      <div class="cardTip">
        <img v-lazy="require('@/assets/card_error_1.jpg')">
        <span>边框缺失</span>
      </div>
      <div class="cardTip">
        <img v-lazy="require('@/assets/card_error_2.jpg')">
        <span>照片模糊</span>
      </div>
      <div class="cardTip">
        <img v-lazy="require('@/assets/card_error_3.jpg')">
        <span>闪光强烈</span>
      </div>
    </div>
    <span class="toSubmitStep" @click="toSubmit">加入去赚钱</span>
    <Modal :showButton="false" :showCloseIcon="true" :top="16" :show="showPeopleCarPhotoDisplay" @close="() => { showPeopleCarPhotoDisplay = false }">
      <template slot="header">
        <div class="peopleCarPhotoImg"></div>
      </template>
      <template slot="body">
        <div class="contentWrap">
          <div class="title">人车合影示范照片</div>
          <p>1.照片清晰（完整的看到司机全身、车辆全身、车牌清晰无遮挡）。</p>
          <p>2.背景单一（无过多车辆或行人，无广告牌、无色彩缤纷的背景）。</p>
          <p>3.司机位于车头右侧且与车辆有重合。</p>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/plugins/dialogBox/modal.vue'

export default {
  name: 'haveCarBaseInfo2',
  components: {
    'Modal': Modal
  },
  data() {
    return {
      showFileSelectInput: true,
      showPeopleCarPhotoDisplay: false,
      idCardA: null,
      idCardB: null,
      driveCardA: null,
      driveCardB: null,
      runCardA: null,
      runCardB: null,
      peopleCarPhoto: null,
      idCardABase64: null,
      idCardBBase64: null,
      driveCardABase64: null,
      driveCardBBase64: null,
      runCardABase64: null,
      runCardBBase64: null,
      peopleCarPhotoBase64: null
    }
  },
  created() {
    // this.$store.dispatch('clearDriverRecruitData_CardInfo')
    this.idCardABase64 = this.$store.state.driverRecruitData.cardInfo.idCardA
    this.idCardBBase64 = this.$store.state.driverRecruitData.cardInfo.idCardB
    this.driveCardABase64 = this.$store.state.driverRecruitData.cardInfo.driveCardA
    this.driveCardBBase64 = this.$store.state.driverRecruitData.cardInfo.driveCardB
    this.runCardABase64 = this.$store.state.driverRecruitData.cardInfo.runCardA
    this.runCardBBase64 = this.$store.state.driverRecruitData.cardInfo.runCardB
    this.peopleCarPhotoBase64 = this.$store.state.driverRecruitData.cardInfo.peopleCarPhoto
  },
  methods: {
    selectFile: function(event, type) {
      if (type == 'id_card_a') {
        this.idCardA = event.target.files[0]
        this.imgPreview(this.idCardA, type)
      } else if (type == 'id_card_b') {
        this.idCardB = event.target.files[0]
        this.imgPreview(this.idCardB, type)
      } else if (type == 'drive_card_a') {
        this.driveCardA = event.target.files[0]
        this.imgPreview(this.driveCardA, type)
      } else if (type == 'drive_card_b') {
        this.driveCardB = event.target.files[0]
        this.imgPreview(this.driveCardB, type)
      } else if (type == 'run_card_a') {
        this.runCardA = event.target.files[0]
        this.imgPreview(this.runCardA, type)
      } else if (type == 'run_card_b') {
        this.runCardB = event.target.files[0]
        this.imgPreview(this.runCardB, type)
      } else if (type == 'people_car_photo') {
        this.peopleCarPhoto = event.target.files[0]
        this.imgPreview(this.peopleCarPhoto, type)
      }
      this.showFileSelectInput = false
      setTimeout(() => {
        this.showFileSelectInput = true
      }, 100)
    },
    imgPreview: function(file, type) {
      if (!file || !window.FileReader) return false
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = (event) => {
        if (type == 'id_card_a') {
          this.$comfun.cardImgDetection(this, this.idCardA, () => {
            this.uploadCardFile(this.idCardA, (path) => {
              this.idCardABase64 = event.target.result
              this.$store.commit('setDriverRecruitData_CardInfoByKey', {
                key: 'idCardA',
                value: path
              })
            }, () => {
              this.idCardA = null
              this.idCardABase64 = null
            })
          }, type)
        } else if (type == 'id_card_b') {
          this.$comfun.cardImgDetection(this, this.idCardB, () => {
            this.uploadCardFile(this.idCardB, (path) => {
              this.idCardBBase64 = event.target.result
              this.$store.commit('setDriverRecruitData_CardInfoByKey', {
                key: 'idCardB',
                value: path
              })
            }, () => {
              this.idCardB = null
              this.idCardBBase64 = null
            })
          }, type)
        } else if (type == 'drive_card_a') {
          this.$comfun.cardImgDetection(this, this.driveCardA, () => {
            this.uploadCardFile(this.driveCardA, (path) => {
              this.driveCardABase64 = event.target.result
              this.$store.commit('setDriverRecruitData_CardInfoByKey', {
                key: 'driveCardA',
                value: path
              })
            }, () => {
              this.driveCardA = null
              this.driveCardABase64 = null
            })
          }, type)
        } else if (type == 'drive_card_b') {
          this.$comfun.cardImgDetection(this, this.driveCardB, () => {
            this.uploadCardFile(this.driveCardB, (path) => {
              this.driveCardBBase64 = event.target.result
              this.$store.commit('setDriverRecruitData_CardInfoByKey', {
                key: 'driveCardB',
                value: path
              })
            }, () => {
              this.driveCardB = null
              this.driveCardBBase64 = null
            })
          }, type)
        } else if (type == 'run_card_a') {
          this.$comfun.cardImgDetection(this, this.runCardA, () => {
            this.uploadCardFile(this.runCardA, (path) => {
              this.runCardABase64 = event.target.result
              this.$store.commit('setDriverRecruitData_CardInfoByKey', {
                key: 'runCardA',
                value: path
              })
            }, () => {
              this.runCardA = null
              this.runCardABase64 = null
            })
          }, type)
        } else if (type == 'run_card_b') {
          this.$comfun.cardImgDetection(this, this.runCardB, () => {
            this.uploadCardFile(this.runCardB, (path) => {
              this.runCardBBase64 = event.target.result
              this.$store.commit('setDriverRecruitData_CardInfoByKey', {
                key: 'runCardB',
                value: path
              })
            }, () => {
              this.runCardB = null
              this.runCardBBase64 = null
            })
          }, type)
        } else if (type == 'people_car_photo') {
          this.uploadCardFile(this.peopleCarPhoto, (path) => {
            this.peopleCarPhotoBase64 = event.target.result
            this.$store.commit('setDriverRecruitData_CardInfoByKey', {
              key: 'peopleCarPhoto',
              value: path
            })
          }, () => {
            this.peopleCarPhoto = null
            this.peopleCarPhotoBase64 = null
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
    toSubmit: function() {
      if (this.$store.getters.cardIsCompleteForJoinIn) {
        this.$comfun.showLoading(this, 'baseInfoApplyInfoForJoinIn', false)
        this.$comfun.http_post(this, this.$api.applyInfo, {
          'apply.d_type': this.$store.state.userBaseInfo.dType,
          'apply.person_name': this.$store.state.driverRecruitData.baseInfoComplete.personName,
          'apply.person_sex': this.$store.state.driverRecruitData.baseInfoComplete.personSex,
          'apply.phone': this.$store.state.driverRecruitData.baseInfoComplete.phone,
          'apply.address_detail': this.$store.state.driverRecruitData.baseInfoComplete.addressDetail,
          'apply.is_have_qualification': this.$store.state.driverRecruitData.baseInfoComplete.certificationType,
          'apply.qualification_certificate': this.$store.state.driverRecruitData.baseInfoComplete.certificationCard,
          'apply.is_help_qualification': this.$store.state.driverRecruitData.baseInfoComplete.needHelpGetcertification || '0',
          //'apply.league_recommend_name': this.$store.state.driverRecruitData.baseInfoComplete.recommendName,
          'apply.league_recommend': this.$store.state.driverRecruitData.baseInfoComplete.recommendPhone,
          'apply.idcard_positive': this.$store.state.driverRecruitData.cardInfo.idCardA,
          'apply.idcard_reverse': this.$store.state.driverRecruitData.cardInfo.idCardB,
          'apply.driverlicense_positive': this.$store.state.driverRecruitData.cardInfo.driveCardA,
          'apply.driverlicense_reverse': this.$store.state.driverRecruitData.cardInfo.driveCardB,
          'apply.drivinglicense_positive': this.$store.state.driverRecruitData.cardInfo.runCardA,
          'apply.drivinglicense_reverse': this.$store.state.driverRecruitData.cardInfo.runCardB,
          'apply.car_personal_pic': this.$store.state.driverRecruitData.cardInfo.peopleCarPhoto
        }).then((request) => {
          this.$comfun.hideLoading('baseInfoApplyInfoForJoinIn')
          if (request.data.status == 'OK') {
            this.$comfun.showToast(this, '资料提交成功，请您耐心等待通知')
            this.$router.back()
          } else {
            this.$comfun.showToast(this, request.data.msg)
          }
        })
      } else {
        this.$comfun.showToast(this, '请您先选择所有需要的证件照')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cardItemWrap {
  text-align: center;
  padding: 1.2rem 0.1rem;
  font-size: 0.9rem;
  background: #ffffff;
  .cardWrap {
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content: center;
    margin-top: 1.4rem;
    padding: 0 0.4rem;
    .cardOneWrap {
      position: relative;
      margin: 0 0.8rem;
      overflow: hidden;
      width: 38%;
      .fileWrap {
        position: relative;
        height: 5.6rem;
        .fileInput {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
        }
        .cardDisplay {
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
      .cardTitle {
        display: block;
        font-size: 0.8rem;
        margin-top: 1rem;
        pointer-events: none;
      }
    }
  }
}

.cardTipWrap {
  display: flex;
  display: -webkit-flex; /* Safari */
  justify-content: center;
  background: #ffffff;
  padding: 1.4rem 0.8rem 0.8rem;
  .cardTip {
    margin: 0 0.8rem;
    img {
      width: 100%;
    }
    span {
      display: block;
      font-size: 0.7rem;
      margin-top: 0.2rem;
      text-align: center;
    }
  }
}

.toSubmitStep {
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

.peopleCarPhotoImg {
  position: relative;
  height: 12rem;
  background-image: url('./../../assets/people_car_photo_display.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.contentWrap {
  position: relative;
  text-align: left;
  padding-bottom: 0.8rem;
  .title {
    position: relative;
    text-align: center;
    padding: 0.8rem 0;
    font-size: 1rem;
    font-weight: bold;
  }
  p {
    font-size: 0.9rem;
    padding: 0 0.8rem;
    color: #5c5c5c;
  }
}
</style>
