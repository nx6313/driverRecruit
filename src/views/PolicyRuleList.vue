<template>
    <div class="policyRuleList">
        <div v-for="(policy, policyIndex) in policyData" v-bind:key="policyIndex" :class="['policyItemWrap', `policyItem_${policyIndex}`]" @click="toPolicyDetail(policy.id)">
            <span class="policyTitle">
                <span :class="['titlePoint', policy.read ? 'titlePointHasRead' : '']"></span>
                {{policy.title}}
                <img class="needWrite" v-lazy="require('@/assets/policy_edit.png')" v-if="policy.edit">
            </span>
            <span :class="['policyRead', policy.read ? 'policyReadHasRead' : '']"><img class="hasRead" v-lazy="require('@/assets/icon_has_read.png')" v-if="policy.read">{{policy.read ? '已阅读' : '未阅读'}}</span>
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
                    route: '/policy/entryNotice',
                    edit: true
                },
                {
                    id: 'crime',
                    title: '无犯罪记录声明',
                    read: false,
                    route: '/policy/noCrimeRecord',
                    edit: true
                },
                {
                    id: 'compensation',
                    title: '薪酬保密承诺书',
                    read: false,
                    route: '/policy/emolumentSecrecy',
                    edit: false
                },
                {
                    id: 'traffic',
                    title: '驾驶人员交通安全承诺书',
                    read: false,
                    route: '/policy/trafficSafety',
                    edit: false
                },
                {
                    id: 'qualification',
                    title: '申报网约车驾驶员资格证承诺书',
                    read: false,
                    route: '/policy/qualification',
                    edit: false
                },
                {
                    id: 'overall',
                    title: '工衣西服费用申明',
                    read: false,
                    route: '/policy/workClothes',
                    edit: false
                },
                {
                    id: 'departure',
                    title: '无法提交《离职证明》申明',
                    read: false,
                    route: '/policy/leaveDeclare',
                    edit: true
                },
                {
                    id: 'porttime',
                    title: '无兼职工作申明',
                    read: false,
                    route: '/policy/noPartTimeJob',
                    edit: false
                },
                {
                    id: 'signature',
                    title: '专职司机文件签约单',
                    read: false,
                    route: '/policy/signContract',
                    edit: true
                }
            ]
        }
    },
    mounted() {
        this.$store.commit('setDriverRecruitData_PolicyList', {
            policyList: this.policyData
        })
        // 更新文件阅读状态
        this.$comfun.showLoading(this, 'policyListStateUpdate', false)
        this.$comfun.http_post(this, this.$api.applyIsRuleRead).then((request) => {
            this.$comfun.hideLoading('policyListStateUpdate')
            if (request.data.status == 'OK') {
                let requestData = request.data.data
                for (let polictIndex in this.policyData) {
                    if (parseInt(requestData[this.policyData[polictIndex].id]) === 1) {
                        this.policyData[polictIndex].read = true
                    }
                }
                this.$store.commit('setDriverRecruitData_PolicyList', {
                    policyList: this.policyData
                })
            } else {
                this.$comfun.showToast(this, request.data.msg)
            }
        })
    },
    methods: {
        toPolicyDetail: function(policyId) {
            let policyInfo = this.policyData[this.policyData.map(v => { return v.id }).indexOf(policyId)]
            if (!policyInfo.read) {
                this.$router.push({ path: policyInfo.route, query: { policyId: policyId } })
            } else {
                this.$comfun.showToast(this, '该规则您已阅读，请查看其他规则')
            }
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
