<template>
  <div class="pageWrap">
    <BaseInfoItem title="请填写您的基本信息" :titleIcon="require('@/assets/logo.png')" :inputs="input1"/>
    <BaseInfoItem title="是否拥有网约车司机从业资格证" :titleIcon="require('@/assets/logo.png')" :inputs="input2" :hasSlot="showCertificationUpload" :slotStyle="{ paddingBottom: '0.8rem' }">
      <div :class="['cardWrap', 'certificationWrap', certificationBase64 == null ? 'normalCardWrap' : '']">
        <input type="file" class="fileInput" title="请选择网约车从业资格证" accept="image/*" @change="selectFile($event, 'certification_record')">
        <img class="cardDisplay showBorder" v-lazy="require('@/assets/certification_record.png')">
        <span v-if="certificationBase64 != null" class="imgPreview hasBorder" :style="certificationBase64 != null ? { 'background-image': `url(${certificationBase64})` } : {}"></span>
      </div>
      <span class="uploadTip">上传网约车从业资格证</span>
    </BaseInfoItem>
    <div class="pageTip">查看<span @click="toFlow">《网约车从业资格证》</span>办理流程</div>
    <span class="toNextStep" @click="toNext">下一步</span>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'
import BaseInfoItem from '@/components/BaseInfoItem.vue'

export default {
  name: 'rentCarBaseInfo1',
  inject: ['savePageData', 'getPageData'],
  components: {
    BaseInfoItem
  },
  data() {
    return {
      certification: null,
      certificationBase64: null,
      showCertificationUpload: false,
      input1: [
        {
          label: '姓名',
          hint: '请输入您的姓名',
          type: 'text',
          model: ''
        },
        {
          label: '性别',
          type: 'radio',
          range: [ { name: '男', value: '男' }, { name: '女', value: '女' } ],
          model: '男'
        },
        {
          label: '手机号码',
          hint: '请输入您的手机号',
          type: 'text',
          model: this.$store.state.userBaseInfo.phone,
          readOnly: true
        },
        {
          label: '司机类型',
          type: 'text',
          model: '带车加盟',
          readOnly: true
        },
        {
          label: '现居住地',
          hint: '请输入您的现居住地',
          type: 'text',
          model: ''
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
  computed: {
    certificationHas: function() {
      return this.input2[0].model
    }
  },
  mounted() {
    if (this.$route.meta.keepData === true) {
      let pageData = this.getPageData()
      this.certification = pageData.certification
      this.certificationBase64 = pageData.certificationBase64
      this.showCertificationUpload = pageData.showCertificationUpload
      this.input1[0].model = pageData.input1[0].model
      this.input1[1].model = pageData.input1[1].model
      this.input1[4].model = pageData.input1[4].model
      this.input2[0].model = pageData.input2[0].model
    }
  },
  methods: {
    selectFile: function(event, type) {
      if (type == 'certification_record') {
        this.certification = event.target.files[0]
        this.imgPreview(this.certification, type)
      }
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
      this.$router.push('/rentCar/flow')
    },
    toNext: function() {
      if (this.input1[0].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的姓名'); return false }
      if (SOME_RULES.emoji.test(this.input1[0].model.trim())) { this.$comfun.showToast(this, '姓名中不能含有特殊字符'); return false }
      if (this.input1[4].model.trim() == '') { this.$comfun.showToast(this, '请先输入您的现居住地'); return false }
      if (SOME_RULES.emoji.test(this.input1[4].model.trim())) { this.$comfun.showToast(this, '现居住地中不能含有特殊字符'); return false }
      if (this.input2[0].model.trim() == '') { this.$comfun.showToast(this, '请先选择您是否拥有网约车司机从业资格证'); return false }
      if (this.input2[0].model.trim() == '已有' && this.$store.state.driverRecruitData.baseInfoComplete.certificationCard == null) { this.$comfun.showToast(this, '请先上传您的网约车司机从业资格证'); return false }
      this.saveBaseInfo1()
      this.$router.replace('/rentCar/baseInfo2')
    },
    saveBaseInfo1: function() {
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'personName',
        value: this.input1[0].model.trim()
      })
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'personSex',
        value: this.input1[1].model.trim()
      })
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'phone',
        value: this.input1[2].model.trim()
      })
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'driverType',
        value: this.$store.state.userBaseInfo.dType
      })
      this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
        key: 'addressDetail',
        value: this.input1[4].model.trim()
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
      } else {
        this.showCertificationUpload = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pageWrap {
  position: relative;
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

.noCrimeRecordWrap {
  margin-top: 0.8rem;
}

.uploadTip {
    display: block;
    text-align: center;
    font-size: 0.92rem;
    margin-top: 0.2rem;
}
</style>
