<template>
    <!-- 驾驶人员交通安全承诺书 -->
    <div class="trafficSafety" v-if="userInfo">
        <div class="policyContentWrap">
            <p>甲方：山西大昌网约车服务有限公司</p>
            <p>乙方：<u> {{userInfo.personName}} </u>（身份证号： <u> {{userInfo.idcarNo}} </u>）</p>
            <p>乙方必须严格自觉遵守国家有关交通安全管理的法规、条例等，如有违反，所造成的一切经济损失及后果由乙方自行承担。</p>
            <p>乙方必须严格自觉遵守甲方的规章制度及双方的约定，如有违反，甲方有权视其情节轻重对乙方的违纪、违约行为做出相应的处罚，并有权解除劳动合同。</p>
            <p>乙方对甲方的车辆必须妥善保管、使用，如发生车辆损毁、被盗等事件应及时通知甲方，并妥善处置。</p>
            <p>乙方未经甲方许可，不得私自动用车辆，不得将甲方车辆转借给他人，否则，由此所造成的一切损失及后果由乙方自行承担，由此导致甲方对外承担责任的，甲方有权向乙方进行全额追偿。</p>
            <p>乙方应安全驾驶甲方车辆，乙方驾驶车辆期间发生事故造成的损失（包括但不限于给第三方造成损失、给甲方车辆自身造成的损失），除保险公司已赔付外，剩余损失，根据乙方在事故中的责任承担情况，甲乙双方按以下比例承担：</p>
            <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td width="45%">责任分配</td>
                    <td width="30%">甲方</td>
                    <td width="25%">乙方</td>
                </tr>
                <tr>
                    <td>乙方全部责任</td>
                    <td>10%</td>
                    <td>90%</td>
                </tr>
                <tr>
                    <td>乙方主要责任</td>
                    <td>20%</td>
                    <td>80%</td>
                </tr>
                <tr>
                    <td>乙方承担同等责任</td>
                    <td>40%</td>
                    <td>60%</td>
                </tr>
                <tr>
                    <td>乙方次要责任</td>
                    <td>50%</td>
                    <td>50%</td>
                </tr>
                <tr>
                    <td>乙方无责任</td>
                    <td>协商解决</td>
                    <td>0%</td>
                </tr>
            </table>
            <p>乙方驾驶车辆发生事故，除乙方被认定对事故不承担责任外，甲方均有权根据事故造成的具体影响对乙方做出相应的处罚，包括停职、罚款、转岗、解除合同等。</p>
            <p>因为乙方的职务侵权行为导致甲方先行对外承担责任的，甲方有权依据本协议第五条约定的比例向乙方追偿。</p>
            <p>本承诺书自最终签署后生效。</p>
        </div>
        <span class="readFinish" @click="readFinish" v-if="canReadFinishTime < 0">阅读完毕</span>
        <span class="readFinish readFinishTimeDown" v-if="canReadFinishTime >= 0">{{`（ ${canReadFinishTime} 秒 ） 阅读完毕`}}</span>
    </div>
</template>

<script>
export default {
    name: 'trafficSafety',
    data() {
        return {
            canReadFinishTime: -1, // 可以点击阅读完毕的倒计时
            userInfo: null
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
        readFinish: function() {
            this.$comfun.showLoading(this, 'applyRuleRead', false)
            this.$comfun.http_post(this, this.$api.applyRuleRead, {
                phone: this.$store.state.userBaseInfo.phone,
                d_type: this.$store.state.userBaseInfo.dType,
                type: 'traffic'
            }).then((request) => {
                this.$comfun.hideLoading('applyRuleRead')
                if (request.data.status == 'OK') {
                    // this.$router.replace('/fullTime/policyRuleList')
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
    text-align: center;
    p {
        text-align: left;
    }
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

table {
    display: inline-block;
    border-top: 2px solid #303030;
    border-bottom: 2px solid #303030;
    box-sizing: border-box;
    text-align: center;
    tr:nth-of-type(n + 2) {
        td {
            border-top: 1px solid #303030;
            text-align: center;
        }
    }
}
</style>
