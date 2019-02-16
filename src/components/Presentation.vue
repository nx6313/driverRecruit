<template>
  <div class="about">
    <div class="title">平台优势</div>
    <div class="advantage">
      <img v-lazy="'http://img4.duitang.com/uploads/item/201402/14/20140214120558_2f4NN.jpeg'">
      <div class="dec">
        <span>低门槛</span>
        <span>司机需要驾照及三年以上驾龄</span>
      </div>
    </div>
    <div class="advantage">
      <img v-lazy="'http://s9.knowsky.com/bizhi/l/20100615/20109119%20%286%29.jpg'">
      <div class="dec">
        <span>低成本</span>
        <span>车险、车辆维修费由平台承担</span>
      </div>
    </div>
    <div class="advantage">
      <img v-lazy="'http://img.article.pchome.net/00/50/59/93/pic_lib/wm/02.jpg'">
      <div class="dec">
        <span>更便捷</span>
        <span>所有运营手续及证件由平台统一办理</span>
      </div>
    </div>
    <div class="advantage">
      <img v-lazy="'http://att.bbs.duowan.com/forum/201309/27/121732olrimy3dkxgrmdyl.jpg'">
      <div class="dec">
        <span>收入有保障</span>
        <span>有奖励、有提成、有补贴，多劳多得</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Presentation'
}
</script>

<style lang="less" scoped>
.about {
  padding: 1.4rem 1.6rem;
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 1.8rem;
  }
  .advantage {
    font-size: 1rem;
    img {
      display: inline-block;
      width: 4rem;
      vertical-align: middle;
    }
    .dec {
      display: inline-block;
      margin-left: 1rem;
      width: calc(100% - 4rem - 1rem);
      vertical-align: middle;
      span {
        display: block;
        font-size: 1rem;
      }
      span:last-of-type {
        font-size: 0.8rem;
        margin-top: 0.6rem;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
    }
  }
  .advantage:nth-last-of-type(n + 2) {
    margin-bottom: 2rem;
  }
}
</style>
