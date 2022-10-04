; (function (App) {
    if (!App) return false;
    var config = {
        name: 'share',
        prefix: "s",
        cls: {
            entry: '',
            qr: '',
        },
    };

    var self = {
        show: function (params) {
            self.bind();
        },
        
        bind:function(){
            var cls = config.cls;
        },

        //autorun methon when page app loaded
        struct: function () {
            var pre = config.prefix;
            var hash = App.tools.hash;
            for (var k in config.cls) {
                if (!config.cls[k]) config.cls[k] = pre + hash();
            }

            page.data.preload = self.template();
            return true;
        },
        //group dom and css function
        template: function () {
            var css = self.getCSS();
            var dom = self.getDom();
            return `${css}<div id="${config.cls.entry}">${dom}</div>`;
        },
        //css collection
        getCSS: function () {
            var cls = config.cls;
            var cmap = `<style>
                    #${cls.entry} .${cls.qr}{width:360px;height:360px;background:#BBBBBB;margin:0 auto;}
                </style>`;
            return cmap;
        },
        //dom structure
        getDom: function () {
            var cls = config.cls;
            return `<div class="row">
                    <div class="col-12 gy-4 text-center">
                        <p class="${cls.qr}"></p>
                    </div>
                </div>`;
        },
    };

    var test = {
        auto: function () {

        },
    };

    var page = {
        "data": {
            "name": config.name,
            "title": "Share Anchor",     //default page title
            "params": {},
            "preload": "Loading...",
            "snap": "",
        },
        "events": {
            "before": function (params, ck) {
                //console.log(`${config.name} event "before" param :${JSON.stringify(params)}`);
                //console.log('Before page loading...'+JSON.stringify(cache));
                var dt = { hello: "world" };
                ck && ck(dt);
            },
            "loading": function (params) {
                //console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                self.showHistory();
                self.listening();
                App.fresh();
                ck && ck();
            },
            "after": function (params, ck) {
                //console.log(`${config.name} event "after" param :${JSON.stringify(params)}`);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name, page);
})(cMedia);