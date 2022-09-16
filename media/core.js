//basic cApp framework, you can use it easily.
//you can load lib on cApp protocol keyword "lib"

;(function(agent,con,error){
    if(error!=null) console.log(`Error:${JSON.stringify(error)}`);
    if(!con) console.log('No container to run cApp.');
    if(!agent) console.log('No way to interact with anchor network.');

    //cMedia basic config
    var config={
        app:'cMedia',          // name of cApp, will set to windows
        default:"index",        // default page
        prefix:'cc_',
        cls:{
            entry:"",
            nav:"",
            title:"",
            back:"",
            body:"",
        },
    };

    //galobal cache;
    var pages={};
    var G={
        queue:[],       // page stack
        RPC:null,       // RPC call function   
        container:'',   // entry container id
        name:'',        // App name, used to filter anchors.
        funs:{
            setG:function(k,v){
                if(G[k]===undefined || k==='funs') return false;
                G[k]=v;
                return true;
            },
            getG:function(k){
                return (G[k]===undefined || k==='funs')?null:G[k];
            },
            delG:function(k){
                if(G[k]===undefined || k==='funs') return false;
                delete G[k];
                return true;
            },
        },
    };

    

    var self={
        struct:function(){
            //1.struct dom
            if(!config.entry) self.clsAutoset(config.prefix);
            var cls=config.cls;
            var framework=`<div class="row pt-2" id="${cls.entry}">
                <div class="col-12 ${cls.nav}">
                    <div class="row">
                        <div class="col-2"><span class="${cls.back}"> < </span></div>
                        <div class="col-8 text-center ${cls.title}"></div>
                        <div class="col-2"></div>
                    </div>
                </div>
                <div class="col-12 ${cls.body}"></div>
            </div>`;
            var cmap = `<style>
                .${cls.nav} {background:#EEEEEE;}
                .${cls.body} {min-height:400px;width:100%;background:#FFFFFF;}
            </style>`;
            $("#"+con).html(framework+cmap);

            //2.save RPC call object
            G.funs.setG("RPC",agent);
            G.funs.setG("container",con);
            G.funs.setG("name",config.app);
        },
        clsAutoset:function(pre){
            var hash=exports.tools.hash;
            for(var k in config.cls){
                config.cls[k]=pre+hash();
            }
            return true;
        },
        goto:function(name,params,skip){
            //console.log(`Opening page "${name}"`);
            if(!pages[name]) return false;
            var row=pages[name];
            //if(input.data) row.data=input.data;     //set input data as default

            //creat related data.will sent to page to use as cache
            //This will be pushed to the history queue, so when page reload as back, the data is ready.
            var cache=$.extend({},row.data);
            cache.params=params;                //set params

            var events=row.events;
            //console.log("[function Goto] cache:"+JSON.stringify(cache));
            if(events.before){
                events.before(params,function(dt){
                    cache.raw=dt;           //load data to cache
                    if(!skip) G.queue.push(cache);    //put page on history queue;
                    self.initPage(cache);
                    events.loading(params,cache);         // page entry
                });
            }else{
                if(!skip) G.queue.push(cache);    //put page on history queue;
                self.initPage(cache);
                events.loading(params,cache);         // page entry
            }
        },
        initPage:function(data){
            //console.log("init page..."+JSON.stringify(data));
            var cls=config.cls;

            //1.body add dom;
            var sel=$("#"+cls.entry);
            sel.find("."+cls.body).html(data.template);

            //1.1.set title
            sel.find('.'+cls.title).html(data.title);
            sel.find('.'+cls.back).off('click').on('click',self.back);
        },
        hideBack:function(){
            var cls=config.cls;
            $("#"+cls.entry).find('.'+cls.back).hide();
        },
        showBack:function(){
            var cls=config.cls;
            $("#"+cls.entry).find('.'+cls.back).show();
        },
        back:function(){
            $(this).attr("disabled","disabled");
            if(G.queue.length===0) return false;

            console.log(JSON.stringify(G.queue));

            //1.run destoried page function;
            var cur=G.queue.pop();
            var atom=G.queue[G.queue.length-1];
            //console.log(JSON.stringify(atom));

            if(G.queue.length===1) self.hideBack();

            var evs=pages[cur.name].events;
            //var input={};
            //if(atom.callback) input=atom.callback();
            evs.after(atom.params,function(){
                $(this).removeAttr("disabled");
                self.goto(atom.name,{},true);
            });
        },
        bind:function(){
            // <span class="" href="page" input=""></span>
            $("#"+G.container).find('span').off('click').on('click',function(){
                var sel=$(this);
                var page=sel.attr("page");
                var params=JSON.parse(sel.attr("data"));

                self.showBack();
                self.goto(page,params);
            });
        },  
        error:function(txt){
            console.log(txt);
        },
    };

    //程序加载逻辑
    //1.页面载入时，对cls进行赋值；

    //2.通过唯一入口goto进行页面访问时：
    //2.1.执行events.before，获取数据后，克隆出1个page对象（仅仅data部分），将获取的数据存入；
    //2.2.将整理好的数据，压入G.queue，作为历史记录进行访问；
    //2.3.将page.template写入到主容器里，准备显示数据；

    //3.执行events.loading，开始页面的操作和功能组织；

    //4.调用back的时候，执行events.after，同时G.queue进行出栈操作

    var exports={
        info:function(){
            return {
                app:config.app,
                intro:"more information about app",
            };
        },
        cache:G.funs,
        fresh:function(){
            self.bind();
        },
        back:self.back,
        page:function(name,pg){
            pages[name]=$.extend({},pg);     //need to clone.

            if(name===config.default) {
                self.hideBack();
                self.goto(name,{});
            }
        },
        tools:{
            hash:function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) },
            shorten:function(address,n){if (n === undefined) n = 10;return address.substr(0, n) + '...' + address.substr(address.length - n, n);},
        }
    };

    window[config.app]=exports;
    self.struct();

})(agent,con,error);