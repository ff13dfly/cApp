/*
    {"type":"data","format":"JS"}
 */

(function(App){
    if(!App) return false;
    var config={
        name:'write',
        prefix:"ww_",
        cls:{
            entry:'ww_index',
            title:'',
            content:'',
            anchor:'',
            add:'',
        },
    };

    var self={
        show:function(params,data){
            var cls=config.cls;
            var dom=`<style>
                #${cls.entry} .${cls.add}{
                    width:100px;height:48px;background:#EFCCE9;opacity: 0.9;
                    position:fixed;right:20px;bottom:25%;border-radius:24px;border:1px solid #EEFFFF;
                    line-height:48px;text-align: center;
                }
            </style>
            <div class="row">
                <div class="col-12 gy-2">
                    <input type="text" class="form-control ${cls.title}" placeholder="Title..." value="" >  
                </div>
                <div class="col-12 gy-2">
                    <textarea class="form-control ${cls.content}" placeholder="Adding new content to anchor network..." rows="10"></textarea>   
                </div>
                <div class="col-6 gy-2">
                    <input type="text" class="form-control ${cls.anchor}" placeholder="Anchor name..." value="" >
                </div>
                <div class="col-6 gy-2 text-end">
                    <button class="btn btn-md btn-primary" id="${cls.add}">Add</button>
                </div>
            </div>`;
            $("#" + cls.entry).html(dom);
            self.bind();
        },
        bind:function(){
            var cls=config.cls;
            var RPC = App.cache.getG("RPC");
            var info = App.info();
            $("#"+cls.add).off('click').on('click',function(){
                var title=$("#" + cls.entry).find('.'+cls.title).val().trim();
                var ctx=$("#" + cls.entry).find('.'+cls.content).val().trim();
                var anchor=$("#" + cls.entry).find('.'+cls.anchor).val().trim();
                var raw={
                    "title":title,
                    "desc": ctx,
                    "content":ctx,
                };
                var proto={"type":"data","format":"JSON","app":info.app};
                RPC.extra.verify(function(pair){
                    var link=RPC.common.write(pair,anchor,raw,proto,function(res){
                        if(res.status.isInBlock){
                            link.then((unsub)=>{
                                unsub();
                                App.back();
                            });
                        }
                    });
                });
            });
        },
        struct:function(){
            var pre=config.prefix;
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre + hash();
            }
            return true;
        }
    };

    var test={
        auto:function(){

        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"Add your content",     //default page title
            "raw":null,
            "params":{},
            "preload":"Loading...",
            "snap":"",
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
        },      
        "events":{
            "before":function(params,data,ck){
                ck && ck();
            },
            "loading":function(params,data){
                test.auto();   
                self.show(params,data);
            },
            "after":function(params,data,ck){
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);