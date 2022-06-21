//Anchor App说明
//1.使用new Function的方式加载cApp，const anchorApp=new Function("agent", "con", str);
//2.传入3个参数 agent:polkadot处理网络的各种方法; con:dom容器的id ; jquery:jquery操作库

const container = con;
const tools = agent.tools;

const hash = function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) };


const config={
    app:'editor',     //设置筛选的data内容
    cacheMax:10,    //cache的最大长度
    cls:{
        page:'w'+hash(),      //page容器的class
    }
}

console.log(agent);
agent.vertify('aaa','hello world',{type:"data"});

const self={
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
        console.log('Writer is ready.');
    },
}

self.load();  //自动加载部分