;(function(App){
    if(!App) return false;
    var config={
        name:'view',
        prefix:"v",
        cls:{
            entry:'',
            intro:'',
            title:'',
            account:'',
            stamp:'',
            avatar:'',
            content:'',
            cmtList:'',
            cmtHead:'',
            cmtPage:'',
            cmtContent:'',
            cmtSum:'',
            cmtAdd:'',
            cmtInfo:'',
            cmtBlock:'',
            cmtAnchor:'',
        },
        page:{
            count:1,
            step:3,         //comments amount after content
            max:1,
        }
    };
    var cmts=App.cache.getG("commentCount");
    var tpl=App.cache.getG("tpl");
    var RPC=App.cache.getG("RPC");
    var common=App.cache.getG("common");
    var icons=App.cache.getG("icons");

    var self={
        show:function(params){
            const anchor=params.anchor,block=params.block;
            $("#"+config.cls.cmtSum).html(cmts[anchor][block]);

            RPC.common.target(anchor,block,function(res){
                //console.log(res);
                if(res.empty){
                    self.render("Error",'No such anchor','null',anchor,block,0);
                    self.cmtRender('',0);
                }else{
                    var details=res.raw;
                    var ctx=App.tools.convert(details.content,{"page":"view","class":"text-info"});
                    var igs=details.imgs&& details.imgs.length>0?self.domImages(details.imgs):'';
                    var owner=App.tools.shorten(res.owner,8);
                    self.render(details.title,(ctx+igs),owner,res.owner,res.block,res.stamp);
                    self.cmtRender(res.name,block);
                    self.listComments(res.name,res.block);
                }
                self.bind();
                App.fresh();
            });
        },
        render:function(title,content,owner,origin,block,stamp){
            var cls=config.cls;
            var sel=$("#"+cls.entry);
            sel.find('.'+cls.title).html(title);
            sel.find('.'+cls.account).html(owner);

            //sel.find('.'+cls.avatar).attr("src",`https://robohash.org/${origin}.png`);

            sel.find('.'+cls.stamp).html(App.tools.time(stamp));
            sel.find('.'+cls.content).html(App.tools.wrap(content));
            sel.find('.'+cls.owner).html(owner);
            sel.find('.'+cls.block).html(block);

            common.getAvatar(origin,function(img){
                sel.find('.'+cls.avatar).attr("src",img.src);
            });
        },
        cmtRender:function(anchor,block){
            var cls=config.cls;
            var sel=$("#"+cls.entry);
            sel.find('.'+cls.cmtBlock).val(block);
            sel.find('.'+cls.cmtAnchor).val(anchor);

            sel.find('.'+cls.cmtPage).attr("page","board");
            sel.find('.'+cls.cmtPage).attr("data",JSON.stringify({anchor:anchor,block:block}));
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
                //console.log(res);
                var dom=self.structComments(res);
                $('#'+config.cls.cmtList).html(dom);
                self.bind();
                App.fresh();
            });
        },
        
        calcImages:function(img,index,ck){
            var ig=new Image();
            ig.src=img;
            ig.onload=function(res){
                ck && ck({index:index,size:[ig.width,ig.height]});
            };
        },
        bind:function(){
            var cls=config.cls;
            var sel=$("#"+cls.entry);
            sel.find('.'+cls.cmtAdd).off('click').on('click',function(){
                var data=self.getData();
                if(!data.anchor){
                    App.toast("No anchor to comment","info");
                    setTimeout(function(){
                        App.toast("","clean");
                    },1500);
                    return false;
                } 
                if(!data.comment){
                    sel.find("."+cls.cmtContent).focus();
                    return false;
                }
                sel.find("."+cls.cmtAdd).attr("disabled","disabled");
                var anchor=data.anchor,block=data.block;
                common.comment(data.comment,anchor,block,!data.title?'':data.title,function(){
                    sel.find("."+cls.cmtAdd).removeAttr("disabled");
                    self.listComments(anchor,block);
                });
            });
        },
        getData:function(){
            var cls=config.cls;
            var sel=$("#"+cls.entry);
            var ctx=sel.find('.'+cls.cmtContent).val().trim();
            var anchor=sel.find('.'+cls.cmtAnchor).val();
            var block=sel.find('.'+cls.cmtBlock).val();
            var title=sel.find('.'+cls.title).html().trim();
            //console.log(block);
            return {
                title:title,
                comment:ctx,
                anchor:anchor,
                block:block,
            };
        },
        domImages:function(imgs){
            var len=imgs.length;
            var dom='';
            for(var i=0;i<len;i++){
                var img=imgs[i];
                // self.calcImages(img,i,function(res){
                //     console.log(res);
                // });
                dom+=`<div class="col-12">
                    <img src="${img}" style="width:100%;" id="img_${i}">
                </div>`;
            }
            return dom;
        },
        structComments:function(list){
            var dom ='';
            for(var i=0;i<list.length;i++){
                var row=list[i];
                dom+=tpl.row(row,'comment');
            }
            return dom;
        },
        getCSS:function(){
            var cls=config.cls;
            var more=tpl.theme('comment',cls.entry);
            return `<style>${more}
                #${cls.entry}{padding-bottom:40px;}
                #${cls.entry} h3{color:#002222}
                #${cls.entry} .${cls.avatar} {widht:30px;height:30px;border-radius:15px;background:#FFAABB}
                #${cls.entry} .${cls.content} {font-weight:500;min-height:60px;}
                #${cls.entry} .${cls.cmtHead} {background:#F3F3F3;}
            </style>`;
        },
        struct:function(){
            var pre=config.prefix;
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre+hash();
            }
            page.data.preload=self.template();
            return true;
        },
        template:function(){
            var css = self.getCSS();
            var dom = self.getDom();
            var cmt=self.getDialog();
            return `${css}<div id="${config.cls.entry}">${dom}${cmt}</div>`;
        },
        
        getDom:function(){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 pt-4 pb-2"><h3 class="${cls.title}"></h3></div>
                <div class="col-8">
                    <img src="${icons.auth}" class="${cls.avatar}">
                    <!--<img src="https://robohash.org/null.png" class="${cls.avatar}">-->
                    <span class="${cls.account}">null</span>
                </div>
                <div class="col-4 text-end ${cls.stamp}"></div>
                <div class="col-12 pt-3 ${cls.content}"></div>
            </div>`;
        },
        
        getDialog:function(){
            var cls=config.cls;
            return `<div class="row mt-4 pt-1 pb-1 ${cls.cmtHead}">
                <div class="col-6">
                    Comments ( <span id="${cls.cmtSum}">0</span> )
                </div>
                <div class="col-6 text-end">
                    <span class="${cls.cmtPage}" page="" data=''>more...</span>
                </div>
            </div>
            <div id="${cls.cmtList}"></div>
            <div class="row pt-2">
                <div class="col-12 gy-2">
                    <textarea class="form-control ${cls.cmtContent}" placeholder="Your thinking about the article..." rows="3"></textarea>
                </div>
                <div class="col-8 gy-2 ${cls.cmtInfo}"></div>
                <div class="col-4 gy-2 text-end">
                    <input type="hidden" class="${cls.cmtAnchor}" value="">
                    <input type="hidden" class="${cls.cmtBlock}" value="">
                    <button class="btn btn-md btn-primary ${cls.cmtAdd}">Comment</button>
                </div>
            </div>`;
        },
    };

    var page={
        "data":{
            "name":config.name,         //page name
            "title":"Details",          //default page title
            "params":{},                //page params from call 
            "preload":"",               //preload template
            "snap":"",                  //loaded page dom struct
        },      
        "events":{
            "before":function(params,ck){
                //var result={code:1,message:"successful",overwrite:true};
                ck && ck();
            },
            "loading":function(params){
                App.title(`${params.anchor} on ${params.block}`);
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