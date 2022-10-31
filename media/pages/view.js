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
            cmtList:'',
            cmtContent:'',
            cmtTarget:'',
            cmtAdd:'',
            cmtInfo:'',
            cmtBlock:'',
            cmtAnchor:'',
        },
        page:{
            count:1,
            step:20,
            max:1,
        }
    };
    var cmts=App.cache.getG("commentCount");
    var RPC=App.cache.getG("RPC");
    var self={
        show:function(params){
            RPC.common.view(params.anchor,params.block,params.owner?params.owner:'',function(res){
                if(res.empty){
                    self.render("Error",'No such anchor','null',params.anchor,params.block);
                }else{
                    var details=res.data.raw;
                    var ctx=App.tools.convert(details.content,{"page":"view","class":"text-info"});
                    var igs=details.imgs&& details.imgs.length>0?self.domImages(details.imgs):'';
                    var owner=App.tools.shorten(res.owner,8);
                    self.render(details.title,(ctx+igs),owner,res.name,res.block);
                    self.listComments(res.name,res.block);
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
        structComments:function(list){
            var dom ='';
            for(var i=0;i<list.length;i++){
                var row=list[i];
                //console.log(row);
                var raw=JSON.parse(row.data.raw);
                var protocol=JSON.parse(row.data.protocol);
                dom+=`<div class="row">${row.block}:${protocol.auth}<br>${raw.content}</div>`;
            }
            return dom;
        },
        domImages:function(imgs){
            var len=imgs.length,num = 12/len;
            var dom='';
            var count=0;
            for(var i=0;i<len;i++){
                var img=imgs[i];
                self.calcImages(img,i,function(){

                });
                dom+=`<div class="col-${num}">
                    <p style="height:${450/len}px;background:#FFFFFF url(${img}) no-repeat;background-size:contain;"></p>
                </div>`;
            }
            return dom;
        },
        calcImages:function(img,index,ck){
            var ig=new Image();
            ig.src=img;
            ig.onload=function(res){
                console.log(res);
                console.log(`Size:[${ig.width},${ig.height}]`);
                ck && ck({index:index,size:[ig.width,ig.height]});
            };
        },
        bind:function(){
            var cls=config.cls;
            $("#"+cls.entry).find('#'+cls.cmtAdd).off('click').on('click',function(){
                var data=self.getData();
                console.log("ready to add comments");
                console.log(data);
            });
        },
        getData:function(){
            return {
                comment:'',
                anchor:'',
                block:0,
            };
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
            var list=self.getList();
            var cmt=self.getComment();
            return `${css}<div id="${config.cls.entry}">${dom}${list}${cmt}</div>`;
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
        getList:function(){
            var cls=config.cls;
            return `<div id="${cls.cmtList}"></div>`;
        },
        getComment:function(){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 gy-2">
                    <textarea class="form-control ${cls.cmtContent}" placeholder="Comment..." rows="3"></textarea>
                </div>
                <div class="col-8 gy-2 ${cls.cmtInfo}">
                    
                </div>
                <div class="col-4 gy-2 text-end">
                    <input type="hidden" class="${cls.cmtAnchor}" value="">
                    <input type="hidden" class="${cls.cmtBlock}" value="">
                    <button class="btn btn-md btn-primary" id="${cls.cmtAdd}">Comment</button>
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