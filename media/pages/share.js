/*
    {"type":"data","format":"JS"}
 */

(function(App){
    if(!App) return false;
    var config={
        name:'share',
        prefix:"ss_",
        cls:{
            entry:'ss_index',
            qr:'',
        },
    };

    var self={
        show:function(params,data){
            var cls=config.cls;
            var dom=`<style>
                #${cls.entry} .${cls.qr}{width:360px;height:360px;background:#BBBBBB;margin:0 auto;}
            </style>
            <div class="row">
                <div class="col-12 gy-2 text-center">
                    <p class="${cls.qr}"></p>
                </div>
            </div>`;
            $("#" + cls.entry).html(dom);
        },
        struct:function(){
            var pre=config.prefix;
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre + hash();
            }
            return true;
        }
    };

    var test={
        auto:function(){

        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"Share Anchor",     //default page title
            "raw":null,
            "params":{},
            "preload":"Loading...",
            "snap":"",
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
        },      
        "events":{
            "before":function(params,data,ck){
                ck && ck();
            },
            "loading":function(params,data){
                test.auto();
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