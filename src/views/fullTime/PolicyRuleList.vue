<template>
    <div class="policyRuleList">
        <div v-for="(policy, policyIndex) in policyData" v-bind:key="policyIndex" :class="['policyItemWrap', `policyItem_${policyIndex}`]" @click="toPolicyDetail(policy.id)">
            <span class="policyTitle">
                <span :class="['titlePoint', policy.read ? (policy.needUpdate ? 'titlePointNeedUpdate' : 'titlePointHasRead') : '']"></span>
                {{policy.title}}
                <img class="needWrite" v-lazy="require('@/assets/policy_edit.png')" v-if="policy.edit">
            </span>
            <span :class="['policyRead', policy.read ? 'policyReadHasRead' : '']"><img class="hasRead" v-lazy="require('@/assets/icon_has_read.png')" v-if="policy.read && !policy.needUpdate"><img class="hasRead" v-lazy="require('@/assets/icon_need_update.png')" v-if="policy.needUpdate">{{policy.read ? (policy.needUpdate ? '请修改' : '已阅读') : '未阅读'}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'policyRuleList',
    data() {
        return {
            policyData: [
                {
                    id: 'induction',
                    title: '入职须知',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/entryNotice',
                    edit: true
                },
                {
                    id: 'crime',
                    title: '无犯罪记录声明',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/noCrimeRecord',
                    edit: true
                },
                {
                    id: 'compensation',
                    title: '薪酬保密承诺书',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/emolumentSecrecy',
                    edit: false
                },
                {
                    id: 'traffic',
                    title: '驾驶人员交通安全承诺书',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/trafficSafety',
                    edit: false
                },
                {
                    id: 'qualification',
                    title: '申报网约车驾驶员资格证承诺书',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/qualification',
                    edit: false
                },
                {
                    id: 'overall',
                    title: '工衣西服费用申明',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/workClothes',
                    edit: false
                },
                {
                    id: 'departure',
                    title: '提交《离职证明》申明',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/leaveDeclare',
                    edit: true
                },
                {
                    id: 'porttime',
                    title: '无兼职工作申明',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/noPartTimeJob',
                    edit: false
                },
                {
                    id: 'signature',
                    title: '专职司机文件签约单',
                    read: false,
                    needUpdate: false,
                    route: '/fullTime/policy/signContract',
                    edit: true
                }
            ]
        }
    },
    mounted() {
        this.$comfun.closeCurDialogPrompt()
        this.$comfun.closeSignPanel()
        this.$store.commit('setDriverRecruitData_PolicyList', {
            policyList: this.policyData
        })
        // 更新文件阅读状态
        this.$comfun.showLoading(this, 'policyListStateUpdate', false)
        this.$comfun.http_post(this, this.$api.applyIsRuleRead, {
            phone: this.$store.state.userBaseInfo.phone,
            d_type: this.$store.state.userBaseInfo.dType
        }).then((request) => {
            this.$comfun.hideLoading('policyListStateUpdate')
            if (request.data.status == 'OK') {
                let requestData = request.data.data
                for (let polictIndex in this.policyData) {
                    if (parseInt(requestData[this.policyData[polictIndex].id]) === 1) {
                        // 已阅读
                        this.policyData[polictIndex].read = true
                    } else if (parseInt(requestData[this.policyData[polictIndex].id]) === -1) {
                        // 需要修改
                        this.policyData[polictIndex].read = true
                        this.policyData[polictIndex].needUpdate = true
                    }
                }
                this.$store.commit('setDriverRecruitData_PolicyList', {
                    policyList: this.policyData
                })
                // 更新本地缓存 - 已上传的图片信息
                let userPhoto = null
                let salaryCard = null
                let salaryCardAddress = null
                let accountCard = null
                let liver = null
                let heart = null
                let xLight = null
                if (requestData.memberRuleRealinfo !== null) {
                    userPhoto = requestData.memberRuleRealinfo.photo
                    salaryCard = requestData.memberRuleRealinfo.bankcar
                    salaryCardAddress = requestData.memberRuleRealinfo.bankaddress
                    accountCard = requestData.memberRuleRealinfo.residence
                    liver = requestData.memberRuleRealinfo.liver
                    heart = requestData.memberRuleRealinfo.ecg
                    xLight = requestData.memberRuleRealinfo.xray
                }

                let noCrimeRecord = null
                if (requestData.memberRuleCrime !== null) {
                    noCrimeRecord = requestData.memberRuleCrime.path
                }

                let leaveDeclare = null
                let leaveYear = null
                let leaveMonth = null
                let leaveDay = null
                let leaveCompany = null
                let leaveReason = null
                if (requestData.memberRuleDeclaration !== null) {
                    leaveDeclare = requestData.memberRuleDeclaration.leave_declare
                    leaveYear = requestData.memberRuleDeclaration.leave_year
                    leaveMonth = requestData.memberRuleDeclaration.leave_month
                    leaveDay = requestData.memberRuleDeclaration.leave_date
                    leaveCompany = requestData.memberRuleDeclaration.company
                    leaveReason = requestData.memberRuleDeclaration.reason
                }
                let hasLeaveDeclare = leaveDeclare !== null ? true : false
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'userPhoto',
                    value: userPhoto
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'salaryCard',
                    value: salaryCard
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'salaryCardAddress',
                    value: salaryCardAddress
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'accountCard',
                    value: accountCard
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'liver',
                    value: liver
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'heart',
                    value: heart
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'xLight',
                    value: xLight
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'noCrimeRecord',
                    value: noCrimeRecord
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'leaveDeclare',
                    value: leaveDeclare
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'leaveYear',
                    value: leaveYear
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'leaveMonth',
                    value: leaveMonth
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'leaveDay',
                    value: leaveDay
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'leaveCompany',
                    value: leaveCompany
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'leaveReason',
                    value: leaveReason
                })
                this.$store.commit('setDriverRecruitData_PolicyDataInfo', {
                    key: 'hasLeaveDeclare',
                    value: hasLeaveDeclare
                })
            } else {
                this.$comfun.showToast(this, request.data.msg)
            }
        })
    },
    methods: {
        toPolicyDetail: function(policyId) {
            let policyInfo = this.policyData[this.policyData.map(v => { return v.id }).indexOf(policyId)]
            this.$router.push({ path: policyInfo.route, query: { policyId: policyId } })
            // if (!policyInfo.read || policyInfo.needUpdate) {
            //     this.$router.replace({ path: policyInfo.route, query: { policyId: policyId } })
            // } else {
            //     this.$comfun.showToast(this, '该规则您已阅读，请查看其他规则')
            // }
        }
    }
}
</script>

<style lang="less" scoped>
.policyItemWrap {
    position: relative;
    padding: 0.96rem 1.2rem;
    background: #ffffff;
    font-size: 0.92rem;
    color: #2c2c2c;
    .policyTitle {
        display: inline-block;
        clear: both;
        .titlePoint {
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #a4a4a4;
            margin-right: 0.4rem;
            margin-bottom: 0.1rem;
            vertical-align: middle;
        }
        .titlePointHasRead {
            background: #5ac79d;
        }
        .titlePointNeedUpdate {
            background: #c75a5a;
        }
        .needWrite {
            display: inline-block;
            width: 0.92rem;
            margin-left: 0.4rem;
            transform: translateY(0.12rem);
        }
    }
    .policyRead {
        display: block;
        float: right;
        color: #7c7c7c;
        font-size: 0.8rem;
        margin-right: 0.4rem;
        .hasRead {
            display: inline-block;
            width: 0.8rem;
            margin-right: 0.3rem;
            transform: translateY(0.12rem);
        }
    }
    .policyReadHasRead {
        color: #3a3a3a;
    }
}
.policyItemWrap:nth-last-of-type(n + 2)::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #f2f2f2;
}
</style>
