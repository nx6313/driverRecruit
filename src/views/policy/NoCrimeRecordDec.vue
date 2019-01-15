<template>
    <div class="noCrimeRecordDec">
        <img :src="require('@/assets/no_crime_dec_1.png')" alt="流程图1">
        <img :src="require('@/assets/no_crime_dec_2.png')" alt="流程图1">
        <img :src="require('@/assets/no_crime_dec_3.png')" alt="流程图1">
        <img :src="require('@/assets/no_crime_dec_4.png')" alt="流程图1">
    </div>
</template>

<script>
export default {
    name: 'noCrimeRecordDec'
}
</script>

<style lang="less" scoped>
.noCrimeRecordDec {
    padding: 1rem;
    img {
        width: 100%;
    }
    img:nth-last-of-type(n + 2) {
        margin-bottom: 0.6rem;
    }
}
</style>
