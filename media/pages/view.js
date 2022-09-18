/*
    {"type":"data","format":"JS"}
 */

(function(App){
    if(!App) return false;
    var config={
        name:'view',
        prefix:"cv_",
        cls:{
            entry:'cv_index',
            row:'',
            anchor:'',
        },
    };

    var self={
        show:function(params,data){
            console.log(params);
            console.log(data);

            var RPC=App.cache.getG("RPC");
            var sel=$("#"+config.cls.entry);
            RPC.common.view(params.block,params.anchor,params.owner,function(res){
                console.log(res);
                var details=res.raw.raw;
                
                var ctx=App.tools.convert(details.content,{"page":"view","class":"text-info"});
                var dom=self.getDom(details.title,ctx,res.name,res.owner,res.blocknumber);
                sel.html(dom);
                App.fresh();
            });
            $("#"+config.cls.entry).html(`Loading anchor "${params.anchor}" data on ${params.block}`);
        },
        getDom:function(title,ctx,anchor,owner,block){
            return `<div class="row">
                <div class="col-12"><h3>${title}</h3></div>
                <div class="col-12">Auth: ${App.tools.shorten(owner,5)} on ${block} of ${anchor}</div>
                <div class="col-12">${ctx}</div>
            </div>`;
        },
        //prepare the basic data when code loaded
        struct:function(){
            self.clsAutoset(config.prefix);
            //console.log(`Config:${JSON.stringify(config)}`);
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
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
        },      
        "events":{
            "before":function(params,ck){
                //console.log(`${config.name} event "before" param :${JSON.stringify(params)}`);
                //var dt={view:"world"};
                ck && ck();
            },
            "loading":function(params,data){
                //console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                //console.log(data);
                test.auto();        //test data, need to remove
                self.show(params,data);
            },
            "after":function(params,ck){
                //console.log(`${config.name} event "after" param :${JSON.stringify(params)}`);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);