;(function(App){
    if(!App) return false;
    var config={
        name:'share',
        prefix:"s",
        cls:{
            entry:'ss_index',
            qr:'',
        },
    };

    var self={
        show:function(params){

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
                #${cls.entry} .${cls.qr}{width:360px;height:360px;background:#BBBBBB;margin:0 auto;}
            </style>`;
            return cmap;
        },
        getDom:function(){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-12 gy-4 text-center">
                    <p class="${cls.qr}"></p>
                </div>
            </div>`;
        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"Share Anchor",     //default page title
            "params":{},
            "preload":"Loading...",
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