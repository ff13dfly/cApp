; (function (App) {
    var RPC=App.cache.getG("RPC");
    var avs={};         //放avatart的缓存的
    
    var self={
        comment:function(comment,anchor,block,title,ck){
            var app_name = App.cache.getG("name");
            var cmts=App.cache.getG("commentCount");
            var link=!title?'Commnet':title;
            var raw={
                "title":`#[${link}](anchor://${anchor}/${block})#`,
                "content":comment,
            };
            var proto={"type":"data","format":"JSON","app":app_name};

            if(RPC.extra.comment){
                App.toast("Ready to write to chain","info");
                RPC.extra.comment(comment,anchor,block,(res)=>{
                    console.log(res);
                    if(res.success){
                        if(!cmts[anchor]) cmts[anchor]={};
                        if(!cmts[anchor][block])cmts[anchor][block]=0;
                        cmts[anchor][block]=0;
                    }
                    App.toast("","clean");
                    return ck && ck();
                });
            }else{
                RPC.extra.verify(function(pair){
                    RPC.common.write(pair,mine,raw,proto,function(res){
                        console.log(res);
                        if(res.status.isInBlock){
                            return ck && ck();
                        }
                    });
                });
            }
        },
        getAvatar:function(ss58,ck){
            if(!avs[ss58]){
                var img = new Image();
                img.src = `https://robohash.org/${ss58}.png`;
                img.onload=function(ee){
                    avs[ss58]=img;
                    return ck && ck(avs[ss58]);
                };
                return true;
            }
            ck && ck(avs[ss58]);
        },
    };

    App.cache.setG("common",self);
})(cMedia);