/*
    {"type":"data","format":"JS"}
*/

(function(App){
    if(!App) return false;
    var config={
        name:'history',
        prefix:"hs_",
        cls:{
            entry:'hs_index',
            account:'',
            info:'',
        },
    };

    var self={
        show:function(params,data){
            var anchor=params.anchor;
            var RPC=App.cache.getG("RPC");
            if(RPC.common.history){
                RPC.common.history(anchor,(list)=>{
                    var dom='';
                    for(var i=0;i<list.length;i++){
                        dom+=self.decode(list[i]);
                    }
                    $("#"+config.cls.entry).append(dom);
                    App.fresh();
                });
            }
        },
        
        decode:function(row){
            var cls=config.cls;
            return App.tools.convert(`<div class="row">
                <div class="col-3 pt-2 ${cls.info}" >Block :[${row.block}](anchor://${row.data.key}/${row.block}) </div>    
                <div class="col-9 pt-2 ${cls.account}">${App.tools.shorten(row.owner,12)}</div>
                <div class="col-12"><hr/></div>
            </div>`,{"page":"view","class":"text-info"});
        },
        
        //prepare the basic data when code loaded
        struct: function () {
            var pre=config.prefix;
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre+hash();
            }

            page.data.preload=self.template();
            return true;         
        },
        template:function(){
            var css=self.getCSS();
            var dom=self.getDom();
            return `${css}<div id="${config.cls.entry}"></div>`;
        },
        getCSS:function(){
            var cls=config.cls;
            return `<style>
                .${cls.account}{font-size:10px;color:#EF2356;}
                .${cls.info}{font-size:10px;}
            </style>`;
        },
        getDom:function(){
            var cls=config.cls;
            return ``;
        },
    };

    var test={
        auto:function(){

        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"History details",     //default page title
            "params":{},
            "preload":"",
            "snap":"",
        },      
        "events":{
            "before":function(params,data,ck){
                ck && ck();
            },
            "loading":function(params,data){
                //console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                test.auto();        //test data, need to remove
                self.show(params,data);
            },
            "after":function(params,data,ck){
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);