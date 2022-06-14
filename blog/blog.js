//Anchor App说明
//1.执行逻辑，anchorApp已经在调用的时候创建了变量，使用eval执行这个问题。这样，anchorApp就作为程序启动的入口了
//2. 传入3个参数 pok:polkadot网络读取的方法; con:dom容器的id ; jquery:jquery操作库

//Blog加载逻辑
//1.获取入口的blog数据
// let search = null; //搜索anchor的方法
// let viewer = null; //查看anchor的方法
// let writer = null; //写入anchor的方法
// let signer = null; //用户验证的页面调用
// let tools = null; //上部提供的解析工具
// let subcribe = null; //监听的方法
// let $ = null; //jquery的数据
// let container='';       //上层的容器；

const search = agent.search;
const viewer = agent.view;
const writer = agent.write;
const tools = agent.tools;
const container = con;
const $ = jquery;

const hash = function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) };
const setting = {
    entryDefault: 'blog_list', //blog程序的入口，获取对应的数据列表；
    entryKey:'entry_anchor',    //blog的entryanchor
    loadingDelay: 50, //显示内容的delay
    cls: {
        row: 'aa_' + hash(),    //条目的class
        config:'aa_'+hash(),    //设置按钮的class
        page:'aa_'+hash(),      //弹出页面的class
        back:'aa_'+hash(),      //弹出页面返回按钮的class
        body:'aa_'+hash(),      //弹出页面容器class
        entry:'in_'+hash(),     //入口anchor的input的class
    }
};

const self = {
    getBlogAnchor: function(name, ck) {
        search(name, function(res) {
            if (res.blocknumber === 0) return ck && ck(false);
            viewer(res.blocknumber, res.anchor, res.owner, function(dt) {
                dt.blocknumber = res.blocknumber;
                dt.owner = res.owner;
                ck && ck(dt);
            });
        });
    },
    getEntry:function(){
        if(!localStorage[setting.entryKey]) return setting.entryDefault;
        return localStorage[setting.entryKey];
    },
    getBlogList: function(list, ck, count, result) {
        if (count === undefined) {
            let index = 0;
            let result = [];
        } else {

        }
        let index = count === undefined ? 0 : count;
        let anchorList = result === undefined ? [] : result;

        self.getBlogAnchor(list[index], function(res) {
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
        console.log('anchor list is ready');
        for (let i = 0; i < list.length; i++) {
            const row = list[i];

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
        console.log('anchor dom is ready');
        return dom;
    },
    clickRow: function() {
        var target = $(this).attr('link');
        console.log('row clicked, link:' + target);
    },
    getBar:function(){
        return `<div class="row">
            <div class="col-8">cBlog,blockchain blog.</div>
            <div class="col-4 ${setting.cls.config}">Setting</div>
        </div>`;
    },
    clickConfig:function(){
        console.log('ready to show page');
        $('.'+setting.cls.page).slideUp().show();      
    },
    clickBack:function(){
        $('.'+setting.cls.page).slideDown().hide();
    },
    getPage:function(){
        const ins=self.getInput();
        return `<div class="${setting.cls.page}">
            <div class="row">
                <div class="col-4 ${setting.cls.back}"> < back </div>
                <div class="col-8">Page title</div>
                <div class="col-12 ${setting.cls.body}">${ins}</div>
            </div>
        </div>`;
    },
    getInput:function(){
        return `<div class="row">
            <div class="col-4">Entry Anchor:</div>
            <div class="col-8"><input class="form-control ${setting.cls.entry}" type="text" value="${setting.entryDefault}"></div>
        </div>`;
    },
    changeInput:function(){
        const val=$.trim($(this).val());
        if(!val) return false;
        setting.entryDefault=val;
        $('.'+setting.cls.page).hide();
        self.load(container);
    },
    loadStyle: function(con) {
        var dom = `<style>
            .${setting.cls.row} small{color:#BBBBBB}
            .${setting.cls.page} {display:none;width:100%;height:100%;z-index:999;position:fixed;left:0px;top:0px;background:#FFFFFF}
        </style>`;
        $(con).append(dom);
    },
    bindAction:function(con){
        $(con).find('.' + setting.cls.row).off('click').on('click', self.clickRow);
        $(con).find('.' + setting.cls.config).off('click').on('click', self.clickConfig);
        $(con).find('.' + setting.cls.back).off('click').on('click', self.clickBack);
        $(con).find('.' + setting.cls.entry).off('change').on('change', self.changeInput);
        self.loadStyle(con);
    },
    load:function(con){
        $(con).html("<p>Loading...</p>");
        self.getBlogAnchor(self.getEntry(), function(res) {
            if (!res || !res.raw) return self.empty(con);
            const data = tools.hex2str(res.raw);
            if (!data) return self.empty(con);
            const dt = JSON.parse(data);
            self.show(con,dt.list);
        });
    },
    empty:function(con){
        const bar = self.getBar();
        const foot=self.getPage();
        const dom = bar + 'No such entry' + foot;
        $(con).html(dom);
        setTimeout(function(){
             self.bindAction(con);
        },setting.loadingDelay);
    },
    show:function(con,list){
        const bar = self.getBar();
        const foot=self.getPage();
        self.getBlogList(list, function(res) {
            const dom = bar + self.formatList(res)+foot;
            $(con).html(dom);
            setTimeout(function(){
                self.bindAction(con);
            },setting.loadingDelay);
        });
    },
};
self.load(con);