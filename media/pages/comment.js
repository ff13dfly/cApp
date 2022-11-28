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
            title:'',
            content:'',
            add:'',
            mine:'',
            cmtList:'',
        },
        page:{
            count:1,
            step:3,
            max:1,
        }
    };
    var common=App.cache.getG("common");
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
            sel.find('.'+cls.title).val(title);
            sel.find('.'+cls.block).val(block);
            sel.find('.'+cls.anchor).val(anchor);
            sel.find('.'+cls.mine).val(anchor);         //设置当前anchor
        },
        bind:function(){
            var cls=config.cls;
            var app_name = App.cache.getG("name");
            var sel=$("#"+cls.entry);
            sel.find("."+cls.add).off('click').on('click',function(){
                var anchor=sel.find('.'+cls.anchor).val().trim();
                var block=parseInt(sel.find('.'+cls.block).val().trim());
                var title=sel.find('.'+cls.title).val().trim();
                var ctx=sel.find('.'+cls.content).val().trim();

                var mine=sel.find('.'+cls.mine).val().trim();
                if(!mine) return console.log("no anchor to record comment");
                $(this).attr("disabled","disabled");

                common.comment(ctx,anchor,block,title,function(){
                    sel.find("."+cls.add).removeAttr("disabled");
                    App.back();
                });
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
                if(res.length==0) return self.hideHeader();
                self.showHeader();
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
        hideHeader:function(){
            var cls=config.cls;
            $('#'+cls.entry).find('.'+cls.cmtHead).hide();
        },
        showHeader:function(){
            var cls=config.cls;
            $('#'+cls.entry).find('.'+cls.cmtHead).show();
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
                </div>
                <div class="row mt-4 pt-1 pb-1 ${cls.cmtHead}" style="display:none">
                    <div class="col-12">
                        Recent comments
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
                        <button class="btn btn-md btn-primary ${cls.add}">Comment</button>
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
                self.hideHeader();
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);