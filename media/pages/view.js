;(function(App){
    if(!App) return false;
    var config={
        name:'view',
        prefix:"cv_",
        cls:{
            entry:'cv_index',
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
        show:function(params,data){
            var RPC=App.cache.getG("RPC");
            RPC.common.view(params.anchor,params.block,params.owner?params.owner:'',function(res){
                console.log(res);
                if(res.empty){
                    self.render("Error",'No such anchor','null',params.anchor,params.block);
                }else{
                    var details=res.data.raw;
                    var ctx=App.tools.convert(details.content,{"page":"view","class":"text-info"});
                    console.log();
                    var owner=App.tools.shorten(res.owner,8);
                    self.render(details.title,ctx,owner,res.name,res.block);
                }
                self.bind();
                App.fresh();    //enable page link
            });
            //$("#"+config.cls.entry).html(`Loading anchor "${params.anchor}" data on ${params.block}`);
        },
        render:function(title,content,owner,anchor,block){
            var cls=config.cls;
            var sel=$("#"+cls.entry);
            sel.find('.'+cls.title).html(title);
            sel.find('.'+cls.content).html(content);
            sel.find('.'+cls.owner).html(owner);
            sel.find('.'+cls.name).html(anchor);
            sel.find('.'+cls.block).html(block);
        },

        bind:function(){
            console.log("binding comment action");
        },

        struct:function(){
            var pre=config.prefix;
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre+hash();
            }
            //console.log('view page struct:');
            //console.log(page.data.preload);              //only body
            page.data.preload=self.template();
            return true;
        },
        template:function(){
            // var title="Loading";
            // var ctx="Loading target content";
            // var anchor="anchor";
            // var owner="Checking";
            // var block=0;
            // return self.getDom(title,ctx,anchor,owner,block);
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

    var test={
        auto:function(){

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
            "before":function(params,data,ck){
                //console.log(`${config.name} event "before" param :${JSON.stringify(params)}`);
                //1.set before rending dom

                //2.set before function result;
                var fmt={code:1,message:"successful"};
                ck && ck(fmt);
            },
            "loading":function(params,data){
                //console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                //test.auto();        //test data, need to remove
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