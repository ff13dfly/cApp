//basic cApp framework, you can use it easily.
//you can load lib on cApp protocol keyword "lib"

;(function(agent,con,error){
    if(error!=null) console.log(`Error:${JSON.stringify(error)}`);
    if(!con) console.log('No container to run cApp.');
    if(!agent) console.log('No way to interact with anchor network.');

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

    var G={
        queue:[],           // page stack
    };

    var pages={};

    var self={
        struct:function(){
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
            var cmap=`<style>
                .${cls.nav} {background:#EEEEEE;}
                .${cls.body} {min-height:400px;width:100%;background:#FFFFFF;}
            </style>`
            $("#"+con).html(framework+cmap);
        },
        clsAutoset:function(pre){
            var hash=exports.tools.hash;
            for(var k in config.cls){
                config.cls[k]=pre+hash();
            }
            return true;
        },
        goto:function(name,input,skip){
            //console.log(`Opening page "${name}"`);
            if(!pages[name]) return false;
            var row=pages[name];
            //if(input.data) row.data=input.data;     //set input data as default

            //creat related data.will sent to page to use as cache
            //This will be pushed to the history queue, so when page reload as back, the data is ready.
            var cache=$.extend({},row.data);
            cache.name=name;        //set history name

            var events=row.events;
            //console.log("[function Goto] cache:"+JSON.stringify(cache));
            if(events.before){
                events.before(function(dt){
                    cache.raw=dt;           //load data to cache
                    if(!skip) G.queue.push(cache);    //put page on history queue;
                    self.initPage(cache,events,input);
                });
            }else{
                if(!skip) G.queue.push(cache);    //put page on history queue;
                self.initPage(cache,events,input);
            }
        },
        initPage:function(data,events,input){
            //console.log("init page..."+JSON.stringify(data));
            var cls=config.cls;

            //1.body add dom;
            $("#"+cls.entry).find("."+cls.body).html(data.template);

            //1.1.set title
            $("#"+cls.entry).find('.'+cls.title).html(data.title);
            $("#"+cls.entry).find('.'+cls.back).off('click').on('click',self.back);

            //2.auto run js code on page
            if(input===undefined) input={};
            input.RPC=agent;
            events.loading(input,data);      // page entry
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
            evs.after(function(){
                $(this).removeAttr("disabled");
                self.goto(atom.name,{RPC:agent},true);
            });
        },
        bind:function(){
            // <span class="" href="page" input=""></span>
            $("#"+con).find('span').off('click').on('click',function(){
                var sel=$(this);
                var page=sel.attr("page");
                var data=JSON.parse(sel.attr("data"));
                console.log(`preter[${page}]:${JSON.stringify(data)}`);

                self.showBack();
                self.goto(page,{RPC:agent,data:data});
            });
        },  
        error:function(txt){
            console.log(txt);
        },
        setG:function(k,v){
            G[k]=v;
            return true;
        },
        getG:function(k){
            return G[k];
        },
        delG:function(k){
            delete G[k];
            return true;
        },
    };

    var exports={
        info:function(){
            return {
                app:config.app,
                intro:"more information about app",
            }
        },
        to:function(name,input){

        },
        fresh:function(){
            self.bind();
        },
        back:self.back,
        page:function(name,pg){
            pages[name]=$.extend({},pg);     //need to clone.

            if(pg.events!=undefined){
                console.log('ready to run and set events');
            }

            if(name===config.default) {
                self.hideBack();
                self.goto(name,{RPC:agent});
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