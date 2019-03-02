<template>
    <div class="datumShow">
        <div ref="downloadPdfTables" class="dataTableContent">
            <div v-html="tableHtmlData"></div>
        </div>
        <span ref="downloadPdfBtn" class="downloadDocFile" @click="tDocx">下载 pdf 文档</span>
    </div>
</template>

<script>
export default {
    name: 'datumShow',
    data() {
        return {
            tableHtmlData: `<table class="data-table" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <th width="100" rowspan="7">基<br>础<br>信<br>息</th>
                    <th>姓名</th>
                    <th>状态</th>
                    <th>手机号</th>
                    <th>提交日期</th>
                    <th>身份证</th>
                    <th>健康状况</th>
                </tr>
                <tr>
                    <td>sdad</td>
                    <td>sdad</td>
                    <td>sdad</td>
                    <td>sdad</td>
                    <td>sdad</td>
                    <td rowspan="6"><div style="background-image: url('https://dccx-oss.oss-cn-shanghai.aliyuncs.com/000263d7-9f67-4aa8-8519-ff4d8da03808.jpg'); background-position: center; background-size: cover; width: 200px; height: 100px;"></div></td>
                </tr>
                <tr>
                    <td colspan="2" class="bold">居住地</td>
                    <td colspan="3">sdad</td>
                </tr>
                <tr>
                    <td colspan="2" rowspan="2" class="bold">消息来源</td>
                    <td colspan="3">sdad</td>
                </tr>
                <tr>
                    <td colspan="3">sdad</td>
                </tr>
                <tr>
                    <td colspan="2" rowspan="2" class="bold">网约车经历</td>
                    <td colspan="3">sdad</td>
                </tr>
                <tr>
                    <td colspan="3">sdad</td>
                </tr>
            </table>
            <table class="data-table" border="0" cellspacing="0" cellpadding="0" style="margin-top: 1rem;">
                <tr>
                    <th width="100" rowspan="2">证<br>件<br>信<br>息</th>
                    <th colspan="3">身份证</th>
                    <th colspan="3">驾驶证</th>
                </tr>
                <tr>
                    <td colspan="3">sdad</td>
                    <td colspan="3">sdad</td>
                </tr>
            </table>
            <table class="data-table" border="0" cellspacing="0" cellpadding="0" style="margin-top: 1rem;">
                <tr>
                    <th width="100" rowspan="6">政<br>策<br>条<br>例</th>
                    <th colspan="4">政策条例名称</th>
                    <th width="90">状态</th>
                    <th colspan="4">政策条例名称</th>
                    <th width="90">状态</th>
                </tr>
                <tr>
                    <td colspan="4">sdad</td>
                    <td>已阅读</td>
                    <td colspan="4">sdad</td>
                    <td>已阅读</td>
                </tr>
                <tr>
                    <td colspan="4">sdad</td>
                    <td>已阅读</td>
                    <td colspan="4">sdad</td>
                    <td>已阅读</td>
                </tr>
                <tr>
                    <td colspan="4">sdad</td>
                    <td>已阅读</td>
                    <td colspan="4">sdad</td>
                    <td>已阅读</td>
                </tr>
                <tr>
                    <td colspan="4">sdad</td>
                    <td>已阅读</td>
                    <td colspan="4">sdad</td>
                    <td>已阅读</td>
                </tr>
                <tr>
                    <td width="100" class="bold">签名时间</td>
                    <td colspan="4">2018.08.06 12:06:28</td>
                    <td width="100" class="bold">签名图</td>
                    <td colspan="4"><img src="https://dccx-oss.oss-cn-shanghai.aliyuncs.com/000263d7-9f67-4aa8-8519-ff4d8da03808.jpg"></td>
                </tr>
            </table>`
        }
    },
    mounted() {
        let textArr = ['18652142598', '大昌出行']
        let textShadeWrap = document.createElement('div')
        textShadeWrap.id = '__textShadeWrap'
        textShadeWrap.style.zIndex = -1
        textShadeWrap.style.position = 'fixed'
        textShadeWrap.style.width = '120vw'
        textShadeWrap.style.height = '120vh'
        textShadeWrap.style.top = '-10vw'
        textShadeWrap.style.left = '-10vh'
        textShadeWrap.style.overflow = 'hidden'
        textShadeWrap.style.userSelect = 'none'
        textShadeWrap.style.pointerEvents = 'none'
        textShadeWrap.style.outline = 'none'
        textShadeWrap.style.textAlign = 'center'
        for (let tShadeIndex = 0; tShadeIndex < 400; tShadeIndex++) {
          let textShadeCellWrap = document.createElement('div')
          textShadeCellWrap.style.display = 'inline-block'
          textShadeCellWrap.style.textAlign = 'center'
          textShadeCellWrap.style.transform = 'rotate(-36deg)'
          textShadeCellWrap.style.transformOrigin = 'center'
          textShadeCellWrap.style.margin = '40px'
          for (let tIndex in textArr) {
            let span = document.createElement('span')
            span.style.display = 'block'
            span.style.textAlign = 'center'
            span.style.textShadow = '4px 4px 10px rgba(220, 220, 220, 0.7)'
            span.style.fontSize = '20px'
            if (tIndex == 1) span.style.fontSize = '16px'
            span.style.fontWeight = 'bold'
            span.style.color = '#e4e4e4'
            span.style.height = '40px'
            span.innerText = textArr[tIndex]
            textShadeCellWrap.appendChild(span)
          }
          textShadeWrap.appendChild(textShadeCellWrap)
        }
        this.$refs.downloadPdfTables.appendChild(textShadeWrap)
    },
    methods: {
        tDocx: function() {
            this.$comfun.convertPdf('司机招募申报资料', this.$refs.downloadPdfTables)
        }
    }
}
</script>

<style lang="less" scoped>
.dataTableContent {
    padding: 2rem 0;
}

.downloadDocFile {
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
