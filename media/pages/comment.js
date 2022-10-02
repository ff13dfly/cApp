/*
    {"type":"data","format":"JS"}
 */

(function(App){
    if(!App) return false;
    var config={
        name:'comment',
        prefix:"c",
        cls:{
            entry:'',
            anchor:'',
            block:'',
            title:'',
            content:'',
            comment:'',
            add:'',
        },
    };

    var self={
        show:function(params,data){
            self.bind();
        },
        
        bind:function(){
            var cls=config.cls;
            var RPC = App.cache.getG("RPC");
            var info = App.info();
            $("#"+cls.add).off('click').on('click',function(){
                var anchor=$("#" + cls.entry).find('.'+cls.anchor).val().trim();
                var title=$("#" + cls.entry).find('.'+cls.title).val().trim();
                var ctx=$("#" + cls.entry).find('.'+cls.content).val().trim();
                var block=parseInt($("#" + cls.entry).find('.'+cls.block).val().trim());
                var raw={
                    "content":ctx,
                    "title":`#${title}#`,
                    "desc":`Comment anchor [${anchor}] on ${block}`,
                };
                raw[info.app]={follow:anchor,block:block};
                var proto={"type":"data","format":"JSON","app":info.app};
                RPC.extra.verify(function(pair){
                    var link=RPC.common.write(pair,('cmt_'+anchor),raw,proto,function(res){
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
        struct: function () {
            var pre = config.prefix;
            var hash = App.tools.hash;
            for (var k in config.cls) {
                if (!config.cls[k]) config.cls[k] = pre + hash();
            }

            page.data.preload = self.template();
            return true;
        },
        template: function () {
            var css = self.getCSS();
            var dom = self.getDom();
            return `${css}<div id="${config.cls.entry}">${dom}</div>`;
        },
        getCSS:function(){
            var cls=config.cls;
            return `<style>
            </style>`;
        },
        getDom:function(){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 gy-2">
                    <textarea class="form-control ${cls.content}" placeholder="Adding comment..." rows="10"></textarea>   
                </div>
                <div class="col-6 gy-2">
                    <input type="text" class="form-control ${cls.anchor}" disabled="disabled" value="" >
                </div>
                <div class="col-6 gy-2 text-end">
                    <input type="hidden" class="form-control ${cls.title}" disabled="disabled" value="" >
                    <input type="hidden" class="form-control ${cls.block}" disabled="disabled" value="" >
                    <button class="btn btn-md btn-primary" id="${cls.add}">Comment</button>
                </div>
            </div>`;
        },
    };

    var test={
        auto:function(){

        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"Anchor comment",     //default page title
            "params":{},
            "preload":"",
            "snap":"",
        },      
        "events":{
            "before":function(params,data,ck){
                ck && ck();
            },
            "loading":function(params,data){
                //console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                test.auto();        //test data, need to remove
                self.show(params,data);
            },
            "after":function(params,data,ck){
                //console.log(`${config.name} event "after" param :${JSON.stringify(params)}`);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);