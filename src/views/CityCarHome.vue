<template>
  <div class="cityCarHome">
    <div class="workCitySelect" @click="getWorkCity">
      <span class="citySelectLabel">选择工作城市</span>
      <div class="citySelectHandler">
        <span :class="['citySelectVal', curSelectCity != null ? 'citySelectValHas' : '']">{{ curSelectCity != null ? curSelectCity.county_name : '点击选择' }}</span>
        <img class="arrow" :src="require('@/assets/arrows.png')">
      </div>
    </div>
    <div class="prepareDatumWrap">
      <div>请提前准备好以下资料，方便您上传使用</div>
      <div>1.身份证（头像面、国徽面）</div>
      <div>2.驾驶证照片</div>
      <div>3.网约车从业资格证（非必填）</div>
    </div>
    <div class="btnWrap">
      <span class="btn" v-waves @click="toRegisterIntercityDriver">去赚钱</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cityList: [],
      curSelectCity: null
    }
  },
  created() {
    this.curSelectCity = this.$store.state.pageData.data && this.$store.state.pageData.data.selected || null
    this.$store.dispatch('clearPageData')
    this.initIntercityCity()
  },
  methods: {
    initIntercityCity (callBack) {
      if (callBack) {
        if (this.cityList.length > 0) {
          if (callBack) callBack()
        } else {
          this.$comfun.http_post(this, this.$api.getIntercityCityList).then(cityData => {
            this.cityList = cityData.data.data
            if (callBack) callBack()
          })
        }
      } else {
        this.$comfun.http_post(this, this.$api.getIntercityCityList).then(cityData => {
          this.cityList = cityData.data.data
        })
      }
    },
    getWorkCity () {
      this.initIntercityCity(() => {
        this.$store.commit('setPageData', {
          data: {
            list: this.cityList,
            curCityId: this.curSelectCity && this.curSelectCity.id || null
          }
        })
        this.$router.push('/cityCar/workCitySelect')
      })
    },
    toRegisterIntercityDriver () {
      if (this.curSelectCity && this.curSelectCity.id) {
        this.$store.commit('setDriverRecruitData_BaseInfoCompleteByKey', {
          key: 'cityIntercityId',
          value: this.curSelectCity.id
        })
        this.$router.push('/cityCar/infoGet')
      } else {
        this.$comfun.showToast(this, '请先选择工作城市')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cityCarHome {
  position: relative;
  .workCitySelect {
    position: relative;
    display: -webkit-flex; /* Safari */
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2.8rem 1.2rem 0;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid #e7e7e7;
    .citySelectLabel {
      position: relative;
      color: #3b3b3b;
      font-size: 0.9rem;
    }
    .citySelectHandler {
      position: relative;
      display: -webkit-flex; /* Safari */
      display: flex;
      align-items: center;
      .citySelectVal {
        position: relative;
        font-size: 0.9rem;
        color: #9b9b9b;
      }
      .citySelectValHas {
        color: #6e6e6e;
      }
      .arrow {
        position: relative;
        width: 1.4rem;
        height: 1.4rem;
        transform: rotate(90deg) translateX(1px);
      }
    }
  }
  .prepareDatumWrap {
    position: relative;
    font-size: 0.8rem;
    line-height: 1.8rem;
    padding: 2rem 1.2rem 0;
  }
  .btnWrap {
    position: relative;
    text-align: center;
    margin-top: 3.4rem;
    .btn {
      position: relative;
      display: inline-block;
      padding: 0.6rem 2.8rem;
      background-color: #FF5252;
      color: #fff;
      font-size: 0.8rem;
      border-radius: 4px;
      box-shadow: 0 0 6px rgba(65, 65, 65, 0.2);
    }
  }
}
</style>
