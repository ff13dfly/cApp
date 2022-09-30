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
        },
    };

    var self={
        show:function(params,data){
            //console.log(params);
            var RPC=App.cache.getG("RPC");
            var sel=$("#"+config.cls.entry);
            var css=self.getCSS();
            RPC.common.view(params.anchor,params.block,params.owner?params.owner:'',function(res){
                //console.log(res);
                if(res===false){
                    var dom=self.getDom('Error','No such anchor',params.anchor,'',0);
                }else{
                    var details=res.data.raw;
                    var ctx=App.tools.convert(details.content,{"page":"view","class":"text-info"});
                    var dom=self.getDom(details.title,ctx,res.name,res.owner,res.block);
                }
                sel.html(css+dom);
                App.fresh();
            });
            $("#"+config.cls.entry).html(`Loading anchor "${params.anchor}" data on ${params.block}`);
        },
        getCSS:function(){
            var cls=config.cls;
            return `<style>
                #${cls.entry} h3{color:#002222}
                .${cls.intro} {background:#FFFFEE;height:30px;}
            </style>`;
        },
        getDom:function(title,ctx,anchor,owner,block){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 pt-4 pb-2"><h3>${title}</h3></div>
                <div class="col-12 text-end ${cls.intro}">Auth: ${App.tools.shorten(owner,5)} on ${block} of ${anchor}</div>
                <div class="col-12 pt-2">${ctx}</div>
            </div>`;
        },
        //prepare the basic data when code loaded
        struct:function(){
            self.clsAutoset(config.prefix);
        },
        clsAutoset:function(pre){
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre+hash();
            }
            return true;
        },
    };

    var test={
        auto:function(){

        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"News details",     //default page title
            "raw":null,
            "params":{},
            "preload":"",
            "snap":"",
            "template":`<div id="${config.cls.entry}">Loading...</div>`,     //includindg dom and css, will add to body container,
        },      
        "events":{
            "before":function(params,data,ck){
                //console.log(`${config.name} event "before" param :${JSON.stringify(params)}`);
                ck && ck();
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