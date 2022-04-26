export const debounce = (func, delay=300, immediate=true) => {
  var timer = null,result
  var debounced =  function (...args) {
      var ctx = this
      timer && clearTimeout(timer)
      if(immediate) {
          // 重点代码 - 开始
          var callNow = !timer
          timer = setTimeout(function(){
              timer = null;
          },delay)
          // 重点代码 - 结束
          callNow && (result = func.apply(ctx,args))
      } else {
          timer = setTimeout(function(){
              func.apply(ctx,args)
          },delay)
      }
      return result
      
  }
  debounced.cancel = function (){
      timer && clearTimeout(timer)
      timer = null
  }
  return debounced
}