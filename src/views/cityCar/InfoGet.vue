<template>
  <div class="infoGetWrap">
    <BaseInfoItem title="个人信息" :titleIcon="require('@/assets/logo.png')" :inputs="input1"/>
    <div class="cardInfoWrap">
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
    </div>
    <BaseInfoItem title="是否拥有网约车司机从业资格证" :titleIcon="require('@/assets/logo.png')" :inputs="input2" :hasSlot="showCertificationUpload" :slotStyle="{ paddingBottom: '0.8rem' }">
      <div :class="['cardWrap', 'certificationWrap', certificationBase64 == null ? 'normalCardWrap' : '']">
        <input v-if="showFileSelectInput" type="file" class="fileInput" title="请选择网约车从业资格证" accept="image/*" @change="selectFile($event, 'certification_record')">
        <img class="cardDisplay showBorder" v-lazy="require('@/assets/certification_record.png')">
        <span v-if="certificationBase64 != null" class="imgPreview hasBorder" :style="certificationBase64 != null ? { 'background-image': `url(${certificationBase64})` } : {}"></span>
      </div>
      <span class="uploadTip">上传网约车从业资格证</span>
    </BaseInfoItem>
    <div class="pageTip" v-if="!showCertificationUpload">查看<span @click="toFlow">《网约车从业资格证》</span>办理流程</div>
    <span class="toSubmitStep" @click="toSubmit">加入去赚钱</span>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'
import BaseInfoItem from '@/components/BaseInfoItem.vue'

export default {
  inject: ['savePageData', 'getPageData', 'clearPageData'],
  components: {
    BaseInfoItem
  },
  data () {
    return {
      showFileSelectInput: true,
      certification: null,
      certificationBase64: null,
      showCertificationUpload: false,
      idCardA: null,
      idCardB: null,
      driveCardA: null,
      driveCardB: null,
      idCardABase64: null,
      idCardBBase64: null,
      driveCardABase64: null,
      driveCardBBase64: null,
      input1: [
        {
          label: '姓名',
          hint: '请输入您的姓名',
          type: 'text',
          model: '',
          require: true
        },
        {
          label: '身份证号',
          hint: '请输入您的身份证号',
          type: 'text',
          model: '',
          require: true
        },
        {
          label: '性别',
          type: 'radio',
          range: [ { name: '1', value: '男' }, { name: '2', value: '女' } ],
          model: '1',
          require: true
        }
      ],
      input2: [
        {
          type: 'radio',
          range: [ { name: '1', value: '已有' }, { name: '2', value: '正在办理中' }, { name: '0', value: '暂无' } ],
          model: ''
        }
      ]
    }
  },
  created () {
    this.input1[0].model = this.$store.state.driverRecruitData.baseInfoComplete.personName || ''
    this.input1[1].model = this.$store.state.driverRecruitData.baseInfoComplete.idcarNo || ''
    this.input1[2].model = this.$store.state.driverRecruitData.baseInfoComplete.personSex || ''
    this.input2[0].model = this.$store.state.driverRecruitData.baseInfoComplete.certificationType || ''
    this.idCardABase64 = this.$store.state.driverRecruitData.cardInfo.idCardA
    this.idCardBBase64 = this.$store.state.driverRecruitData.cardInfo.idCardB
    this.driveCardABase64 = this.$store.state.driverRecruitData.cardInfo.driveCardA
    this.driveCardBBase64 = this.$store.state.driverRecruitData.cardInfo.driveCardB
  },
  computed: {
    certificationHas: function() {
      return this.input2[0].model
    }
  },
  mounted () {
    if (this.$route.meta.keepData === true) {
      let pageData = this.getPageData()
      this.certification = pageData.certification
      this.certificationBase64 = pageData.certificationBase64
      this.showCertificationUpload = pageData.showCertificationUpload
      this.input1[0].model = pageData.input1[0].model
      this.input1[1].model = pageData.input1[1].model
      this.input1[2].model = pageData.input1[2].model
    }
    this.clearPageData()
  },
  methods: {
    selectFile: function(event, type) {
      if (type == 'certification_record') {
        this.certification = event.target.files[0]
        this.imgPreview(this.certification, type)
      } else if (type == 'id_card_a') {
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
        if (type == 'certification_record') {
          this.uploadCardFile(this.certification, (path) => {
            this.certificationBase64 = event.target.result
            this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
              key: 'certificationCard',
              value: path
            })
          }, () => {
            this.certification = null
            this.certificationBase64 = null
          })
        } else if (type == 'id_card_a') {
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
    toFlow: function() {
      this.savePageData()
      this.$router.push('/cityCar/flow')
    },
    toSubmit () {
      if (this.input1[0].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的姓名'); return false }
      if (SOME_RULES.emoji.test(this.input1[0].model.trim())) { this.$comfun.showToast(this, '姓名中不能含有特殊字符'); return false }
      if (this.input1[1].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的身份证号'); return false }
      if (!SOME_RULES.idCard.test(this.input1[1].model.trim())) { this.$comfun.showToast(this, '请输入正确的身份证号'); return false }
      if (this.input2[0].model.trim() == '') { this.$comfun.showToast(this, '请先选择您是否拥有网约车司机从业资格证'); return false }
      if (this.input2[0].model.trim() == '1' && this.$store.state.driverRecruitData.baseInfoComplete.certificationCard == null) { this.$comfun.showToast(this, '请先上传您的网约车司机从业资格证'); return false }
      if (this.$store.state.driverRecruitData.cardInfo.idCardA === null) { this.$comfun.showToast(this, '请上传身份证正面'); return false }
      if (this.$store.state.driverRecruitData.cardInfo.idCardB === null) { this.$comfun.showToast(this, '请上传身份证反面'); return false }
      if (this.$store.state.driverRecruitData.cardInfo.driveCardA === null) { this.$comfun.showToast(this, '请上传驾驶证正面'); return false }
      if (this.$store.state.driverRecruitData.cardInfo.driveCardB === null) { this.$comfun.showToast(this, '请上传驾驶证副页'); return false }
      this.saveBaseInfo()
      let httpParams = {
        'driver.d_type': this.$store.state.userBaseInfo.dType,
        'driver.phone': this.$store.state.userBaseInfo.phone,
        'driver.real_name': this.$store.state.driverRecruitData.baseInfoComplete.personName,
        'driver.certificate_no': this.$store.state.driverRecruitData.baseInfoComplete.idcarNo,
        'driver.gender': this.$store.state.driverRecruitData.baseInfoComplete.personSex,
        'credentials.idcard_positive': this.$store.state.driverRecruitData.cardInfo.idCardA,
        'credentials.idcard_reverse': this.$store.state.driverRecruitData.cardInfo.idCardB,
        'credentials.driverlicense_positive': this.$store.state.driverRecruitData.cardInfo.driveCardA,
        'credentials.driverlicense_reverse': this.$store.state.driverRecruitData.cardInfo.driveCardB,
        'credentials.cert_type': this.$store.state.driverRecruitData.baseInfoComplete.certificationType,
        'driver.join_business_id': this.$store.state.driverRecruitData.baseInfoComplete.cityIntercityId,
        'credentials.status': this.$store.state.driverRecruitData.baseInfoComplete.needHelpGetcertification || '0',
        'credentials.id': this.$store.state.driverRecruitData.baseInfoComplete.driverCredentials_id || ''
      }
      if (this.$store.state.driverRecruitData.baseInfoComplete.certificationType == '1') {
        httpParams['credentials.qualification_certificate'] = this.$store.state.driverRecruitData.baseInfoComplete.certificationCard
      }
      this.$comfun.showLoading(this, 'saveIntercityInfo', false)
      this.$comfun.http_post(this, this.$api.saveIntercityInfo, httpParams).then((request) => {
        this.$comfun.hideLoading('saveIntercityInfo')
        if (request.data.status == 'OK') {
          this.$comfun.showToast(this, '资料提交成功，请您耐心等待通知')
          this.$router.back()
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    saveBaseInfo () {
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'personName',
        value: this.input1[0].model.trim()
      })
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'idcarNo',
        value: this.input1[1].model.trim()
      })
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'personSex',
        value: this.input1[2].model.trim()
      })
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'certificationType',
        value: this.input2[0].model.trim()
      })
    }
  },
  watch: {
    certificationHas: function(val) {
      if (val == this.input2[0].range[0].name) {
        this.showCertificationUpload = true
        this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
          key: 'needHelpGetcertification',
          value: '0'
        })
      } else {
        this.showCertificationUpload = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.infoGetWrap {
  position: relative;
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
    height: 7.5rem;
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
.uploadTip {
  display: block;
  text-align: center;
  font-size: 0.92rem;
  margin-top: 0.2rem;
}
.pageTip {
  position: relative;
  display: inline-block;
  margin-top: 2rem;
  margin-bottom: 1rem;
  margin-left: 1.2rem;
  font-size: 0.9rem;
  padding-left: 0.8rem;
  span {
    color: #2642cf;
  }
}
.pageTip::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #33374b;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto 0;
}
.cardInfoWrap {
  position: relative;
  margin-top: 0.4rem;
}
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
    width: auto;
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
          height: 5.1rem;
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
</style>
