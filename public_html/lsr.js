var gpoLsr=function() {
    this.DomainBlackList=[];
    this.Pause=false;
    this.WhiteList=undefined;
};

gpoLsr.prototype = {
    constructor: gpoLsr,
    Init:function() {
        this.LoadLsrList();
    }, 
    Dom:function() {
        var obj=this;
        if (this.DomainBlackList!==undefined && !this.Pause) {
            var whiteListed=false;
            if (this.WhiteList!==undefined && this.WhiteList!==null) {
                $.each(obj.WhiteList.split(','), function(index, item) {
                    if (location.href.indexOf(item)>0) {
                        whiteListed=true;
                        return;
                    }
                });
                if (whiteListed===true)  {
                    return;
                }
            }
            this.Pause=true;
            this.RemoveLinks();
            this.AllowDomChange();
            
        }   
    },
    AllowDomChange:function() {
        var obj=this;
        setTimeout(function () {
            obj.Pause=false; // Nach x Sekunden Änderungen wieder erlauben
        }, 500);
    },
    LoadLsrList:function() {
        var obj=this;
        
        chrome.runtime.sendMessage( {
            Action: "GetLsr"
        }, function (response)
        {
            obj.DomainBlacklist=response.List;
            obj.WhiteList=response.WhiteList;
            obj.Dom();
        });
    },
    RemoveItem:function($item) {
        $item.each(function(index,$element) {
            $element.remove();
        });
    },
    RemoveLinks:function() {
        var obj=this;
        var remove = function($el) {
            if (location.href.indexOf(".google.")>0) {
                var $parent=$el.closest('li.g');
                if ($parent!==undefined && $parent.length>0) {
                    obj.RemoveItem($parent);
                } else {
                    obj.RemoveItem($el);
                }
            } else {
                obj.RemoveItem($el);
            }
        };
        

        // Link:
        $('a').each(function(i, a) {
            obj.DomainBlacklist.forEach(function(domain) {
                if (a.href.indexOf(domain+"/") > -1 || a.href.substr(-1,1) === domain ) {
                    remove($(a));
                }
            });
        });
    }
};

var lsr=null;

$(document).ready(function ()
{
    lsr=new gpoLsr;
    lsr.Init();
});

 document.addEventListener("DOMSubtreeModified", function ()
{
    if (lsr!==null) {
        lsr.Dom();     
    }
});


