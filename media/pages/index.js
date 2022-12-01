; (function (App) {
    if (!App) return false;
    var config = {
        name: "index",
        cache:App.cache.getG("setting"),      //cache anchor
        prefix: "i",
        max:10,                     //history max length
        cls: {
            entry: '',          
            add:'',             //add button class
        }
    };

    var cmts={},his=[];
    App.cache.setG("commentCount",cmts);
    var RPC = App.cache.getG("RPC");
    var tpl=App.cache.getG("tpl");
    var icons=App.cache.getG("icons");

    var self = {
        listening: function () {
            var name = App.cache.getG("name");
            RPC.common.subscribe(function(list) {
                if (list.length == 0) return false;
                
                var ls=[];
                for (var i = 0; i < list.length; i++){
                    var row = list[i];
                    if (row.protocol && row.protocol.type === "data" && row.protocol.app === name) {
                        ls.push(row);
                    }
                }

                if(ls.length!==0){
                    App.toast("New subcribe ...","info");
                    setTimeout(function(){
                        App.toast("","clean");
                        for (var i = 0; i < ls.length; i++) {
                            var row = ls[i];
                            self.pushHistory(row);
                            self.decode(row);
                            self.auto();
                        }
                    },1500);
                }
            });
        },
        showHistory:function(){
            var decode=self.decode;
            if(his.length===0){
                self.getLatest(config.cache,function(list){
                    for(var i=0;i<list.length;i++){
                        if(list[i].empty) continue;
                        his.push(list[i]);
                    }
                    for(var i=0;i<his.length;i++) decode(his[i]);
                    self.auto();
                });
            }else{
                for(var i=0;i<his.length;i++) decode(his[i]);
                self.auto();
            }
        },
        
        getLatest:function(anchor,ck){
            RPC.common.search(anchor,function(res){
                if(res.empty) return ck && ck([]);
                if(!res.raw || !res.raw.recommend)return ck && ck([]);
                var ans=res.raw.recommend;
                RPC.common.multi(ans,function(list){
                    ck && ck(list);
                });
            });
        },
        pushHistory:function(row){
            if(his.length>=config.max){
                his.shift();
                return this.pushHistory(row);
            }
            his.push(row);
        },
        
        decode: function (row) {
            if(!row.stamp) row.stamp=Date.now()-1001;
            self.setCmtAmount(row.name,row.block);
            var dom=tpl.row(row,'basic');
            $("#" + config.cls.entry).prepend(dom);
        },
        auto:function(){
            self.bind();
            self.getCount();
            App.fresh();        //fresh page to bind action 
        },
        bind:function(){
            //var cls=config.cls;
            
        },
        getCount:function(){
            var show=self.showCount;
            for(var anchor in cmts){
                var bs=cmts[anchor];
                for(var block in bs){
                    show(anchor,block,bs[block]);
                }
            }
        },
        showCount:function(anchor,block,n){
            var id=tpl.getID(anchor,block);

            if(n!==0) return $("#"+id).html(n);
            const svc="vSaying",fun="count";
            const params={
                anchor:anchor,
                block:block,
            }
            RPC.extra.auto(svc,fun,params,(res)=>{
                var count=res.count;
                self.setCmtAmount(anchor,block,count);
                $('#'+id).html(count);
            });
        },
        setCmtAmount:function(anchor,block,n){
            if(!cmts[anchor]) cmts[anchor]={};
            cmts[anchor][block]=!n?0:n;
            return true;
        },
        //prepare the basic data when code loaded
        struct: function () {
            var pre=config.prefix;  
            var hash = App.tools.hash;
            for (var k in config.cls) {
                if (!config.cls[k]) config.cls[k] = pre + hash();
            }
            page.data.preload=self.template();
            return true;       
        },
        template:function(){
            var css=self.getCSS();
            var add=self.getAdd();
            return `${css}<div id="${config.cls.entry}">${add}</div>`;
        },
        getCSS:function(){
            var cls=config.cls;
            var more=tpl.theme('basic',cls.entry);
            return `<style>${more}
                #${cls.entry} .${cls.add}{width:100px;height:48px;background:#F4F4F4;opacity: 0.9;position:fixed;right:20px;bottom:25%;border-radius:24px;border:2px solid #EF8889;line-height:48px;text-align: center;box-shadow: 3px 3px 3px #EF8889;}
                #${cls.entry} .${cls.add} img{opacity: 0.8;}
            </style>`;
        },
        getAdd:function(){
            var cls=config.cls;
            return `<div class="${cls.add}">
                <span page="write" data="{}">
                <img style="width:36px;height:36px;margin-bottom:5px;margin-left:5px;opacity: 0.4;" src="${icons.write}"></span>
            </div>`;
        },
    };

    var page = {
        "data": {
            "name": config.name,
            "title": "freeSaying",
            "params": {},
            "preload": "",
            "snap": "",
        },
        "events": {
            "before": function (params, ck) {
                var result={code:1,message:"successful"};
                //App.toast("testing","info");
                ck && ck(result);
            },
            "loading": function (params, ck) {
                //console.log(`History:${JSON.stringify(his)},Params:${JSON.stringify(params)}`);
                self.showHistory();
                self.listening();
                ck && ck();
            },
            "after": function (params, ck) {
                console.log('Index page after event');
                console.log(params);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name, page);
})(cMedia);