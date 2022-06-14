//Anchor App说明
//1.使用new Function的方式加载cApp，const anchorApp=new Function("agent", "con", "jquery", str);
//2.传入3个参数 agent:polkadot处理网络的各种方法; con:dom容器的id ; jquery:jquery操作库
const search = agent.search; //搜索anchor的方法
const viewer = agent.view;
const writer = agent.write;
const tools = agent.tools;
const container = con;
const $ = jquery;

const self={
    appendNews:function(data){
        let dom=`hello`;
        $(container).prepend(dom);
    },
}

$(container).html('Subscribe news, waiting...');

agent.subscribe(function(list){
    if(list.length ==0) return false;
    console.log('have data anchor');
    for(let i=0;i<list.length;i++){
        const row=list[i];
        if(row.protocol && row.protocol.type==="data" && row.protocol.app==="news"){
            console.log('have anchor of news');
            self.appendNews(row);
        }
    }
});