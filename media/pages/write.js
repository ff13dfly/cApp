;(function(App){
    if(!App) return false;
    var config={
        name:'write',
        prefix:"w",
        max:120,
        cls:{
            entry:'',
            title:'',
            content:'',
            desc:'',
            anchor:'',
            add:'',
            len:'',
        },
    };
    var RPC = App.cache.getG("RPC");
    var app_name = App.cache.getG("name");
    var uploader = App.cache.getG("uploader");

    var self={
        show:function(params){
            self.upload();
            self.bind();
        },
        upload:function(){
            //var con='#upload_con';
            var cfg={
                container:'upload_con',
            };
            var agent={
                change:function(cache){
                    //console.log(cache);
                },
            };
            uploader.init(cfg,agent);
        },
        bind:function(){
            var cls=config.cls;
            var sel=$("#" + cls.entry);

            sel.find('.'+cls.content).off('keyup').on('keyup',function(ev){
                const val=ev.target.value;
                sel.find('.'+cls.len).html(val.length);
            });

            $("#"+cls.add).off('click').on('click',function(){
                var ctx=sel.find('.'+cls.content).val().trim();
                var desc=App.tools.tailor(ctx);
                var anchor=sel.find('.'+cls.anchor).val().trim();
                if(!ctx) return sel.find('.'+cls.content).trigger('focus');
                if(!anchor) return sel.find('.'+cls.anchor).trigger('focus');

                self.disable(cls);

                var title='';
                var raw={
                    "title":!title?'':title,
                    "desc": desc,
                    "content":ctx,
                };
                var imgs=uploader.getResult();
                if(imgs.length!=0) raw.imgs=imgs;

                var proto={"type":"data","format":"JSON","app":app_name};
                RPC.extra.verify(function(pair){
                    if(!pair){
                        self.enable(cls);
                        return App.toast("","clean");
                    }
                    //console.log(pair);
                    //console.log('no pair?');
                    RPC.common.write(pair,anchor,raw,proto,function(res){
                        App.toast("Ready to write to Anchor chain","info");
                        if(res.status.isInBlock){
                            App.toast("","clean");
                            self.enable(cls);
                            self.clean(cls);
                            App.back();
                        }
                    });
                });
            });
        },
        clean:function(cls){
            var sel=$('#'+cls.entry);
            sel.find('.'+cls.content).val('');
            sel.find('.'+cls.anchor).val('');
            sel.find('.'+cls.len).html(0);
            uploader.clean();
        },
        disable:function(cls){
            var sel=$('#'+cls.entry);
            $("#"+cls.add).attr("disabled","disabled");
            sel.find("."+cls.content).attr("disabled","disabled");
            sel.find("."+cls.anchor).attr("disabled","disabled");
            uploader.disable();
        },
        enable:function(cls){
            var sel=$('#'+cls.entry);
            $("#"+cls.add).removeAttr("disabled");
            sel.find("."+cls.content).removeAttr("disabled");
            sel.find("."+cls.anchor).removeAttr("disabled");
            uploader.enable();
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
                #${cls.entry} .${cls.add}{width:100px;height:48px;background:#EFCCE9;opacity: 0.9;position:fixed;right:20px;bottom:25%;border-radius:24px;border:1px solid #EEFFFF;line-height:48px;text-align: center;}
            </style>`;
        },
        getDom:function(){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 gy-2">
                    <textarea class="form-control ${cls.content}" placeholder="Adding new content to anchor network..." rows="10"></textarea>   
                </div>
                <div class="col-12 gy-2"><span class="${cls.len}">0</span> / ${config.max}</div>
                <div class="col-6 gy-2 pb-3">
                    <input type="text" class="form-control ${cls.anchor}" placeholder="Anchor name..." value="" >
                </div>
                <div class="col-6 gy-2 pb-3 text-end">
                    <button class="btn btn-md btn-primary" id="${cls.add}">New Saying</button>
                </div>
                <!--<div class="col-12 gy-2">
                    <input type="text" class="form-control ${cls.title}" placeholder="Title..." value="" >  
                </div>-->
                <!--<div class="col-12 gy-2">
                     <textarea class="form-control ${cls.desc}" placeholder="Description..." rows="3"></textarea>   
                </div>-->
                <div class="col-12" id="upload_con"></div>
            </div>`;
        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"Add your content",     //default page title
            "params":{},
            "preload":"Loading...",
            "snap":"",
        },      
        "events":{
            "before":function(params,ck){
                var result={code:1,message:"successful"};
                ck && ck(result);
            },
            "loading":function(params){
                self.show(params);
            },
            "after":function(params,ck){
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);