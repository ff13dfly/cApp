//Anchor App说明
//1.使用new Function的方式加载cApp，const anchorApp=new Function("agent", "con", str);
//2.传入3个参数 agent:polkadot处理网络的各种方法; con:dom容器的id ; jquery:jquery操作库

//console.log(Arguments);
const container = con;
const tools = agent.tools;

const hash = function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) };


const config={
    app:'editor',   //设置筛选的data内容
    cacheMax:10,    //cache的最大长度
    cls:{
        page:'w'+hash(),      //page容器的class
    }
};

if($===undefined) console.log('No jquery exsist, cEditor will not run properly.');
let editor=null;

const self={
    load:function(){

    },
}

self.load();  //自动加载部分