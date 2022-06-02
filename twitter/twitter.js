//Anchor App说明
//1.执行逻辑，anchorApp已经在调用的时候创建了变量，使用eval执行这个问题。这样，anchorApp就作为程序启动的入口了
//2. 传入3个参数 pok:polkadot网络读取的方法; con:dom容器的id ; jquery:jquery操作库

let search = null; //搜索anchor的方法
let viewer = null; //查看anchor的方法
let writer = null; //写入anchor的方法
let signer = null; //用户验证的页面调用
let tools = null; //上部提供的解析工具
let subscribe = null; //监听的方法
let $ = null; //jquery的数据

const hash = function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) };
const setting = {
    container: 'cn_' + hash(3),
    row: 'rr_' + hash(),
};

//{"std":"twitter","content":"the first twitter"}

const self = {
    listening: function() {
        subscribe(function(list) {
            const dom = self.structRows(list);
            if (!!dom) $('#' + setting.container).prepend(dom);
        });
    },
    structRows: function(list) {
        const toStr = tools.hex2str;
        const shorten = tools.shortenAddress;
        let dom = '';
        for (let i = 0; i < list.length; i++) {
            const row = list[i];
            if (row.protocol.type != 'data') continue; //过滤费数据类型的anchor

            const raw = toStr(row.raw);
            if (!raw) continue;
            const ctx = JSON.parse(raw);
            if (!ctx) continue;

            console.log(ctx);

            dom += `<div class="${setting.row}"}>
            <p>${ctx.content}</p>
            <p class="text-end">
                <small>Anchor:</small>${row.anchor} |
                <small>Auth:</small>${shorten(row.account,4)} | 
                <small>Block:</small>${row.block}<hr></p>
            </div>`;
        }
        return dom;
    },
    loadStyle: function(con) {
        var dom = `<style>
            .${setting.cls.row} small{color:#FFEEEE}
        </style>`;
        $(con).append(dom);
    },
}
anchorApp = function(agent, con, jquery) {
    search = agent.search;
    viewer = agent.view;
    writer = agent.write;
    tools = agent.tools;
    subscribe = agent.subscribe;
    $ = jquery;

    //console.log(agent);

    self.listening();

    $(con).html(`<div id="${setting.container}"></div>`);
};