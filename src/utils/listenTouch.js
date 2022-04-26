    import EventBus from  './eventBus.js'
    import {debounce} from './debounce.js'
    var startx, starty;
    //获得角度
    function getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
    };
 
    //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
    function getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;
 
        //如果滑动距离太短
        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
            return result;
        }
 
        var angle = getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
            result = 1;
        } else if (angle > 45 && angle < 135) {
            result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        } else if (angle >= -45 && angle <= 45) {
            result = 4;
        }
 
        return result;
    }
    //手指接触reStart
    document.querySelector('#reStart').addEventListener("touchstart", function(e) {
      // 阻止浏览器默认
      e.preventDefault()
      EventBus.$emit('touchReStart')
        
    }, {passive: false});
    //手指接触tip
    document.querySelector('#tip').addEventListener("touchstart", function(e) {
      // 阻止浏览器默认
      e.preventDefault()
      EventBus.$emit('touchTip',true)
        
    }, {passive: false});
    //手指接触屏幕
    document.addEventListener("touchstart", debounce(function(e) {
      // 阻止浏览器默认
      e.preventDefault()
        startx = e.touches[0].pageX;
        starty = e.touches[0].pageY;
        
    }), {passive: false});
    //手指离开屏幕
    document.addEventListener("touchend", debounce(function(e) {
      // 阻止浏览器默认
      e.preventDefault()
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        switch (direction) {
            case 0:
                // alert("未滑动！");
                break;
            case 1:
                // alert("向上！")
                EventBus.$emit('touchToTop')
                break;
            case 2:
                // alert("向下！")
                EventBus.$emit('touchToBot')
                break;
            case 3:
                // alert("向左！")
                EventBus.$emit('touchToLeft')
                break;
            case 4:
                // alert("向右！")
                EventBus.$emit('touchToRight')
                break;
            default:
        }
    }),  {passive: false});