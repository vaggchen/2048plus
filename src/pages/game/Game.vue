<template>
  <div class="relative bg flex flex-col w-full h-full pt-8 lg:(w-750px h-800px border border-gray-500/50) ">
    <!-- 游戏工具栏组件 -->
    <GameTool :score="score" @reStart="reStart" />
    <div class="p-4 py-8">
      <!-- 游戏内容组件 -->
      <GameCnt @scoreChange="scoreChange" @gameOver="gameOver" ref="gameCnt" />
      <!-- 游戏结束组件 -->
      <GameOver v-if="over" :score="score" />
    </div>

  </div>
  <!-- 提示组件 -->
  <Tip @click="clickTip" v-if="tipShow" />

</template>
<script setup>
import { ref } from 'vue';
import Tip from './components/Tip.vue'
import GameCnt from './components/GameCnt.vue'
import GameTool from './components/GameTool.vue'
import GameOver from './components/GameOver.vue'
import EventBus from '@/utils/eventBus.js'
// 设置tip展示时间
const tipShowTime = 2000
// 设置tip展示
const tipShow = ref(false)
// 设置得分
const score = ref(0)
// 监听游戏主体
const gameCnt = ref(null)
// 定时器
const timer = ref(null)
// 游戏是否通过
const over = ref(false)

// 初始化
const init = () => {
  over.value = false
  // tipShow.value = true
  score.value = 0
  // showTip()
  // 如果存在gameCnt组件，则调用init方法
  gameCnt.value && gameCnt.value.init()
}

// 关闭提示
const showTip = () => {
  timer.value = setTimeout(() => {
    tipShow.value = false
  }, tipShowTime)
}

// 设置点击即可手动关闭
const clickTip = () => {
  timer.value && clearTimeout(timer.value)
  tipShow.value = false
}

// 步数改变
const scoreChange = (val) => {
  score.value += val
}

// 游戏结束
const gameOver = () => {
  // score.value = 0
  over.value = true
}
// 重新开始
const reStart = () => {
  init()
}

// 接收注册事件
EventBus.$on('touchReStart', () => {
  // alert('touchReStart')
  init()
})
// 接收注册事件
EventBus.$on('closeOver', () => {
  // alert('touchReStart')
  over.value = false
})

init()
</script>
<style scoped>
.bg {
  background: linear-gradient(to bottom, #c4f0f8, #aff8cc);
}
</style>