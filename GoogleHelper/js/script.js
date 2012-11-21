// GoogleHelper
// Author: patgdut
// Create on: 2012-11-17
// verson: 1.0.0.2

// 页面初始化时向background.html发起请求,若为http连接,强制转换为https连接
chrome.extension.sendRequest({param: "https"}, function(response) {});

// 捕获连接点击事件,提取targetURL,解码并直接跳转
$(document).ready(function(){
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

        // 是否在后台tab打开
        var ctrlKeyIsPressed = false;
        if (evt.ctrlKey || evt.metaKey) {
            ctrlKeyIsPressed = true;
        }

        // 是否在新的窗口打开
        var target = $(this).attr('target'); 

        if (target !== '_blank' && !ctrlKeyIsPressed) {
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
