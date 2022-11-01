;(function(App){
    if(!App) return false;
    var config={
        name:'comment',
        prefix:"c",
        cls:{
            entry:'',
            anchor:'',
            block:'',
            relate:'',
            location:'',
            title:'',
            content:'',
            mine:'',
            cmtSum:'',
            cmtList:'',
        },
        page:{
            count:1,
            step:2,
            max:1,
        }
    };
    var cmts=App.cache.getG("commentCount");
    var RPC=App.cache.getG("RPC");
    var tpl=App.cache.getG("tpl");
    var self={
        show:function(params){
            self.render(params.title,params.anchor,params.block,params.owner); 
            self.listComments(params.anchor,params.block);  
            self.bind();
        },
        render:function(title,anchor,block,owner){
            var cls=config.cls;
            var sel=$("#"+cls.entry);
            sel.find('.'+cls.relate).html('#'+title+'#');
            sel.find('.'+cls.location).html(`${anchor} on block ${block},owned by ${App.tools.shorten(owner,8)}`);
            sel.find('.'+cls.title).val(title);
            sel.find('.'+cls.block).val(block);
            sel.find('.'+cls.anchor).val(anchor);
            sel.find('.'+cls.mine).val(anchor);
        },
        bind:function(){
            var cls=config.cls;
            var RPC = App.cache.getG("RPC");
            var app_name = App.cache.getG("name");

            $("#"+cls.add).off('click').on('click',function(){
                var anchor=$("#" + cls.entry).find('.'+cls.anchor).val().trim();
                var block=parseInt($("#" + cls.entry).find('.'+cls.block).val().trim());
                var title=$("#" + cls.entry).find('.'+cls.title).val().trim();
                var ctx=$("#" + cls.entry).find('.'+cls.content).val().trim();

                var mine=$("#" + cls.entry).find('.'+cls.mine).val().trim();
                if(!mine) return console.log("no anchor to record comment");
                var raw={
                    "title":`#[${title}](anchor://${anchor}/${block})#`,
                    "content":ctx,
                };
                var proto={"type":"data","format":"JSON","app":app_name};

                if(RPC.extra.comment){
                    RPC.extra.comment(ctx,anchor,block,(res)=>{
                        //console.log(res);
                        if(res.success){
                            cmts[anchor][block]=0;
                        }
                    });
                }else{
                    RPC.extra.verify(function(pair){
                        var link=RPC.common.write(pair,mine,raw,proto,function(res){
                            if(res.status.isInBlock){
                                link.then((unsub)=>{
                                    unsub();
                                    App.back();
                                });
                            }
                        });
                    });
                }
            });
        },
        listComments:function(anchor,block){
            const svc="vSaying",fun="list";
            const params={
                anchor:anchor,
                block:block,
                page:config.page.count,
                step:config.page.step,
            }
            RPC.extra.auto(svc,fun,params,(res)=>{
                var dom=self.structComments(res);
                $('#'+config.cls.cmtList).html(dom);
                self.bind();
                App.fresh();
            });
        },
        structComments:function(list){
            var cls=config.cls;
            var dom ='';
            for(var i=0;i<list.length;i++){
                var row=list[i];
                dom+=tpl.row(row,'comment');
            }
            return dom;
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
            var more=tpl.theme('comment',cls.entry);
            return `<style>${more}
                #${cls.entry} .${cls.cmtHead} {background:#F3F3F3;}
            </style>`;
        },
        getDom:function(){
            var cls=config.cls;
            return `<div class="row">
                    <div class="col-12 gy-2"><h5 class="${cls.relate}">#Title#<h5></div>
                    <div class="col-12 gy-2 ${cls.location}">Anchor on block 0</div>
                </div>
                <div class="row mt-4 pt-1 pb-1 ${cls.cmtHead}">
                    <div class="col-4">
                        Comments ( <span style="font-size:14px;" id="${cls.cmtSum}">0</span> )
                    </div>
                    <div class="col-8 text-end">
                        <span style="font-size:14px;">more...</span>
                    </div>
                </div>
                <div id="${cls.cmtList}"></div>

                <div class="row pt-4">
                    <div class="col-12 gy-2">
                        <textarea class="form-control ${cls.content}" placeholder="Adding comment..." rows="10"></textarea>   
                    </div>
                    <div class="col-6 gy-2">
                        <input type="text" class="form-control ${cls.mine}" disabled="disabled" value="" >
                    </div>
                    <div class="col-6 gy-2 text-end">
                        <input type="hidden" class="form-control ${cls.title}" disabled="disabled" value="" >
                        <input type="hidden" class="form-control ${cls.block}" disabled="disabled" value="" >
                        <input type="hidden" class="form-control ${cls.anchor}" disabled="disabled" value="" >
                        <button class="btn btn-md btn-primary" id="${cls.add}">Comment</button>
                    </div>
            </div>`;
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
            "before":function(params,ck){
                var result={code:1,message:"successful",overwrite:true};
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