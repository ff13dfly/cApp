;(function(App){
    if(!App) return false;
    var config={
        name:'auth',
        prefix:"s",
        cls:{
            entry:'',
        },
    };

    var self={
        show:function(params){
            console.log(params);
        },
        
        struct:function(){
            var pre=config.prefix;
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre + hash();
            }

            page.data.preload=self.template();
            return true;
        },
        template:function(){
            var css=self.getCSS();
            var dom=self.getDom();
            return `${css}<div id="${config.cls.entry}">${dom}</div>`;
        },
        getCSS:function(){
            var cls=config.cls;
            var cmap=`<style>
                #${cls.entry}{}
            </style>`;
            return cmap;
        },
        getDom:function(){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 gy-4 text-center"></div>
            </div>`;
        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"Auth center",     //default page title
            "params":{},
            "preload":"Loading...",
            "snap":"",
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