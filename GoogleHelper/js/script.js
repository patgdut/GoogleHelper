// GoogleHelper
// Author: patgdut
// Create on: 2012-11-17
// verson: 1.0.0.1

// 页面初始化时向background.html发起请求,若为http连接,强制转换为https连接
chrome.extension.sendRequest({param: "https"}, function(response) {});

// 捕获连接点击事件,提取targetURL,解码并直接跳转
$(document).ready(function(){ 
    var ctrlKeyIsPressed = false;
    $(document).on('keydown', function (evt) {
        // 判断 ctrl 或者 command 键是否按下
        // @FIXME 针对 windows 平台只是对 ctrl 有效，mac 平台只针对 command 有效
        if (evt.ctrlKey || evt.metaKey) {
            ctrlKeyIsPressed = true;
        }
    }).on('keyup', function (evt) {
        ctrlKeyIsPressed = false;
    });

    $("body").on("click", "a", function(evt){
        var url = $(this).attr("href"); 
        var firstIndex = url.indexOf("&url=");
        if (firstIndex <=0) {
            return true;
        }
        var lastIndex = url.indexOf("&ei=");
        if (lastIndex <= 0) {
            lastIndex = url.len;
        }
        var targetURL = url.substring(firstIndex+5,lastIndex);
        var decodeURL = decodeURIComponent(targetURL);

        var target = $(this).attr('target'); // 是否在新的窗口打开

        if (target !== '_blank') {
            return true;
        }

        chrome.extension.sendRequest({
            param:"targetURL", 
            targetURL:decodeURL,
            isOpenBackground: ctrlKeyIsPressed,
        }, function(response) {});

        return false;
    }); 
});
