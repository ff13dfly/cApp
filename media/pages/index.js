; (function (App) {
    if (!App) return false;
    var config = {
        name: "index",
        prefix: "ii_",
        max:10,             //history max length
        cls: {
            entry: 'ii_index',
            row: '',
            anchor: '',
            account:'',
            block:'',
            add:'',             //add button class
        }
    };
    var his=[];
    var self = {
        listening: function () {
            var cls=config.cls;
            var cmap = `<style>
                .${cls.account}{font-size:10px;color:#EF2356;}
                .${cls.block}{font-size:10px;}
            </style>`;
            $("#" + config.cls.entry).prepend(cmap);
            var info = App.info();
            var RPC = App.cache.getG("RPC");
            RPC.common.subscribe(function (list) {
                if (list.length == 0) return false;
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];   
                    if (row.protocol && row.protocol.type === "data" && row.protocol.app === info.app) {
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
            for(var i=0;i<his.length;i++){
                decode(his[i]);
            }
            App.fresh();
        },
        addButton:function(){
            var cls=config.cls;
            var dom=`<style>
                #${cls.entry} .${cls.add}{
                    width:100px;height:48px;background:#EFCCE9;opacity: 0.9;
                    position:fixed;right:20px;bottom:25%;border-radius:24px;border:1px solid #EEFFFF;
                    line-height:48px;text-align: center;
                }
            </style>
            <div class="${cls.add}">
                <span page="write" data="{}">Write</span>
            </div>`;
            $("#" + cls.entry).append(dom);
        },
        decode: function (row) {
            var ctx = row.raw, cls = config.cls;
            var dt = { anchor: row.anchor, block: row.block, owner: row.account };
            var dom = `<div class="row">
                <div class="col-12 pt-2 ${cls.row}" >
                    <span page="view" data='${JSON.stringify(dt)}'><h4>${ctx.title}</h4></span>
                </div>
                <div class="col-12 ${cls.row}">
                    <span page="view" data='${JSON.stringify(dt)}'>${!ctx.desc ? "" : ctx.desc}</span>
                </div>
                <div class="col-4 ${cls.account}">${App.tools.shorten(row.account, 4)}</div>
                <div class="col-8 ${cls.block} text-end">
                 Block : <strong>${row.block}</strong> , 
                 Anchor : <strong class="${cls.anchor}"><span page="history" data='${JSON.stringify({ anchor: row.anchor })}'>${row.anchor}</span></strong> 
                </div>
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
            test.row();
        },
        row: function () {
            var row = {
                anchor: "fNews",
                block: 127,
                account: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
                raw: {
                    title: "Break news! Test cMedia",
                    desc: "The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.",
                    content: "A good news, this is the content.",
                },
            };
            self.decode(row);

            var row = {
                anchor: "测试中文",
                block: 122,
                account: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
                raw: {
                    title: "标题里有中文Test cMedia again",
                    desc: "描述里有中文Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.",
                    content: "正文里有中文A good news, this is the content.",
                },
            };
            self.decode(row);

            var row = {
                anchor: "format",
                block: 117,
                account: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
                raw: {
                    title: "Break news! Test cMedia again",
                    desc: "Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.",
                    content: "A good news, this is the content.",
                },
            };
            self.decode(row);

            App.fresh();
        },
    };


    var page = {
        "data": {
            "name": config.name,
            "title": "cMedia App",     //default page title
            "raw": null,
            "params": {},
            "preload": "Loading...",
            "snap": "",
            "template": `<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
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
                test.auto();        //test data, need to remove
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