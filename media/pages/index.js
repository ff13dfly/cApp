; (function (App) {
    if (!App) return false;
    var config = {
        name: "index",
        cache:"cMediaNews",      //cache anchor
        prefix: "ii_",
        max:10,                     //history max length
        cls: {
            entry: 'ii_index',
            row: '',
            anchor: '',
            account:'',
            operation:'',
            block:'',
            add:'',             //add button class
        }
    };
    var his=[];
    var RPC = App.cache.getG("RPC");
    var self = {
        listening: function () {
            var cls=config.cls;
            var cmap = `<style>
                #${cls.entry} hr{color:#CCCCCC}
                .${cls.account}{font-size:10px;color:#EF8889;}
                .${cls.block}{font-size:10px;}
                .${cls.operation}{font-size:10px;}   
            </style>`;
            $("#" + config.cls.entry).prepend(cmap);
            var info = App.info();
            
            RPC.common.subscribe(function (list) {
                if (list.length == 0) return false;
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    if(!row.data) continue;
                    var data=row.data;
                    if (data.protocol && data.protocol.type === "data" && data.protocol.app === info.app) {
                        self.pushHistory(row);
                        self.decode(row);
                        App.fresh();
                    }
                }
            });
        },
        
        pushHistory:function(row){
            if(his.length>=config.max){
                his.shift();
                return this.pushHistory(row);
            }
            his.push(row);
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
                    App.fresh();
                });
            }else{
                for(var i=0;i<his.length;i++)decode(his[i]);
                App.fresh();
            }
        },
        getLatest:function(anchor,ck){
            RPC.common.search(anchor,function(res){
                if(res.owner===null) return ck && ck([]);
                if(!res.data || !res.data.raw || !res.data.raw.recommend)return ck && ck([]);
                var ans=res.data.raw.recommend;
                RPC.common.multi(ans,function(list){
                    ck && ck(list);
                });
            });
        },
        addButton:function(){
            var cls=config.cls;
            var dom=`<style>
                #${cls.entry} .${cls.add}{
                    width:100px;height:48px;background:#F4F4F4;opacity: 0.9;
                    position:fixed;right:20px;bottom:25%;border-radius:24px;border:1px solid #AAAAAA;
                    line-height:48px;text-align: center;box-shadow: 3px 3px 3px #BBBBBB;
                }
            </style>
            <div class="${cls.add}">
                <span page="write" data="{}"><img style="width:36px;height:36px;margin-bottom:5px;margin-left:5px;opacity: 0.4;" src="data:image/png;base64,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
"></span>
            </div>`;
            $("#" + cls.entry).append(dom);
        },
        decode: function (row) {
            var cls=config.cls;
            var dom=`<style>
                #${cls.entry} .${cls.add}{
                    width:100px;height:48px;background:#F4F4F4;opacity: 0.9;
                    position:fixed;right:20px;bottom:25%;border-radius:24px;border:1px solid #AAAAAA;
                    line-height:48px;text-align: center;box-shadow: 3px 3px 3px #BBBBBB;
                }
            </style>
            <div class="${cls.add}">
                <span page="write" data="{}"><img style="width:36px;height:36px;margin-bottom:5px;margin-left:5px;opacity: 0.4;" src="data:image/png;base64,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
"></span>
            </div>`;
            $("#" + cls.entry).append(dom);
        },
        decode: function (row) {
            var ctx = row.data.raw, cls = config.cls;
            var dt = { anchor: row.name, block: row.block, owner: row.owner };
            var dom = `<div class="row">
                <div class="col-12 pt-2 ${cls.row}" >
                    <span page="view" data='${JSON.stringify(dt)}'><h4>${ctx.title}</h4></span>
                </div>
                <div class="col-4 ${cls.account}">${App.tools.shorten(row.owner, 8)}</div>
                <div class="col-8 ${cls.block} text-end">
                 Block : <strong>${row.block}</strong> , 
                 Anchor : <strong class="${cls.anchor}"><span page="history" data='${JSON.stringify({ anchor: row.name })}'>${row.name}</span></strong> 
                </div>
                <div class="col-12 gy-2 ${cls.row}">
                    <span page="view" data='${JSON.stringify(dt)}'>${!ctx.desc ? "" : ctx.desc}</span>
                </div>
                
                <div class="col-3 gy-2 ${cls.operation}"><span page="share" data='${JSON.stringify(dt)}'>Share</span></div>
                <div class="col-3 gy-2 ${cls.operation}"><span page="comment" data='${JSON.stringify(dt)}'>Comment</span></div>
                <div class="col-3 gy-2 ${cls.operation}">Good</div>
                <div class="col-3 gy-2 ${cls.operation}">Fav</div>
                <div class="col-12"><hr /></div>
            </div>`;
            
            $("#" + cls.entry).prepend(dom);
        },

        cleanContainer:function(){
            var cls=config.cls;
            $("#"+cls.entry).html('');
        },

        //prepare the basic data when code loaded
        struct: function () {
            self.clsAutoset(config.prefix);         
        },
        clsAutoset: function (pre) {
            var hash = App.tools.hash;
            for (var k in config.cls) {
                if (!config.cls[k]) config.cls[k] = pre + hash();
            }
            return true;
        },
    };


    var test = {
        auto: function () {
            //test.row();
        }
    };


    var page = {
        "data": {
            "name": config.name,
            "title": "cMedia App",     //default page title
            "raw": null,
            "params": {},
            "preload": "Loading...",
            "snap": "",
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
        },
        "events": {
            "before": function (params, data, ck) {
                //console.log(`${config.name} event "before" param :${JSON.stringify(params)}`);
                //console.log('Before page loading...'+JSON.stringify(cache));
                var dt = { hello: "world" };
                ck && ck(dt);
            },
            "loading": function (params, data, ck) {
                //console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                //console.log(data);
                //test.auto();        //test data, need to remove
                self.addButton();
                self.showHistory();
                self.listening();
                App.fresh();
                ck && ck();
            },
            "after": function (params, data, ck) {
                //console.log(`${config.name} event "after" param :${JSON.stringify(params)}`);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name, page);
})(cMedia);