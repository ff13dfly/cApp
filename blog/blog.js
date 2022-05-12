//Anchor App说明
//1.执行逻辑，anchorApp已经在调用的时候创建了变量，使用eval执行这个问题。这样，anchorApp就作为程序启动的入口了
//2. 传入3个参数 pok:polkadot网络读取的方法; con:dom容器的id ; jquery:jquery操作库

let search = null; //搜索anchor的方法
let viewer = null; //查看anchor的方法
let writer = null; //写入anchor的方法
let signer = null; //用户验证的页面调用
let tools = null; //上部提供的解析工具
let subcribe = null; //监听的方法
let $ = null; //jquery的数据

const hash = function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) };
const setting = {
    entry: 'blog_list', //blog程序的入口，获取对应的数据列表；
    loadingDelay: 1500, //显示内容的delay
    cls: {
        row: 'aa_' + hash(), //条目的class
    }
};
const self = {
    getBlogAnchor: function(name, ck) {
        search(name, function(res) {
            if (res.blocknumber === 0) return ck && ck(false);
            viewer(res.blocknumber, res.anchor, res.owner, function(dt) {
                //console.log(dt);
                dt.blocknumber = res.blocknumber;
                dt.owner = res.owner;
                ck && ck(dt);
            });
        });
    },
    getBlogList: function(list, ck, count, result) {
        //console.log(list);
        //console.log(count);
        if (count === undefined) {
            let index = 0;
            let result = [];
        } else {

        }
        let index = count === undefined ? 0 : count;
        let anchorList = result === undefined ? [] : result;

        //console.log('ready to get anchor data.');
        //console.log(list[index]);
        self.getBlogAnchor(list[index], function(res) {
            //console.log('get blog data:');
            //console.log(res);
            res.name = list[index];
            anchorList.push(res);
            index++;
            if (index === list.length) return ck && ck(anchorList);
            self.getBlogList(list, ck, index, anchorList);
        });
    },
    formatList: function(list) {
        const toStr = tools.hex2str;
        const shorten = tools.shortenAddress;
        let dom = '';
        for (let i = 0; i < list.length; i++) {
            const row = list[i];
            console.log(row);
            if (!row.raw) continue;
            const ctx = JSON.parse(toStr(row.raw));
            dom += `<div class="${setting.cls.row}" link=${ctx.link?ctx.link:''}><h3>${ctx.title}</h3>
            <p>${ctx.content}</p>
            <p class="text-end">
                <small>Anchor:</small>${row.name} |
                <small>Auth:</small>${shorten(row.owner,4)} | 
                <small>Block:</small>${row.blocknumber}<hr></p>
            </div>`;
        }
        return dom;
    },
    clickRow: function() {
        //console.log('row clicked');
        var target = $(this).attr('link');
        console.log('row clicked, link:' + target);
    },
    loadStyle: function(con) {
        var dom = `<style>
            .${setting.cls.row} small{color:#BBBBBB}
        </style>`;
        console.log(dom);
        $(con).append(dom);
    },
};

anchorApp = function(agent, con, jquery) {
    //console.log("Anchor Application is ready." + con);
    search = agent.search;
    viewer = agent.view;
    writer = agent.write;
    tools = agent.tools;

    $ = jquery;
    console.log(agent);

    self.getBlogAnchor(setting.entry, function(res) {
        //console.log(res);
        if (!res || !res.raw) return false;
        const data = tools.hex2str(res.raw);
        if (!data) return false;
        const dt = JSON.parse(data);
        self.getBlogList(dt.list, function(res) {
            const dom = self.formatList(res);
            setTimeout(function() {
                $(con).html(dom).find('.' + setting.cls.row).off('click').on('click', self.clickRow);
                self.loadStyle(con);
            }, setting.loadingDelay);
        });
    });
    $(con).html("<p>Loading...</p>");
};