;(function(App){
    if(!App) return false;
    var config={
        name:'history',
        prefix:"h",
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
    };
    var RPC=App.cache.getG("RPC");
    var icons=App.cache.getG("icons");
    var self={
        show:function(params){
            var anchor=params.anchor;
            if(RPC.common.history){
                RPC.common.history(anchor,(list)=>{
                    var dom='';
                    for(var i=0;i<list.length;i++){
                        dom+=self.decode(list[i]);
                    }
                    $("#"+config.cls.entry).html(dom);
                    App.fresh();
                });
            }
        },       
        decode:function(row){
            var viewer=self.getRow(row);
            var opt=self.getOperation(row);
            return `<div class="row">
                ${viewer}${opt}
                <div class="col-12"><hr /></div>
            </div>`;
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
        //prepare the basic data when code loaded
        struct: function () {
            var pre=config.prefix;
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre+hash();
            }

            page.data.preload=self.template();
            return true;         
        },
        template:function(){
            var css=self.getCSS();
            var dom=self.getDom();
            return `${css}<div id="${config.cls.entry}"></div>`;
        },
        getCSS:function(){
            var cls=config.cls;
            return `<style>
                .${cls.account}{font-size:10px;color:#EF2356;}
                .${cls.info}{font-size:10px;}
            </style>`;
        },
        getDom:function(){
            var cls=config.cls;
            return ``;
        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"History details",     //default page title
            "params":{},
            "preload":"",
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