;(function(App){
    if(!App) return false;
    var RPC = App.cache.getG("RPC");
    var config={
        name:'auth',
        prefix:"s",
        cls:{
            entry:'',
        },
        page:{
            count:1,
            step:15,
            max:1,
        }
    };
    
    var self={
        show:function(params){
            //console.log(RPC);
            if(!RPC.extra.auto){
                App.toast('No vServer to get data.');
                return App.back();
            }
            App.toast('Ready to get data.');
            self.list(params.auth,self.fill);
            
        },
        fill:function(list){
            var cls=config.cls;
            var dom='';
            for(var i=0;i<list.length;i++){
                var row=list[i];
                console.log(row);
                dom+=`<div class="col-12">${row.anchor} @ ${row.block}</div>
                <div class="col-12">概要内容在这</div>
                `;
            }
            $('#'+cls.entry).html(dom);
        },
        list:function(auth,ck){
            var svc="vAuth",fun="list";
            var params={
                account:auth,
                page:config.page.count,
                step:config.page.step,
            }
            RPC.extra.auto(svc,fun,params,(res)=>{
                ck && ck(res);
            });
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