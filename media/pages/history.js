;(function(App){
    if(!App) return false;
    var config={
        name:'history',
        prefix:"h",
        cls:{
            entry:'',
            row: '',
            anchor: '',
            account:'',
            operation:'',
            thumbs:'',
            fav:'',
            cmtCount:'',
            block:'',
            add:'',             //add button class
        },
    };
    var RPC=App.cache.getG("RPC");
    var tpl=App.cache.getG("tpl");
    var self={
        show:function(params){
            var anchor=params.anchor;
            if(RPC.common.history){
                RPC.common.history(anchor,(list)=>{
                    var dom='';
                    for(var i=0;i<list.length;i++){
                        var row=list[i];
                        dom+=tpl.row(row,config.cls,'normal');
                    }

                    $("#"+config.cls.entry).html(dom);
                    App.fresh();
                });
            }
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

    var page={
        "data":{
            "name":config.name,
            "title":"History details",     //default page title
            "params":{},
            "preload":"",
            "snap":"",
        },      
        "events":{
            "before":function(params,ck){
                ck && ck();
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