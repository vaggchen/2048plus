<template>
  <div id="gameCnt" class="cnt h-full relative grid gap-2 grid-cols-4" ref="cnt">
    <!-- 展示底部格子 -->
    <div v-show="!lazyShow" v-for="(item, index ) in boxLists" class="box rounded-md "
      :style="{ width: itemWidth + 'px', height: itemWidth + 'px' }">
    </div>

    <!-- 展示值 -->
    <div v-show="!lazyShow" v-for="(item, index ) in valLists"
      class="val rounded-md absolute flex justify-center items-center p-2"
      :class="[item.val ? getClass(item.val) : 'hide', item.class]" :style="{
        left: `${item.left}px`, top: `${item.top}px`, width: itemWidth + 'px', height: itemWidth + 'px'
      }">
      <!-- {{ item.val ? item.val : '' }} -->
      <img :src="getSrc(item.val)" alt="">
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import EventBus from '@/utils/eventBus.js'
import haicaoPng from '@/assets/haicao.png'
import xiaPng from '@/assets/xia.png'
import xiaoyuPng from '@/assets/xiaoyu.png'
import jinliyuPng from '@/assets/jinliyu.png'
import wuguiPng from '@/assets/wugui.png'
import shuimuPng from '@/assets/shuimu.png'
import zhangyuPng from '@/assets/zhangyu.png'
import haitunPng from '@/assets/haitun.png'
import shayuPng from '@/assets/shayu.png'
import jingyuPng from '@/assets/jingyu.png'
import longPng from '@/assets/long.png'
import supermanPng from '@/assets/superman.png'
import blackHolePng from '@/assets/blackHole.png'
// 定义传参方法
const emit = defineEmits(['gameOver', 'scoreChange'])
// 定义行个数
const rowLen = 4
// 定义画数组
const boxLists = new Array(rowLen * rowLen).fill(0)
// 定义值数组
const valLists = ref([])
// lazy show
const lazyShow = ref(true)

// 定义cnt宽高和item的宽高
// 定义cnt
const cnt = ref(null)
const cntWidth = ref(0)
const itemWidth = ref(0)

//获取dom和渲染
onMounted(() => {
  import('@/utils/listenTouch.js')
  getCntWidth()
  lazyShow.value = false

  // 补丁
  window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  // 执行初始化
  init()
})
// 初始化
const init = () => {
  // 初始化数组
  valLists.value = new Array(rowLen * rowLen).fill(0).map((item, index) => ({
    originKey: index,
    left: (index % rowLen) * (itemWidth.value + 10),
    top: parseInt(index / rowLen) * (1 / rowLen) * cntWidth.value,
    val: item
  }))

  // for (let i = 1; i < 14; i++) {
  //   // 测试代码
  //   valLists.value[i] = {
  //     originKey: i,
  //     left: (i % rowLen) * (itemWidth.value + 10),
  //     top: parseInt(i / rowLen) * (1 / rowLen) * cntWidth.value,
  //     val: Math.pow(2, i),
  //   }
  // }



  // 初始化数组
  valLists.value = new Array(rowLen * rowLen).fill(0).map((item, index) => ({
    originKey: index,
    left: (index % rowLen) * (itemWidth.value + 10),
    top: parseInt(index / rowLen) * (1 / rowLen) * cntWidth.value,
    val: item,
    class: ''
  }))



  // 初始化数组
  randomNums()
  randomNums()

}

// 获取宽高
const getCntWidth = () => {
  cntWidth.value = cnt.value.clientWidth
  itemWidth.value = (cnt.value.clientWidth - 2 * 16) / rowLen
}

const isGameOver = () => {
  // 如果不存在0时
  if (valLists.value.every(item => item.val !== 0)) {
    // 且每一个元素上下左右都不同
    let noSame = true
    for (let i = 0; i < rowLen * rowLen; i++) {
      // 该元素之上的值如果相等 则跳出
      let topInxdex = i - rowLen;
      if (topInxdex > -1 && (valLists.value[i].val === valLists.value[topInxdex].val)) {
        noSame = false
        break
      }

      // 该元素之下的值如果相等 则跳出
      let botInxdex = i + rowLen;
      if (botInxdex < valLists.value.length && (valLists.value[i].val === valLists.value[botInxdex].val)) {
        noSame = false
        break
      }

      // 该元素之左的值如果相等 则跳出
      let leftInxdex = i - 1;
      if (leftInxdex > -1 && (parseInt(i / rowLen) === parseInt(leftInxdex / rowLen)) && (valLists.value[i].val === valLists.value[leftInxdex].val)) {
        noSame = false
        break
      }

      // 该元素之右的值如果相等 则跳出
      let rightInxdex = i + 1;
      if (rightInxdex < valLists.value.length && (parseInt(i / rowLen) === parseInt(rightInxdex / rowLen)) && (valLists.value[i].val === valLists.value[rightInxdex].val)) {
        noSame = false
        break
      }
    }
    if (noSame) {
      return true
    }

  }
  return false
}

// 生成 2或4 
const randomNums = () => {
  console.log('randomNums')

  // 生成随机数 生成2的概率越大越难
  const num = Math.random() > 0.7 ? 2 : 4

  // 生成随机序号的方法
  const createIndex = () => {
    // 筛选剩余空位
    let arr = valLists.value.filter(item => item.val === 0)
    console.log(arr)
    // 随机一个序号
    const index = parseInt(Math.random() * arr.length)
    // 返回真实的序号值
    return arr[index].originKey
  }
  // 生成随机序号
  const index = createIndex()
  // 放入数组
  valLists.value[index] = {
    val: num,
    originKey: index,
    left: (index % rowLen) * (itemWidth.value + 10),
    top: parseInt(index / rowLen) * (1 / rowLen) * cntWidth.value,
  }
}

// 生成对应src
const getSrc = (val) => {
  let map = {
    2: haicaoPng,
    4: xiaPng,
    8: xiaoyuPng,
    16: jinliyuPng,
    32: wuguiPng,
    64: shuimuPng,
    128: zhangyuPng,
    256: haitunPng,
    512: shayuPng,
    1024: jingyuPng,
    2048: longPng,
    4096: supermanPng,
    8192: blackHolePng,
  }
  return val in map ? map[val] : ''
}

// 生成对应class
const getClass = (val) => {
  let map = {
    2: 'bg2',
    4: 'bg4',
    8: 'bg8',
    16: 'bg16',
    32: 'bg32',
    64: 'bg64',
    128: 'bg128',
    256: 'bg256',
    512: 'bg512',
    1024: 'bg1024',
    2048: 'bg2048',
    4096: 'bg4096',
    8192: 'bg8192',
  }
  return val in map ? map[val] : '-'
}
// 成功调用的方法
const gameOver = () => {
  emit('gameOver')
}

// 暴露init
defineExpose({
  init
})

// 接收注册事件
// 监听滑动向上
EventBus.$on('touchToTop', () => {
  console.log('touchToTop')
  let flag = arrToTop()
  continueGame(flag)
})
// 监听滑动向下
EventBus.$on('touchToBot', () => {
  console.log('touchToBot')
  let flag = arrToBot()
  continueGame(flag)
})
// 监听滑动向左
EventBus.$on('touchToLeft', () => {
  console.log('touchToLeft')
  let flag = arrToLeft()
  continueGame(flag)
})
// 监听滑动向右
EventBus.$on('touchToRight', () => {
  console.log('touchToRight')
  let flag = arrToRight()
  continueGame(flag)

})

// 是否继续游戏
const continueGame = (isMove) => {

  setTimeout(() => {
    // randomNums()
    if (!isMove) {
      return
    }
    // 如果移动后无法移动则跳出
    if (isGameOver()) {
      gameOver()
      return
    }
    // 生成随机数
    randomNums()

    // 生成随机数后是否无法移动
    if (isGameOver()) {
      gameOver()
    }
  }, 250)
}

// 分数改变事件
const scoreChange = (val) => {
  emit('scoreChange', val * 5)
}

// 定义偏移量
const addOffset = 5
const moveOffset = 15

// 系数
const addRatio = 2
const moveRatio = 4

// 数组向左的事件
const arrToLeft = () => {
  // 默认没有发生移动
  let isMove = false
  // 遍历
  for (let i = 0; i < rowLen; i++) {
    let arr = new Array(rowLen).fill(0)
    for (let j = 0; j < rowLen - 1; j++) {
      // 获取真实数组的序号
      let index = i * rowLen + j

      // 获取当前
      let tempItem = valLists.value[index]
      // 获取当前下一个
      let tempItemNext = valLists.value[index + 1]
      arr[j] = tempItem.val
      arr[j + 1] = tempItemNext.val

      // 判断能否合并
      if (tempItem.val === tempItemNext.val && tempItem.val !== 0) {

        let animate
        // 动画
        const animLoop = () => {
          tempItemNext.left -= (tempItemNext.left - tempItem.left) / addRatio
          animate = window.requestAnimationFrame(animLoop)
          // 结束循环条件 ，偏移量是为了纠正移动轨迹
          if (tempItemNext.left <= tempItem.left + addOffset) {
            // 取消动画
            cancelAnimationFrame(animate)

            // 动画后赋值
            tempItemNext.left = (tempItemNext.originKey % rowLen) * (itemWidth.value + 10)
            tempItemNext.val = 0
            tempItem.val = tempItem.val * 2
            tempItem.class = 'mix'
          }
        }
        tempItem.class = ''
        animLoop()

        arr[j] = tempItem.val * 2
        arr[j + 1] = 0

        // 合并即发生了移动
        isMove = true
        // 分数改变事件
        scoreChange(arr[j])
        j++
        // 如果和为rowLen - 2，弥补边界问题
        if (j === rowLen - 2) {
          arr[j + 1] = valLists.value[i * rowLen + j + 1].val
        }
      }

      // 末尾开始移动0位的
      if (j === rowLen - 2 || j === rowLen - 1) {
        console.log(arr)
        let sort = 0
        arr.forEach((it, zIndex) => {
          // 记录新的zIndex
          let index2 = i * rowLen + zIndex
          // 记录当前对象
          let newItem = valLists.value[index2]
          // 如果下标不匹配，且arr[zIndex]当前不为0
          if (sort !== zIndex && it !== 0) {
            // 是否发生移动
            isMove = true
          }
          if (it !== 0) {
            // 存贮目的地index
            let lastIndex = i * rowLen + sort
            // 存贮目的地左距离
            let lastLeft = valLists.value[lastIndex].left
            let animate
            // 动画
            const animLoop = () => {
              newItem.left -= (newItem.left - lastLeft) / moveRatio
              animate = window.requestAnimationFrame(animLoop)
              // 结束循环条件 ，偏移量是为了纠正移动轨迹
              if (newItem.left <= lastLeft + moveOffset) {
                // 解除动画
                cancelAnimationFrame(animate)

                // 渲染正确的值并恢复之前的渲染
                newItem.left = (newItem.originKey % rowLen) * (itemWidth.value + 10)
                newItem.val = 0
                valLists.value[lastIndex].val = it

              }
            }
            // 如果发生序号错位情况，要么移动，要么合并了，再执行动画
            sort !== zIndex && animLoop()
            sort++
          }
        })

      }
    }
  }

  return isMove
}


// 数组向右的事件
const arrToRight = () => {
  // 默认没有发生移动
  let isMove = false
  // 遍历
  for (let i = 0; i < rowLen; i++) {
    let arr = new Array(rowLen).fill(0)
    for (let j = rowLen - 1; j > 0; j--) {
      // 获取真实数组的序号
      let index = i * rowLen + j

      // 获取当前
      let tempItem = valLists.value[index]
      // 获取当前下一个
      let tempItemNext = valLists.value[index - 1]
      arr[j] = tempItem.val
      arr[j - 1] = tempItemNext.val

      // 判断能否合并
      if (tempItem.val === tempItemNext.val && tempItem.val !== 0) {

        let animate
        // 动画
        const animLoop = () => {
          tempItemNext.left += (tempItem.left - tempItemNext.left) / addRatio
          animate = window.requestAnimationFrame(animLoop)
          // 结束循环条件 ，偏移量是为了纠正移动轨迹
          if (tempItemNext.left + addOffset >= tempItem.left) {
            // 取消动画
            cancelAnimationFrame(animate)

            // 动画后赋值
            tempItemNext.left = (tempItemNext.originKey % rowLen) * (itemWidth.value + 10)
            tempItemNext.val = 0
            tempItem.val = tempItem.val * 2
            tempItem.class = 'mix'
          }
        }
        tempItem.class = ''
        animLoop()

        arr[j] = tempItem.val * 2
        arr[j - 1] = 0

        // 合并即发生了移动
        isMove = true
        // 分数改变事件
        scoreChange(arr[j])

        j--

        // 如果和为1，弥补边界问题
        if (j === 1) {
          arr[j - 1] = valLists.value[i * rowLen + j - 1].val
        }
      }

      if (j === 0 || j === 1) {
        console.log(arr)
        let sort = rowLen - 1
        for (let k = rowLen - 1; k >= 0; k--) {
          let zIndex = k
          let it = arr[zIndex]
          // 记录新的zIndex
          let index2 = i * rowLen + zIndex
          // 记录当前对象
          let newItem = valLists.value[index2]
          // 如果下标不匹配，且arr[zIndex]当前不为0
          if (sort !== zIndex && it !== 0) {
            // 是否发生移动
            isMove = true
          }
          if (it !== 0) {
            // 存贮目的地index
            let lastIndex = i * rowLen + sort
            // 存贮目的地左距离
            let lastLeft = valLists.value[lastIndex].left
            let animate
            // 动画
            const animLoop = () => {
              newItem.left += (lastLeft - newItem.left) / moveRatio
              animate = window.requestAnimationFrame(animLoop)
              // 结束循环条件 ，偏移量是为了纠正移动轨迹
              if (newItem.left + moveOffset >= lastLeft) {
                // 解除动画
                cancelAnimationFrame(animate)

                // 渲染正确的值并恢复之前的渲染
                newItem.left = (newItem.originKey % rowLen) * (itemWidth.value + 10)
                newItem.val = 0
                valLists.value[lastIndex].val = it

              }
            }
            // 如果发生序号错位情况，要么移动，要么合并了，再执行动画
            sort !== zIndex && animLoop()
            sort--
          }
        }

      }
    }
  }
  return isMove
}


// 数组向上的事件
const arrToTop = () => {
  // 默认没有发生移动
  let isMove = false
  // 遍历
  for (let i = 0; i < rowLen; i++) {
    let arr = new Array(rowLen).fill(0)
    for (let j = 0; j < rowLen - 1; j++) {
      // 获取真实数组的序号
      let index = j * rowLen + i

      // 获取当前
      let tempItem = valLists.value[index]
      // 获取当前下一个
      let tempItemNext = valLists.value[index + rowLen]
      arr[j] = tempItem.val
      arr[j + 1] = tempItemNext.val

      if (tempItem.val === tempItemNext.val && tempItem.val !== 0) {

        let animate
        // 动画
        const animLoop = () => {
          tempItemNext.top -= (tempItemNext.top - tempItem.top) / addRatio
          animate = window.requestAnimationFrame(animLoop)
          // 结束循环条件 ，偏移量是为了纠正移动轨迹
          if (tempItemNext.top <= tempItem.top + addOffset) {
            // 取消动画
            cancelAnimationFrame(animate)

            // 动画后赋值
            tempItemNext.top = parseInt(tempItemNext.originKey / rowLen) * (1 / rowLen) * cntWidth.value
            tempItemNext.val = 0
            tempItem.val = tempItem.val * 2
            tempItem.class = 'mix'
          }
        }
        tempItem.class = ''
        animLoop()

        arr[j] = tempItem.val * 2
        arr[j + 1] = 0

        isMove = true
        // 分数改变事件
        scoreChange(arr[j])

        j++

        // 如果和为rowLen - 2，弥补边界问题
        if (j === rowLen - 2) {
          arr[j + 1] = valLists.value[(j + 1) * rowLen + i].val
        }
      }

      if (j === rowLen - 2 || j === rowLen - 1) {
        let sort = 0
        arr.forEach((it, zIndex) => {
          // 记录新的zIndex
          let index2 = zIndex * rowLen + i
          // 记录当前对象
          let newItem = valLists.value[index2]
          // 如果下标不匹配，且arr[zIndex]当前不为0
          if (sort !== zIndex && it !== 0) {
            // 是否发生移动
            isMove = true
          }
          if (it !== 0) {
            // 存贮目的地index
            let lastIndex = sort * rowLen + i
            // 存贮目的地左距离
            let lastTop = valLists.value[lastIndex].top

            let animate
            // 动画
            const animLoop = () => {
              newItem.top -= (newItem.top - lastTop) / moveRatio
              animate = window.requestAnimationFrame(animLoop)
              // 结束循环条件 ，偏移量是为了纠正移动轨迹
              if (newItem.top <= lastTop + moveOffset) {
                // 解除动画
                cancelAnimationFrame(animate)

                // 渲染正确的值并恢复之前的渲染
                newItem.top = parseInt(newItem.originKey / rowLen) * (1 / rowLen) * cntWidth.value
                newItem.val = 0
                valLists.value[lastIndex].val = it

              }
            }
            // 如果发生序号错位情况，要么移动，要么合并了，再执行动画
            sort !== zIndex && animLoop()
            sort++
          }
        })

      }
    }
  }
  return isMove
}

// 数组向下的事件
const arrToBot = () => {
  // 默认没有发生移动
  let isMove = false
  // 遍历
  for (let i = 0; i < rowLen; i++) {
    let arr = new Array(rowLen).fill(0)
    for (let j = rowLen - 1; j > 0; j--) {
      // 获取真实数组的序号
      let index = j * rowLen + i
      // 获取当前
      let tempItem = valLists.value[index]
      // 获取当前下一个
      let tempItemNext = valLists.value[index - rowLen]
      arr[j] = tempItem.val
      arr[j - 1] = tempItemNext.val
      if (tempItem.val === tempItemNext.val && tempItem.val !== 0) {

        let animate
        // 动画
        const animLoop = () => {
          tempItemNext.top += (tempItem.top - tempItemNext.top) / addRatio
          animate = window.requestAnimationFrame(animLoop)
          // 结束循环条件 ，偏移量是为了纠正移动轨迹
          if (tempItemNext.top + addOffset >= tempItem.top) {
            // 取消动画
            cancelAnimationFrame(animate)

            // 动画后赋值
            tempItemNext.top = parseInt(tempItemNext.originKey / rowLen) * (1 / rowLen) * cntWidth.value
            tempItemNext.val = 0
            tempItem.val = tempItem.val * 2
            tempItem.class = 'mix'
          }
        }
        tempItem.class = ''
        animLoop()

        arr[j] = tempItem.val * 2
        arr[j - 1] = 0

        isMove = true
        // 分数改变事件
        scoreChange(arr[j])

        j--
        // 如果和为1，弥补边界问题
        if (j === 1) {
          arr[j - 1] = valLists.value[(j - 1) * rowLen + i].val
        }
      }

      if (j === 0 || j === 1) {
        let sort = rowLen - 1
        for (let k = rowLen - 1; k >= 0; k--) {
          let zIndex = k
          let it = arr[k]

          // 记录新的zIndex
          let index2 = zIndex * rowLen + i
          // 记录当前对象
          let newItem = valLists.value[index2]
          // 如果下标不匹配，且arr[zIndex]当前不为0
          if (sort !== zIndex && it !== 0) {
            // 是否发生移动
            isMove = true
          }
          if (it !== 0) {
            // 存贮目的地index
            let lastIndex = sort * rowLen + i
            // 存贮目的地左距离
            let lastTop = valLists.value[lastIndex].top

            let animate
            // 动画
            const animLoop = () => {
              newItem.top += (lastTop - newItem.top) / moveRatio
              animate = window.requestAnimationFrame(animLoop)
              // 结束循环条件 ，偏移量是为了纠正移动轨迹
              if (newItem.top + moveOffset >= lastTop) {
                // 解除动画
                cancelAnimationFrame(animate)

                // 渲染正确的值并恢复之前的渲染
                newItem.top = parseInt(newItem.originKey / rowLen) * (1 / rowLen) * cntWidth.value
                newItem.val = 0
                valLists.value[lastIndex].val = it

              }
            }
            // 如果发生序号错位情况，要么移动，要么合并了，再执行动画
            sort !== zIndex && animLoop()
            sort--
          }
        }
      }
    }
  }
  return isMove
}
</script>

<style scoped>
/* .cnt {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3) inset;
} */

.box {
  box-shadow: 2px 2px 2px #999 inset, 3px 4px 4px #000;
  transition: all .3s;
  /* background-color: rgba(0, 0, 0, 0.7); */
}

.val {
  /* background: rgba(0, 0, 0, 0.3); */
  /* transition: all .5s; */
}

.val.hide {
  opacity: 0;
  transition: all 0s;
}

@keyframes mix {
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
}

.val.mix {
  transform: scale(1);
  /* transition: all 0.2s; */
  animation: mix 0.3s;
}

.val.bg2 {
  background-color: rgb(238, 228, 218);
}

.val.bg4 {
  background-color: rgb(237, 224, 200);
}

.val.bg8 {
  background-color: rgb(242, 224, 121);
}

.val.bg16 {
  background-color: rgb(245, 149, 99);
}

.val.bg32 {
  background-color: rgb(246, 124, 95);
}

.val.bg64 {
  background-color: rgb(246, 94, 59);
}

.val.bg128 {
  background-color: rgb(242, 177, 121);
}

.val.bg256 {
  background-color: rgb(237, 204, 97);
}

.val.bg512 {
  background-color: rgb(110, 128, 128);
}

.val.bg1024 {
  background-color: rgb(113, 213, 238);

}

.val.bg2048 {
  background-color: rgb(30, 128, 128);
}

.val.bg4096 {
  background-color: rgb(169, 153, 207);
}

.val.bg8192 {
  background-color: rgb(255, 255, 255);
}
</style>