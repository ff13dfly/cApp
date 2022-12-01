;(function(App){
    if(!App) return false;
    var config={
        name:'board',
        prefix:"bd",
        cls:{
            entry:'',
            title:'',
            list:'',
            content:'',
            anchor:'',
            block:'',
            add:'',
            info:'',
        },
        page:{
            count:1,
            step:15,
            max:1,
        }
    };
    var RPC=App.cache.getG("RPC");
    var tpl=App.cache.getG("tpl");
    var common=App.cache.getG("common");

    var self={
        show:function(params){
            //console.log(params);
            self.render(params.anchor,params.block,params.title);
            self.list(params.anchor,params.block);
        },
        render:function(anchor,block,title){
            var cls=config.cls,sel=$('#'+cls.entry);
            var ctx=`<p>${title}<br>${anchor} on ${block}</p>`;
            sel.find('.'+cls.title).html(ctx);
            sel.find('.'+cls.anchor).val(anchor);
            sel.find('.'+cls.block).val(block);
        },
        list:function(anchor,block){
            const svc="vSaying",fun="list";
            const params={
                anchor:anchor,
                block:block,
                page:config.page.count,
                step:config.page.step,
            }
            RPC.extra.auto(svc,fun,params,(res)=>{
                var cls=config.cls;
                var dom=self.domComments(res);
                $('#'+cls.entry).find("."+cls.list).html(dom);
                self.bind();
                App.fresh();
            });
        },
        domComments:function(list){
            var dom ='';
            for(var i=0;i<list.length;i++){
                var row=list[i];
                dom+=tpl.row(row,'comment');
            }
            return dom;
        },
        bind:function(){
            var cls=config.cls;
            var sel=$('#'+cls.entry);
            sel.find("."+cls.add).off('click').on('click',function(){
                var anchor=sel.find('.'+cls.anchor).val();
                var block= parseInt(sel.find('.'+cls.block).val());
                var comment=sel.find('.'+cls.content).val().trim();
                sel.find("."+cls.add).attr("disabled","disabled");

                common.comment(comment,anchor,block,'',function(){
                    sel.find("."+cls.add).removeAttr("disabled");
                    sel.find('.'+cls.content).val('');
                    self.list(anchor,block);
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
            var more=tpl.theme('comment',cls.entry);
            return `<style>${more}
                #${cls.entry}{padding-bottom:40px;}
                #${cls.entry} .${cls.cmtHead} {background:#F3F3F3;}
            </style>`;
        },
        getDom:function(){
            var cls=config.cls;
            return `<div class="${cls.title}"></div>
            <div class="${cls.list}"></div>
                <div class="row">
                    <div class="col-12 pt-4">
                        <textarea class="form-control ${cls.content}" placeholder="Your thinking about the article..." rows="3"></textarea>
                    </div>
                    <div class="col-8 pt-2 ${cls.info}"></div>
                    <div class="col-4 pt-2 text-end">
                        <input type="hidden" class="${cls.anchor}" value="">
                        <input type="hidden" class="${cls.block}" value="">
                        <button class="btn btn-md btn-primary ${cls.add}">Comment</button>
                    </div>
                </div>
                `;
        },
    };
    
    var page={
        "data":{
            "name":config.name,
            "title":"Comment Board",     //default page title
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
                // console.log(`After:${JSON.stringify(params)}`);
                // var cls=config.cls;
                // var sel=$('#'+cls.entry);
                // var anchor=sel.find('.'+cls.anchor).val();
                // var block= parseInt(sel.find('.'+cls.block).val());
                // console.log(`anchor:${anchor},block:${block}`);

                self.show(params);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);