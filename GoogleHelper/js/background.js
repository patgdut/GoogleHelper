﻿// GoogleHelper
// Author: patgdut
// Create on: 2012-11-17
// verson: 1.0.0.3
// @NOTE 重新编译crx文件的时候请选择pem文件

(function () {
    var googleHelper = {
        init: function() {
            // 创建右键菜单 
            chrome.contextMenus.create({"title":"使用https方式打开", "contexts":["link"], "onclick":  function(info, tab) {
                var url = info.linkUrl;
                // Google的连接是经过uri encode的,所以连接中只会有一个"http://"字符串
                var httpsURL = url .replace("http://","https://"); 
                chrome.tabs.create( {url: httpsURL,index: tab.index+1});
            }
            });
            // 响应content_script发出的请求
            chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
                if("https" == request.param) {
                    var url = sender.tab.url;
                    var match = "^(http:\/\/[a-z0-9\._-]+google.com)";
                    var reg = new RegExp(match);  
                    if (reg.test(url)) { 
                        var httpsURL = url .replace("http://","https://"); 
                        chrome.tabs.update(sender.tab.id, {url: httpsURL});
                    }
                } else if("targetURL" == request.param) {
                    if (request.isOpenInNewTab) {
                        chrome.tabs.create({url: request.targetURL,index: sender.tab.index+1, active: !request.isOpenBackground});
                    } else {
                        chrome.tabs.update(sender.tab.id, {url: request.targetURL});
                    }
                }
                sendResponse({result: "success"});
            });
        }
    }
    googleHelper.init();

})();
