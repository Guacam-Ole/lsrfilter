

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse)  {
        var today=new Date();
        var sevenDaysAgo=new Date();
        if (request.Action==="GetLsr") {
            var retList;
            var domainBlacklist=localStorage.getItem("domainBlacklist");
            var lastLsrDownload=localStorage.getItem("lastLsrDownload");
            var whiteList=localStorage.getItem("whiteList");
            
            sevenDaysAgo.setDate(today.getDate()-7);

            if (lastLsrDownload===undefined || lastLsrDownload===null  || Date.parse(CleanDate(lastLsrDownload))<Date.parse(sevenDaysAgo) || domainBlacklist===undefined || domainBlacklist===null  ) {
            $.getJSON('https://cdn.rawgit.com/magdev/leistungsschutzgelderpresser/master/domains.json', function(domains) {
                retList = domains;
                localStorage.setItem("lastLsrDownload",Date());
                localStorage.setItem("domainBlacklist",JSON.stringify(domains));
                console.log("LSR-Domains read");
                sendResponse({List: retList});
                return true;
            });
        } else {
            retList=JSON.parse(domainBlacklist); 
            sendResponse({List: retList, WhiteList:whiteList});
        }
        } else if (request.Action==="SaveWhiteList") {
            localStorage.setItem("whiteList",request.Whitelist);
        }
    });
    
function CleanDate(anyDate) {
    if (anyDate.indexOf("(") > 0) {
        return anyDate.substring(0, anyDate.indexOf("(") - 1);
    }
}
