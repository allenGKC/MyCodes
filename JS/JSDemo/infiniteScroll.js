/**
 * @directive infiniteScroll 无限加载指令
 * @author Allen.Gong
 * @date 2017.01.23
 * @desc v-infiniteScroll="{ fun: fun, busy: busy, minHeight: minHeight }"
 * @param {function} fun - 加载数据的方法
 * @param {boolean} busy - 设置busy状态值，以防在接口延迟时，多次调用的bug
 * @param {number} minHeight 距离底部的距离，可以根据页面情况自行调整
 * @version 1.0
 * @update 增加防抖函数
 */

// 简单的防抖动函数
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

var myEfficientFn = debounce(function() {
    // 滚动中的真正的操作
    infiniteScroll.handler();
}, 100);

const infiniteScroll = {
    bind(el, binding) {
        infiniteScroll.handler = function(){
            let viewHeight = document.documentElement.clientHeight || document.body.clientHeight, // 获取视口高度
                docScrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight,  // 获取网页高度
                docScrollTop = document.documentElement.scrollTop || document.body.scrollTop;  // 获取页面的滚动高度

            if(docScrollTop + viewHeight + binding.value.minHeight >= docScrollHeight ){
                if(!binding.value.busy){
                    let fnc = binding.value.fun;
                    fnc();
                }
            }
        };
        window.addEventListener('scroll', myEfficientFn,false);
    },
    unbind: function () {
        window.removeEventListener('scroll', myEfficientFn,false);
    }
};

export default infiniteScroll;