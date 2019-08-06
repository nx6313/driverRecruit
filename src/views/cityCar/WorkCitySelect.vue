<template>
  <div class="workCityWrap">
    <span :class="['cityItem', curSelectCityId != null && city.id == curSelectCityId ? 'cityItemCurSelected' : '']" v-for="(city, cityIndex) in cityList" :key="cityIndex" v-waves @click="selectThisCity(city)">{{city.county_name}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cityList: [],
      curSelectCityId: null
    }
  },
  created () {
    this.cityList = this.$store.state.pageData.data.list
    this.curSelectCityId = this.$store.state.pageData.data.curCityId
  },
  methods: {
    selectThisCity (city) {
      this.curSelectCityId = city.id
      this.$store.dispatch('clearPageData')
      this.$store.commit('setPageData', {
        data: {
          selected: city
        }
      })
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.workCityWrap {
  position: relative;
  padding: 2.2rem 1.4rem;
  .cityItem {
    position: relative;
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background-color: #F4F4F8;
    font-size: 0.8rem;
    color: rgb(56, 56, 56);
    border-radius: 10rem;
    margin: 0 1.4rem 0.9rem 0;
    box-sizing: border-box;
    border: 1px solid #F4F4F8;
    overflow: hidden;
  }
  .cityItemCurSelected {
    background-color: rgb(255, 239, 233);
    border: 1px solid rgb(255, 205, 196);
  }
}
</style>
