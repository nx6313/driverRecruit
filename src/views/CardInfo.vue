<template>
  <div class="cardInfo">
    <div class="cardItemWrap">
      <span>请拍摄实体身份证并上传</span>
      <div class="cardWrap">
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input type="file" class="fileInput" title="请选择身份证正面照" accept="image/*" @change="selectFile($event, 'id_card_a')">
            <img class="cardDisplay" v-lazy="require('@/assets/id_card_a.jpg')">
            <span v-if="idCardABase64 != null" class="imgPreview" :style="idCardABase64 != null ? { 'background-image': `url(${idCardABase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传身份证正面</span>
        </div>
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input type="file" class="fileInput" title="请选择身份证国徽面照" accept="image/*" @change="selectFile($event, 'id_card_b')">
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
            <input type="file" class="fileInput" title="请选择驾驶证正面照" accept="image/*" @change="selectFile($event, 'drive_card_a')">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/drive_card_a.jpg')">
            <span v-if="driveCardABase64 != null" class="imgPreview hasBorder" :style="driveCardABase64 != null ? { 'background-image': `url(${driveCardABase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传驾驶证正面照</span>
        </div>
        <div class="cardOneWrap">
          <div class="fileWrap">
            <input type="file" class="fileInput" title="请选择驾驶证副页照" accept="image/*" @change="selectFile($event, 'drive_card_b')">
            <img class="cardDisplay showBorder" v-lazy="require('@/assets/drive_card_b.jpg')">
            <span v-if="driveCardBBase64 != null" class="imgPreview hasBorder" :style="driveCardBBase64 != null ? { 'background-image': `url(${driveCardBBase64})` } : {}"></span>
          </div>
          <span class="cardTitle">上传驾驶证副页</span>
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
    <span class="toNextStep" @click="toNext">下一步</span>
  </div>
</template>

<script>
export default {
  name: 'cardInfo',
  data() {
    return {
      idCardA: null,
      idCardB: null,
      driveCardA: null,
      driveCardB: null,
      idCardABase64: null,
      idCardBBase64: null,
      driveCardABase64: null,
      driveCardBBase64: null
    }
  },
  created() {
    // this.$store.dispatch('clearDriverRecruitData_CardInfo')
    this.idCardABase64 = this.$store.state.driverRecruitData.cardInfo.idCardA
    this.idCardBBase64 = this.$store.state.driverRecruitData.cardInfo.idCardB
    this.driveCardABase64 = this.$store.state.driverRecruitData.cardInfo.driveCardA
    this.driveCardBBase64 = this.$store.state.driverRecruitData.cardInfo.driveCardB
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
      }
    },
    imgPreview: function(file, type) {
      if (!window.FileReader) return false
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = (event) => {
        if (type == 'id_card_a') {
          this.uploadCardFile(this.idCardA, (path) => {
            this.idCardABase64 = event.target.result
            this.$store.commit('setDriverRecruitData_CardInfo', {
              cardInfo: {
                idCardA: path,
                idCardB: this.$store.state.driverRecruitData.cardInfo.idCardB,
                driveCardA: this.$store.state.driverRecruitData.cardInfo.driveCardA,
                driveCardB: this.$store.state.driverRecruitData.cardInfo.driveCardB
              }
            })
          }, () => {
            this.idCardA = null
            this.idCardABase64 = null
          })
        } else if (type == 'id_card_b') {
          this.uploadCardFile(this.idCardB, (path) => {
            this.idCardBBase64 = event.target.result
            this.$store.commit('setDriverRecruitData_CardInfo', {
              cardInfo: {
                idCardA: this.$store.state.driverRecruitData.cardInfo.idCardA,
                idCardB: path,
                driveCardA: this.$store.state.driverRecruitData.cardInfo.driveCardA,
                driveCardB: this.$store.state.driverRecruitData.cardInfo.driveCardB
              }
            })
          }, () => {
            this.idCardB = null
            this.idCardBBase64 = null
          })
        } else if (type == 'drive_card_a') {
          this.uploadCardFile(this.driveCardA, (path) => {
            this.driveCardABase64 = event.target.result
            this.$store.commit('setDriverRecruitData_CardInfo', {
              cardInfo: {
                idCardA: this.$store.state.driverRecruitData.cardInfo.idCardA,
                idCardB: this.$store.state.driverRecruitData.cardInfo.idCardB,
                driveCardA: path,
                driveCardB: this.$store.state.driverRecruitData.cardInfo.driveCardB
              }
            })
          }, () => {
            this.driveCardA = null
            this.driveCardABase64 = null
          })
        } else if (type == 'drive_card_b') {
          this.uploadCardFile(this.driveCardB, (path) => {
            this.driveCardBBase64 = event.target.result
            this.$store.commit('setDriverRecruitData_CardInfo', {
              cardInfo: {
                idCardA: this.$store.state.driverRecruitData.cardInfo.idCardA,
                idCardB: this.$store.state.driverRecruitData.cardInfo.idCardB,
                driveCardA: this.$store.state.driverRecruitData.cardInfo.driveCardA,
                driveCardB: path
              }
            })
          }, () => {
            this.driveCardB = null
            this.driveCardBBase64 = null
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
    toNext: function() {
      if (this.$store.getters.cardIsComplete) {
        this.$router.push('/baseInfo')
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

.toNextStep {
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
</style>
