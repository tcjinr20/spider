/**
 * Created by Administrator on 2017/10/6.
 */

browser.runtime.onMessage.addListener(function(request, sender, sendResponse){

    sendResponse(1);
});
