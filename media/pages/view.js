;(function(App){
    if(!App) return false;
    var config={
        name:'view',
        prefix:"v",
        cls:{
            entry:'',
            row:'',
            anchor:'',
            intro:'',
            owner:'',
            block:'',
            name:'',
            content:'',
            cmtContent:'',
            cmtTarget:'',
            cmtAdd:'',
        },
    };

    var self={
        show:function(params){
            var RPC=App.cache.getG("RPC");
            RPC.common.view(params.anchor,params.block,params.owner?params.owner:'',function(res){
                if(res.empty){
                    self.render("Error",'No such anchor','null',params.anchor,params.block);
                }else{
                    var details=res.data.raw;
                    var ctx=App.tools.convert(details.content,{"page":"view","class":"text-info"});
                    var igs=details.imgs&& details.imgs.length>0?self.domImages(details.imgs):'';
                    var owner=App.tools.shorten(res.owner,8);
                    self.render(details.title,(ctx+igs),owner,res.name,res.block);
                }
                self.bind();
                App.fresh();
            });
        },
        render:function(title,content,owner,anchor,block){
            var cls=config.cls;
            var sel=$("#"+cls.entry);
            sel.find('.'+cls.title).html(title);
            sel.find('.'+cls.content).html(App.tools.wrap(content));
            sel.find('.'+cls.owner).html(owner);
            sel.find('.'+cls.name).html(anchor);
            sel.find('.'+cls.block).html(block);
        },
        domImages:function(imgs){
            var len=imgs.length,num = 12/len;
            var dom='';
            for(var i=0;i<len;i++){
                var img=imgs[i];
                dom+=`<div class="col-${num}">
                    <p style="height:${450/len}px;background-image:url(${img});background-size: cover;"></p>
                </div>`;
            }
            return dom;
        },
        bind:function(){
            //console.log("binding comment action");
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
            var cmt=self.getComment();
            return `${css}<div id="${config.cls.entry}">${dom}${cmt}</div>`;
        },
        getCSS:function(){
            var cls=config.cls;
            return `<style>
                #${cls.entry} h3{color:#002222}
                .${cls.intro} {background:#FFFFEE;height:30px;}
            </style>`;
        },
        getDom:function(){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 pt-4 pb-2"><h3 class="${cls.title}">Loading</h3></div>
                <div class="col-12 text-end ${cls.intro}">Auth: <span class="${cls.owner}">null</span> on <span class="${cls.block}">0</span> of <span class="${cls.name}">null</span></div>
                <div class="col-12 pt-2 ${cls.content}"></div>
            </div>`;
        },
        getComment:function(){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 gy-2">
                    <textarea class="form-control ${cls.cmtContent}" placeholder="Comment..." rows="3"></textarea>
                </div>
                <div class="col-6 gy-2">
                    <input type="text" class="form-control ${cls.cmtTarget}" placeholder="Anchor name..." value="" >
                </div>
                <div class="col-6 gy-2 text-end">
                    <button class="btn btn-md btn-primary" id="${cls.cmtAdd}">Comment</button>
                </div>
            </div>`;
        },
    };

    var page={
        "data":{
            "name":config.name,         //page name
            "title":"News details",     //default page title
            "params":{},                //page params from call 
            "preload":"",               //preload template
            "snap":"",                  //loaded page dom struct
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