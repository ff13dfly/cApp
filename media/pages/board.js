;(function(App){
    if(!App) return false;
    var config={
        name:'board',
        prefix:"bd",
        cls:{
            entry:'',
            title:'',
            target:'',
            location:'',
            pos:'',
            details:'',
            icon:'',
            list:'',
            content:'',
            anchor:'',
            block:'',
            add:'',
            info:'',
            container:'',
            len:'',
            more:'',
            extend:'',
        },
        page:{
            count:1,
            step:4,
            max:0,
        }
    };
    var RPC=App.cache.getG("RPC");
    var tpl=App.cache.getG("tpl");
    var common=App.cache.getG("common");
    var icons=App.cache.getG("icons");

    var self={
        show:function(params){
            //console.log(params);
            self.render(params.anchor,params.block,params.title);
            self.list(params.anchor,params.block);
            
        },
        render:function(anchor,block,title){
            var cls=config.cls,sel=$('#'+cls.entry);
            sel.find('.'+cls.details).html(title);
            sel.find('.'+cls.target).html(anchor);
            sel.find('.'+cls.pos).html(parseInt(block).toLocaleString());
            sel.find('.'+cls.anchor).val(anchor);
            sel.find('.'+cls.block).val(block);
        },
        list:function(anchor,block,append){
            const svc="vSaying",fun="list";
            const params={
                anchor:anchor,
                block:block,
                page:config.page.count,
                step:config.page.step,
            }
            RPC.extra.auto(svc,fun,params,(res)=>{
                var list=(!res || res.error)?[]:res.list;
                var nav=(!res || res.error)?[]:res.nav;
                //console.log(res);
                if(nav.max)config.page.max=nav.max;

                var cls=config.cls;
                var dom=self.domComments(list);
                if(append){
                    $('#'+cls.entry).find("."+cls.list).append(dom);
                }else{
                    $('#'+cls.entry).find("."+cls.list).html(dom);
                }
                (config.page.max===0 || config.page.max===1) ?self.hideMore(cls):self.showMore(cls);
                self.bind();
                App.fresh();
            });
        },
        domComments:function(list){
            var dom ='';
            var cmts=[];
            for(var i=0;i<list.length;i++){
                var row=list[i];
                cmts.push([row.name,row.block]);
                dom+=tpl.row(row,'comment');
            }
            setTimeout(function(){
                common.freshCount(cmts);
            },50);
            return dom;
        },
        bind:function(){
            var cls=config.cls;
            var sel=$('#'+cls.entry);

            sel.find('.'+cls.content).off('keyup').on('keyup',function(ev){
                const val=ev.target.value;
                sel.find('.'+cls.len).html(val.length);
            });

            sel.find("."+cls.add).off('click').on('click',function(){
                var anchor=sel.find('.'+cls.anchor).val();
                var block= parseInt(sel.find('.'+cls.block).val());
                var comment=sel.find('.'+cls.content).val().trim();
                if(!comment){
                    return  sel.find('.'+cls.content).trigger('focus');
                }

                self.disable(cls);
                common.comment(comment,anchor,block,'',function(){
                    self.enable(cls);
                    self.clean(cls);
                    self.list(anchor,block);
                });
            });

            sel.find('.'+cls.more).off('click').on('click',function(){
                if(config.page.max==0) return false;
                if(config.page.count>config.page.max){
                    config.page.max=0;
                    return false;
                }
                if(config.page.max==config.page.count) return false;

                config.page.count++;
                var anchor=sel.find('.'+cls.anchor).val();
                var block= parseInt(sel.find('.'+cls.block).val());
                self.list(anchor,block,true);
            });
        },
        showMore:function(cls){
            $('#'+cls.entry).find("."+cls.more).show();
        },
        hideMore:function(cls){
            $('#'+cls.entry).find("."+cls.more).hide();
        },
        showInput:function(cls){
            $('#'+cls.entry).find("."+cls.container).show();
        },
        hideInput:function(cls){
            $('#'+cls.entry).find("."+cls.container).hide();
        },
        clean:function(cls){
            var sel=$('#'+cls.entry);
            sel.find('.'+cls.content).val('');
            sel.find('.'+cls.len).html(0);
        },
        disable:function(cls){
            var sel=$('#'+cls.entry);
            sel.find("."+cls.content).attr("disabled","disabled");
            sel.find("."+cls.add).attr("disabled","disabled");
        },
        enable:function(cls){
            var sel=$('#'+cls.entry);
            sel.find("."+cls.content).removeAttr("disabled");
            sel.find("."+cls.add).removeAttr("disabled");
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
        beforeBack:function(params){
            
            //console.log(`After:${JSON.stringify(params)}`);
            var cls=config.cls,sel=$('#'+cls.entry);
            var anchor=sel.find('.'+cls.anchor).val();
            var block= parseInt(sel.find('.'+cls.block).val());
            //console.log(`anchor:${anchor},block:${block}`);
            self.hideInput(cls);
            common.freshCount([[anchor,block]],true);
            self.show(params);
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
                #${cls.entry} .${cls.icon} {widht:14px;height:14px;margin:-2px 2px 0px 4px;opacity:0.7;}
                #${cls.entry} .${cls.location} {font-size:10px;}
                #${cls.entry} .${cls.details} {color:#000000;}
                #${cls.entry} .${cls.extend} {padding-bottom:160px;}
                #${cls.entry} .${cls.more} {display:none;}
                #${cls.entry} .${cls.container} {display:none;position:fixed;left:0px;bottom:64px;background:#FFFFFF;width:100%;padding:5px 3% 5px 3%;}
            </style>`;
        },
        getDom:function(){
            var cls=config.cls;
            return `<div class="row ${cls.title}">
                <div class="col-2 pt-4 ${cls.location}">Original</div>
                <div class="col-10 pt-4 text-end ${cls.location}">
                    <img class="${cls.icon}" src="${icons.anchor}"> <span class="${cls.target}"></span><img class="${cls.icon}" src="${icons.block}"> <span class="${cls.pos}"></span>
                </div>
                <div class="col-12 pt-2 ${cls.details}"></div>
                <div class="col-12"><hr /></div>
            </div>
            <div class="${cls.list}"></div>
            <div class="row ${cls.extend}">
                <div class="col-12 pt-4 text-center">
                    <button class="btn btn-block btn-info btn-md ${cls.more}">Load more comments</button>
                </div>
            </div>
            <div class="${cls.container}">
                <div class="row">
                    <div class="col-12 pt-4">
                        <textarea class="form-control ${cls.content}" placeholder="Your thinking about the article..." rows="3"></textarea>
                    </div>
                    <div class="col-8 pt-2 ${cls.info}">
                        <span class="${cls.len}">0</span> / 120
                    </div>
                    <div class="col-4 pt-2 text-end">
                        <input type="hidden" class="${cls.anchor}" value="">
                        <input type="hidden" class="${cls.block}" value="">
                        <button class="btn btn-md btn-primary ${cls.add}">Comment</button>
                    </div>
                </div>
            </div>`;
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
                self.hideInput(config.cls);
                config.page.count=1;
                config.page.max=0;
                var result={code:1,message:"successful",overwrite:true};
                ck && ck(result);
            },
            "loading":function(params,ck){
                
                self.show(params);
                ck && ck();
            },
            "done":function(){
                self.showInput(config.cls);
            },
            "after":function(params,ck){
                config.page.count=1;
                config.page.max=0;
                self.beforeBack(params);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);