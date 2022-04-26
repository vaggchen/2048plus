<template>
  <!-- <img :src="myCat" alt=""> -->
  <div class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-30">
    <div class="bg-white rounded-md py-8 px-16">
      <p>游戏结束!</p>
      <p>最终得分：{{ score }}</p>
    </div>
    <div id="overClose">
      <img class="h-12 mt-4 m-auto " :src="closePng" alt="">
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import closePng from '@/assets/close.png'
import EventBus from '@/utils/eventBus.js'
defineProps({
  score: Number
})
onMounted(() => {
  //手指接触reStart
  document.querySelector('#overClose').addEventListener("touchstart", function (e) {
    // 阻止浏览器默认
    e.preventDefault()
    EventBus.$emit('closeOver')
  }, { passive: false });
})
</script>
