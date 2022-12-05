;(function(App){
    if(!App) return false;
    var config={
        name:'history',
        prefix:"h",
        cls:{
            entry:'',
        },
    };
    var RPC=App.cache.getG("RPC");
    var tpl=App.cache.getG("tpl");
    var self={
        show:function(params){
            var anchor=params.anchor;
            if(RPC.common.history){
                RPC.common.history(anchor,(res)=>{
                    var list=!res?[]:res;
                    self.listHistory(list);
                    App.fresh();
                });
            }
        },
        listHistory:function(list){
            var dom='';
            for(var i=0;i<list.length;i++){
                var row=list[i];
                dom+=tpl.row(row,'history');
            }

            $("#"+config.cls.entry).html(dom);
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
            var more=tpl.theme('history',cls.entry);
            return `<style>${more}
                #${cls.entry}{}
            </style>`;
        },
        getDom:function(){
            //var cls=config.cls;
            return ``;
        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"Anchor history",     //default page title
            "params":{},
            "preload":"",
            "snap":"",
        },      
        "events":{
            "before":function(params,ck){
                ck && ck();
            },
            "loading":function(params){
                App.title(params.anchor+" history");
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