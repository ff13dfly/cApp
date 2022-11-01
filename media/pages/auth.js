;(function(App){
    if(!App) return false;
    var config={
        name:'auth',
        prefix:"s",
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
        page:{
            count:1,
            step:15,
            max:1,
        }
    };
    //var cmts=App.cache.getG("commentCount");
    var RPC=App.cache.getG("RPC");
    var icons=App.cache.getG("icons");

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
            var dom=''
;            for(var i=0;i<list.length;i++){
                var row=list[i];
                var viewer=self.getRow(row);
                var opt=self.getOperation(row);
                dom+=`<div class="row">
                        ${viewer}${opt}
                        <div class="col-12"><hr /></div>
                    </div>`;
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
        getRow:function(row){
            var cls = config.cls;
            var ctx=row.data;
            var dt = { anchor: row.anchor, block: row.block };
            var igs=ctx.imgs && ctx.imgs.length>0?self.getImages(ctx.imgs):'';
            var ss="opacity:0.7;";
            return `<div class="col-12 pt-2 ${cls.row}" >
                <span page="view" data='${JSON.stringify(dt)}'><h5>${ctx.title}</h5></span>
            </div>
            <div class="col-4 ${cls.account}">
                owner SS58;
            </div>
            <div class="col-8 ${cls.block} text-end">
            <img style="widht:10px;height:10px;margin:-2px 6px 0px 0px;${ss}" src="${icons.block}"><strong>${row.block}</strong> , 
            <img style="widht:12px;height:12px;margin:-2px 0px 0px 0px;${ss}" src="${icons.anchor}">
                <span page="history" data='${JSON.stringify({ anchor: row.anchor })}'><strong>${row.anchor}</strong></span></strong> 
            </div>
            <div class="col-12 gy-2 ${cls.row}">
                <span page="view" data='${JSON.stringify(dt)}'>${!ctx.desc ? "" : ctx.desc}</span>
            </div>
                <span page="view" data='${JSON.stringify(dt)}'>${igs}</span>`;
        },
        getOperation:function(row){
            var ctx = row.data.raw, cls = config.cls;
            var cmt= { anchor: row.anchor, block: row.block};
            var dt=JSON.stringify(cmt);
            return `<div class="col-12 text-end gy-2 ${cls.operation}">
                <span page="comment" data='${dt}'>
                    <img style="widht:21px;height:21px;" src="${icons.comment}">
                </span>
                <span class="${cls.cmtCount}" id="${row.name}_${row.block}">0</span>
            </div>`;
        },
        getImages:function(imgs){
            var len=imgs.length,num = 12/len;
            var dom='';
            for(var i=0;i<len;i++){
                var img=imgs[i];
                dom+=`<div class="col-${num}">
                    <p style="height:${300/len}px;background:#FFFFFF url(${img}) no-repeat;background-size:contain;"></p>
                </div>`;
            }
            return dom;
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
                #${cls.entry} hr{color:#CCCCCC}
                #${cls.entry} .${cls.account}{font-size:10px;color:#EF8889;}
                #${cls.entry} .${cls.block}{font-size:10px;}
                #${cls.entry} .${cls.operation}{font-size:10px;}
                #${cls.entry} .${cls.add}{width:100px;height:48px;background:#F4F4F4;opacity: 0.9;position:fixed;right:20px;bottom:25%;border-radius:24px;border:1px solid #AAAAAA;line-height:48px;text-align: center;box-shadow: 3px 3px 3px #BBBBBB;}
                #${cls.entry} .${cls.add} img{opacity: 0.8;}
                #${cls.entry} .${cls.cmtCount}{margin-top:4px;}
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