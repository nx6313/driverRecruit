<template>
  <div class="pageWrap" :style="{ transform: `translateY(-${coverTranslateY}rem)` }">
    <img class="recruitCover" alt="RecruitCover" v-lazy="require('@/assets/buy_car_home.jpg')" v-touch:moveUpDown="toNextPage">
    <div class="arrowTipWrap" v-if="coverTranslateY == 0">
      <p class="arrowIcon"></p>
    </div>
    <div class="btnWrap">
      <span class="btn" @click="toBuyCarPage">我要购车</span>
      <span class="btn" @click="toDetailPage">已成功办理购车业务</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'buyCarHome',
  data() {
    return {
      coverTranslateY: 0,
      userDriverRecruitState: -10,
      driverRecruitState: {
        USER_IS_DRIVER: 0, // 该用户已经是司机了
        NORMAL: -1, // 该用户还未提交任何资料
        AUDITING: 120, // 该用户提交的资料正在审核中
        AUDIT_PASS: 121, // 该用户提交的资料审核已通过
        AUDIT_NO_PASS: 123, // 该用户提交的资料审核未通过，且不能修改
        INTERVIEW_PASS: 124, // 该用户提交的资料审核未通过，可以修改
        RULE_HAS_RUZHI: 151, // 该用户已入职
        RULE_NO_RUZHI: 152 // 该用户通过所有审核，单还未入职
      }
    }
  },
  created() {
    this.getUserDriverRecruit()
  },
  methods: {
    getUserDriverRecruit: function() {
      this.$comfun.showLoading(this, 'applyDriver', false)
      this.$comfun.http_post(this, this.$api.applyDriver, {
        phone: this.$store.state.userBaseInfo.phone,
        d_type: this.$store.state.userBaseInfo.dType
      }).then((request) => {
        this.$comfun.hideLoading('applyDriver')
        // eslint-disable-next-line
        console.log('购车加盟', request.data)
        if (request.data.status == 'OK') {
          this.userDriverRecruitState = request.data.data.state
          this.$store.commit('updateDriverRecruitState', {
            state: request.data.data.state
          })
        } else {
          this.$comfun.showToast(this, request.data.msg)
        }
      })
    },
    toNextPage: function(distance) {
      if (distance < 0) {
        this.coverTranslateY = 6
      } else {
        this.coverTranslateY = 0
      }
    },
    toBuyCarPage: function() {
      this.$router.replace('/buyCar/intention')
    },
    toDetailPage: function() {
      let linkTo = '/buyCarHome'
      if (this.userDriverRecruitState == this.driverRecruitState.NORMAL) {
        linkTo = '/buyCar/baseInfo1'
      }
      this.$router.replace(linkTo)
    }
  }
}
</script>

<style lang="less" scoped>
.pageWrap {
  font-size: 0;
  transition: all 0.4s;
}

.recruitCover {
  width: 100vw;
  height: 100vh;
}

.arrowTipWrap {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 6.2rem;
  width: 5rem;
  height: 5rem;
  pointer-events: none;
  .arrowIcon {
    display: inline-block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 4rem;
    height: 4rem;
    margin: auto;
    pointer-events: none;
    background-image: url('./../assets/arrows.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    animation: st 1.5s infinite ease-in-out;
  }
}

.btnWrap {
  position: relative;
  height: 6rem;
  color: #ffffff;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  .btn {
    position: relative;
    margin-top: 1.8rem;
    height: 2rem;
    line-height: 2rem;
    font-size: 0.9rem;
    display: inline-block;
    padding: 0 1rem;
    border-radius: 4px;
    background: #E3B142;
    color: #242424;
    border: 1px solid #242424;
    letter-spacing: 1px;
    opacity: 0.9;
    text-shadow: rgba(0, 0, 0, 0.3) 0px 1px 2px;
    box-shadow: rgba(255, 255, 255, 0.25) 0px 1px 0px, inset rgba(255, 255, 255, 0.25) 0px 1px 0px, inset rgba(0, 0, 0, 0.25) 0px 0px 0px, inset rgba(255, 255, 255, 0.03) 0px 20px 0px, inset rgba(0, 0, 0, 0.15) 0px -20px 20px, inset rgba(255, 255, 255, 0.05) 0px 20px 20px;
    transition: all 0.1s linear;
  }
  .btn:nth-of-type(n + 2) {
    margin-left: 2rem;
  }
}

@keyframes st {
  0%, 30% {
    opacity: 0;
    transform: translate(0,10px);
  }
  60% {
    opacity: 1;
    transform: translate(0,0);
  }
  100% {
    opacity: 0;
    transform: translate(0,-8px);
  }
}
</style>
