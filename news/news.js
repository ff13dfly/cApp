//Anchor App说明
//1.使用new Function的方式加载cApp，const anchorApp=new Function("agent", "con", str);
//2.传入3个参数 agent:polkadot处理网络的各种方法; con:dom容器的id ; jquery:jquery操作库

if(error!=null) console.log(error);
if(!con) console.log('No container to run cApp.');
if(!agent) console.log('No way to interact with anchor network.');
if($===undefined) console.log('No jquery exsist, exit cApp news.');

const container = con;
const hash = function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) };
const shorten=function(address,n){if (n === undefined) n = 10;return address.substr(0, n) + '...' + address.substr(address.length - n, n);};
const last=[];     //放最近的10条新闻，用于丰富页面
const cache={};
const config={
    app:'news',     //设置筛选的data内容
    cacheMax:10,    //cache的最大长度
    cls:{
        page:'a'+hash(),      //page容器的class
        header:'a'+hash(),    //page的头部容器
        back:'a'+hash(),      //弹出页面返回按钮的class
        title:'a'+hash(),     //弹出页面标题class
        sign:'a'+hash(),      //签名条class
        body:'a'+hash(),      //弹出页面容器class
    },
    thumb:{
        back:'',
    }
};

const self={
    appendNews:function(row){
        console.log(row);
        const ctx = row.raw;
        const cls_page='cc_'+hash();
        const cls_anchor='an_'+hash();
        const id="n_"+hash();
        let dom=`<div class="row" id="${id}" n="${row.block}" anchor="${row.anchor}">
            <div class="col-12 ${cls_page}"><h4>${ctx.title}</h4></div>
            <div class="col-12 ${cls_page}">${!ctx.desc?"":ctx.desc}</div>
            <div class="col-4">${shorten(row.account,4)}</div>
            <div class="col-8 text-end">
             Block : <strong>${row.block}</strong> , Anchor : <strong class="${cls_anchor}" anchor="${row.anchor}">${row.anchor}</strong> 
            </div>
            <div class="col-12"><hr /></div>
        </div>`;
        $("#"+container).prepend(dom);

        //1.设置cache；
        ctx.account=row.account;
        self.setCache(row.anchor,row.block,ctx);

        //2.增加点击
        $('#'+id).find('.'+cls_page).on('click',self.clickRow);
        $('#'+id).find('.'+cls_anchor).on('click',self.clickAnchor);
    },
    clickRow:function(){
        const anchor=$(this).parent().attr('anchor');
        const n=$(this).parent().attr('n');
        const dt=self.getCache(anchor,n);

        $('.'+config.cls.title).html(dt.title);
        $('.'+config.cls.sign).html(`5G...3f publish on block 1234 , 2022-06-20 09:36 `);
        $('.'+config.cls.body).html(dt.content);
        self.clickBack();
        self.showPage();
    },
    clickAnchor:function(){
        const anchor=$(this).attr('anchor');
        console.log(anchor);
    },
    clickBack:function(){
        $('.'+config.cls.back).off('click').on('click',self.hidePage);
    },
    getCache:function(anchor,n){
        const kk=anchor+'_'+n;
        if(cache[kk]) return cache[kk];
        return false;
    },
    setCache:function(anchor,n,data){
        const kk=anchor+'_'+n;
        cache[kk]=data;
        return true;
    },
    setLast:function(row){
        if(cache.length>=config.cacheMax){
            last.pop();
        }
        last.push(row);
    },
    showPage:function(){
        $('.'+config.cls.page).show();
    },
    hidePage:function(){
        $('.'+config.cls.page).hide();
    },
    loadPage:function(con){
        $(con).append(`<div class="${config.cls.page}">
            <div class="row ${config.cls.header}">
                <div class="col-12 ${config.cls.back}"> < </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-12"><h3 class="${config.cls.title}"></h3></div>
                    <div class="col-12 ${config.cls.sign}"></div>
                    <div class="col-12 ${config.cls.body}">Content</div>
                </div>
            </div>
        </div>`);
    },
    loadStyle: function(con){
        $(con).append(`<style>
            .${config.cls.page} {display:none;width:100%;height:100%;z-index:999;position:fixed;left:0px;top:0px;background:#FFFFFF}
            .${config.cls.header} {height:58px;width:100%;background:#EEEEEE;position:fixed;left:0px;top:0px;}
            .${config.cls.title} {margin-top:58px;}
            .${config.cls.back} {padding-top:15px;}
            .${config.cls.sign} {color:#BBBBBB}
        </style>`);
    },
    load:function(){
        $("#"+container).html('');
        self.loadPage("#"+container);
        self.loadStyle("#"+container);
        if(cache.length==0) return false;

        //1.开始加载cache里的新闻
        //agent.vertify('aaa','hello world',{type:"data"});
    },
}

self.load();        //加载已经有的新闻
console.log(agent);
agent.common.subscribe(function(list){
    //console.log('New block finalized.');
    if(list.length ==0) return false;
    for(let i=0;i<list.length;i++){
        const row=list[i];
        if(row.protocol && row.protocol.type==="data" && row.protocol.app===config.app){
            self.appendNews(row);
        }
    }
});