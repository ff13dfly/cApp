; (function (App) {
    if (!App) return false;
    var config = {
        name: "index",
        cache:"cMediaNews",      //cache anchor
        prefix: "i",
        max:10,                     //history max length
        cls: {
            entry: '',
            row: '',
            anchor: '',
            account:'',
            operation:'',
            thumbs:'',
            fav:'',
            block:'',
            add:'',             //add button class
        }
    };
    var his=[];
    var RPC = App.cache.getG("RPC");
    var self = {
        listening: function () {
            var name = App.cache.getG("name");
            RPC.common.subscribe(function (list) {
                if (list.length == 0) return false;
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    if(!row.data) continue;
                    var data=row.data;
                    if (data.protocol && data.protocol.type === "data" && data.protocol.app === name) {
                        self.pushHistory(row);
                        self.decode(row);
                        self.bind();
                        App.fresh();
                    }
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
                    self.bind();
                    App.fresh();
                });
            }else{
                for(var i=0;i<his.length;i++)decode(his[i]);
                self.bind();
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
        pushHistory:function(row){
            if(his.length>=config.max){
                his.shift();
                return this.pushHistory(row);
            }
            his.push(row);
        },
        decode: function (row) {
            var viewer=self.getRow(row);
            var opt=self.getOperation(row);
            var dom = `<div class="row">
                ${viewer}${opt}
                <div class="col-12"><hr /></div>
            </div>`;
            
            $("#" + config.cls.entry).prepend(dom);
        },
        getRow:function(row){
            var ctx = row.data.raw, cls = config.cls;
            var dt = { anchor: row.name, block: row.block, owner: row.owner };
            return `<div class="col-12 pt-2 ${cls.row}" >
                <span page="view" data='${JSON.stringify(dt)}'><h4>${ctx.title}</h4></span>
            </div>
            <div class="col-4 ${cls.account}">${App.tools.shorten(row.owner, 8)}</div>
            <div class="col-8 ${cls.block} text-end">
            Block : <strong>${row.block}</strong> , 
            Anchor : <strong class="${cls.anchor}"><span page="history" data='${JSON.stringify({ anchor: row.name })}'>${row.name}</span></strong> 
            </div>
            <div class="col-12 gy-2 ${cls.row}">
                <span page="view" data='${JSON.stringify(dt)}'>${!ctx.desc ? "" : ctx.desc}</span>
            </div>`;
        },
        getOperation:function(row){
            var ctx = row.data.raw, cls = config.cls;
            var cmt= { anchor: row.name, block: row.block, owner: row.owner,title:ctx.title };
            var dt=JSON.stringify(cmt);
            return `<div class="col-12 text-end gy-2 ${cls.operation}">
                <span page="comment" data='${dt}'>
                    <img style="widht:21px;height:21px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY0OTI3MDY1NzE4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxNjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTE1Ny41NjggNzUxLjI5NmMtMTEuMDA4LTE4LjY4OC0xOC4yMTg2NjctMzEuMjIxMzMzLTIxLjgwMjY2Ny0zNy45MDkzMzNBNDI0Ljg4NTMzMyA0MjQuODg1MzMzIDAgMCAxIDg1LjMzMzMzMyA1MTJDODUuMzMzMzMzIDI3Ni4zNjI2NjcgMjc2LjM2MjY2NyA4NS4zMzMzMzMgNTEyIDg1LjMzMzMzM3M0MjYuNjY2NjY3IDE5MS4wMjkzMzMgNDI2LjY2NjY2NyA0MjYuNjY2NjY3LTE5MS4wMjkzMzMgNDI2LjY2NjY2Ny00MjYuNjY2NjY3IDQyNi42NjY2NjdhNDI0Ljc3ODY2NyA0MjQuNzc4NjY3IDAgMCAxLTIxOS4xMjUzMzMtNjAuNTAxMzM0IDI3ODYuNTYgMjc4Ni41NiAwIDAgMC0yMC4wNTMzMzQtMTEuNzY1MzMzbC0xMDQuNDA1MzMzIDI4LjQ4Yy0yMy44OTMzMzMgNi41MDY2NjctNDUuODAyNjY3LTE1LjQxMzMzMy0zOS4yODUzMzMtMzkuMjk2bDI4LjQzNzMzMy0xMDQuMjg4eiBtNjUuMzAxMzMzIDMuNzg2NjY3bC0xNy4yNTg2NjYgNjMuMzA2NjY2IDYzLjMwNjY2Ni0xNy4yNTg2NjZhMzIgMzIgMCAwIDEgMjQuNTIyNjY3IDMuMjEwNjY2IDQ1MTUuODQgNDUxNS44NCAwIDAgMSAzMi4zNTIgMTguOTQ0QTM2MC43ODkzMzMgMzYwLjc4OTMzMyAwIDAgMCA1MTIgODc0LjY2NjY2N2MyMDAuMjk4NjY3IDAgMzYyLjY2NjY2Ny0xNjIuMzY4IDM2Mi42NjY2NjctMzYyLjY2NjY2N1M3MTIuMjk4NjY3IDE0OS4zMzMzMzMgNTEyIDE0OS4zMzMzMzMgMTQ5LjMzMzMzMyAzMTEuNzAxMzMzIDE0OS4zMzMzMzMgNTEyYzAgNjAuNTg2NjY3IDE0Ljg0OCAxMTguOTU0NjY3IDQyLjgyNjY2NyAxNzEuMTM2IDMuNzEyIDYuOTEyIDEyLjkyOCAyMi44MjY2NjcgMjcuMzcwNjY3IDQ3LjIzMmEzMiAzMiAwIDAgMSAzLjMzODY2NiAyNC43MTQ2Njd6IG0xNDUuOTk0NjY3LTcwLjc3MzMzNGEzMiAzMiAwIDEgMSA0MC45MTczMzMtNDkuMjA1MzMzQTE1OS4xODkzMzMgMTU5LjE4OTMzMyAwIDAgMCA1MTIgNjcyYzM3Ljg4OCAwIDczLjY3NDY2Ny0xMy4xNzMzMzMgMTAyLjE4NjY2Ny0zNi44ODUzMzNhMzIgMzIgMCAwIDEgNDAuOTE3MzMzIDQ5LjIxNkEyMjMuMTc4NjY3IDIyMy4xNzg2NjcgMCAwIDEgNTEyIDczNmEyMjMuMTc4NjY3IDIyMy4xNzg2NjcgMCAwIDEtMTQzLjEzNi01MS42OTA2Njd6IiBwLWlkPSIyMTY3Ij48L3BhdGg+PC9zdmc+">
                </span>
            </div>`;
            //return `<div class="col-3 gy-2 ${cls.operation}"><span page="share" data='${dt}'>Share</span></div>
            //<div class="col-3 gy-2 ${cls.operation}"><span page="comment" data='${dt}'>Comment</span></div>
            //<div class="col-3 gy-2 ${cls.operation} ${cls.thumbs}"><p data='${dt}'>Good</p></div>
            //<div class="col-3 gy-2 ${cls.operation} ${cls.fav}"><p data='${dt}'>Fav</p></div>`;
        },
        bind:function(){
            var cls=config.cls;
            $("#"+cls.entry).find('.'+cls.thumbs).off('click').on('click',function(){
                console.log('thumbs up by ');       //实名点赞
            });

            $("#"+cls.entry).find('.'+cls.fav).off('click').on('click',function(){
                console.log('fav');
            });
        },
        //prepare the basic data when code loaded
        struct: function () {
            var pre=config.prefix;  
            var hash = App.tools.hash;
            for (var k in config.cls) {
                if (!config.cls[k]) config.cls[k] = pre + hash();
            }
            //console.log(config);

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
            var cmap = `<style>
                #${cls.entry} hr{color:#CCCCCC}
                .${cls.account}{font-size:10px;color:#EF8889;}
                .${cls.block}{font-size:10px;}
                .${cls.operation}{font-size:10px;}
                #${cls.entry} .${cls.add}{width:100px;height:48px;background:#F4F4F4;opacity: 0.9;position:fixed;right:20px;bottom:25%;border-radius:24px;border:1px solid #AAAAAA;line-height:48px;text-align: center;box-shadow: 3px 3px 3px #BBBBBB;}
                #${cls.entry} .${cls.add} img{opacity: 0.8;}   
            </style>`;
            return cmap;
        },
        getAdd:function(){
            var cls=config.cls;
            return `<div class="${cls.add}">
                <span page="write" data="{}">
                <img style="width:36px;height:36px;margin-bottom:5px;margin-left:5px;opacity: 0.4;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY0OTI3MTMzNzUxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzMDUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTg2Mi43MDkzMzMgMTE2LjA0MjY2N2EzMiAzMiAwIDEgMSA0NS4yNDggNDUuMjQ4TDQ1NS40NDUzMzMgNjEzLjgxMzMzM2EzMiAzMiAwIDEgMS00NS4yNTg2NjYtNDUuMjU4NjY2TDg2Mi43MDkzMzMgMTE2LjA1MzMzM3pNODUzLjMzMzMzMyA0NDhhMzIgMzIgMCAwIDEgNjQgMHYzNTJjMCA2NC44LTUyLjUzMzMzMyAxMTcuMzMzMzMzLTExNy4zMzMzMzMgMTE3LjMzMzMzM0gyMjRjLTY0LjggMC0xMTcuMzMzMzMzLTUyLjUzMzMzMy0xMTcuMzMzMzMzLTExNy4zMzMzMzNWMjI0YzAtNjQuOCA1Mi41MzMzMzMtMTE3LjMzMzMzMyAxMTcuMzMzMzMzLTExNy4zMzMzMzNoMzQxLjMzMzMzM2EzMiAzMiAwIDAgMSAwIDY0SDIyNGE1My4zMzMzMzMgNTMuMzMzMzMzIDAgMCAwLTUzLjMzMzMzMyA1My4zMzMzMzN2NTc2YTUzLjMzMzMzMyA1My4zMzMzMzMgMCAwIDAgNTMuMzMzMzMzIDUzLjMzMzMzM2g1NzZhNTMuMzMzMzMzIDUzLjMzMzMzMyAwIDAgMCA1My4zMzMzMzMtNTMuMzMzMzMzVjQ0OHoiIHAtaWQ9IjIzMDYiPjwvcGF0aD48L3N2Zz4="></span>
            </div>`;
        },
    };

    var page = {
        "data": {
            "name": config.name,
            "title": "cMedia App",
            "params": {},
            "preload": "",
            "snap": "",
        },
        "events": {
            "before": function (params, ck) {
                var result={code:1,message:"successful"};
                ck && ck(result);
            },
            "loading": function (params, ck) {
                self.showHistory();
                self.listening();
                ck && ck();
            },
            "after": function (params, ck) {
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name, page);
})(cMedia);