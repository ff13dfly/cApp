; (function (App) {
    var RPC=App.cache.getG("RPC");
    var avs={};         //放avatart的缓存的
    var cmts={};        //放评论数据的地方

    var self={
        comment:function(comment,anchor,block,title,ck){
            var app_name = App.cache.getG("name");
            var link=!title?'Commet':title;
            var raw={
                "title":`#[${link}](anchor://${anchor}/${block})#`,
                "content":comment,
            };
            var proto={"type":"data","format":"JSON","app":app_name};

            if(RPC.extra.comment){
                App.toast("Ready to write to chain","info",{"position":"bottom"});
                RPC.extra.comment(comment,anchor,block,(res)=>{
                    App.toast("","clean");
                    return ck && ck();
                });
            }else{
                RPC.extra.verify(function(pair){
                    RPC.common.write(pair,mine,raw,proto,function(res){
                        //console.log(res);
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
        freshCount:function(list,force){
            for(var i=0;i<list.length;i++){
                var row=list[i],anchor=row[0],block=row[1];
                self.showCount(anchor,block,force);
            }
        },
        showCount:function(anchor,block,force){
            var id=`#${anchor}_${block}`;
            if(force || cmts[anchor]==undefined || cmts[anchor][block]==undefined){
                if(!cmts[anchor]) cmts[anchor]={};
                var svc="vSaying",fun="count",params={anchor:anchor,block:block};
                RPC.extra.auto(svc,fun,params,(res)=>{
                    cmts[anchor][block]=parseInt(res.count);
                    $(id).html(cmts[anchor][block]);
                });
            }else{
                $(id).html(cmts[anchor][block]);
            }
        },
    };

    App.cache.setG("common",self);
})(cMedia);