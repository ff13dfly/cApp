; (function (App) {
    var RPC=App.cache.getG("RPC");
    var self={
        comment:function(comment,anchor,block,title,ck){
            var app_name = App.cache.getG("name");
            var cmts=App.cache.getG("commentCount");
            var raw={
                "title":`#[${title}](anchor://${anchor}/${block})#`,
                "content":comment,
            };
            var proto={"type":"data","format":"JSON","app":app_name};

            if(RPC.extra.comment){
                App.toast("Ready to write to chain","info");
                RPC.extra.comment(comment,anchor,block,(res)=>{
                    if(res.success){
                        cmts[anchor][block]=0;
                    }
                    App.toast("","clean");
                    return ck && ck();
                });
            }else{
                RPC.extra.verify(function(pair){
                    RPC.common.write(pair,mine,raw,proto,function(res){
                        if(res.status.isInBlock){
                            return ck && ck();
                        }
                    });
                });
            }
        },
    };

    App.cache.setG("common",self);
})(cMedia);