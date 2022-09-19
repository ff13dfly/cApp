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
            mask:"",
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
            //1.save RPC call object
            G.funs.setG("RPC",agent);
            G.funs.setG("container",con);
            G.funs.setG("name",config.app);

            //2.struct dom
            if(!config.entry) self.clsAutoset(config.prefix);
            var cls=config.cls;
            var framework=`<div class="row pt-2" id="${cls.entry}">
                <div class="col-12 ${cls.nav}">
                    <div class="row">
                        <div class="col-2"><p class="${cls.back}"> < </p></div>
                        <div class="col-8 text-center ${cls.title}"></div>
                        <div class="col-2"></div>
                    </div>
                </div>
                <div class="col-12 ${cls.body}"></div>
            </div>
            <div class="row pt-2" id="${cls.mask}"></div>`;

            var cmap = `<style>
                .${cls.nav} {background:#EEEEEE;}
                .${cls.body} {min-height:400px;width:100%;background:#FFFFFF;}
                #${cls.mask} {display:none;position:fixed;z-index:99;background:#FFFFFF;}
            </style>`;
            $("#"+con).html(framework+cmap);    
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

            //1.cache current container dom for back function.
            if(G.queue.length>0 && !skip){
                var curDom=self.getCurDom();
                var last=G.queue[G.queue.length-1];
                last.snap=curDom;
            }
            
            //2.prepare the target page data
            var row=pages[name];
            //creat related data.will sent to page to use as cache
            //This will be pushed to the history queue, so when page reload as back, the data is ready.
            var cache=$.extend({},row.data);
            cache.preload=self.preload(cache);      //prepare preload page dom
            cache.params=params;                    //set params
            if(!skip) G.queue.push(cache);          //put page on history queue;
            var act=!(G.queue.length===1 || skip);  //wether animation

            var events=row.events;
            //console.log("[function Goto] cache:"+JSON.stringify(cache));
            if(events.before){
                events.before(params,function(dt){
                    if(dt!==undefined) cache.raw=dt;        //load data to cache
                    //2.loading animate here
                    self.showPage(act,params,cache,events);
                });
            }else{
                self.showPage(act,params,cache,events);
            }
        },

        showPage:function(act,params,cache,events){
            if(act){
                self.animateLoad(cache.preload,function(){
                    self.initPage(cache);
                    events.loading(params,cache,function(){

                    });
                });
            }else{
                self.initPage(cache);
                events.loading(params,cache,function(){

                });
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
        preload:function(data){
            var cls=config.cls;
            var backup=self.getCurDom();
            
            //1.body add dom;
            var sel=$("#"+cls.entry);
            sel.find("."+cls.body).html(data.template);

            //1.1.set title
            sel.find('.'+cls.title).html(data.title);
            var dom=sel.html();

            $("#"+cls.entry).html(backup);
            return dom;
        },
        getCurDom:function(){
            var cls=config.cls;
            var con=G.funs.getG("container");
            return $("#"+con).find("#"+cls.entry).html();
        },
        back:function(){
            //console.log(`Before back :${JSON.stringify(G.queue)}`);
            $(this).attr("disabled","disabled");
            if(G.queue.length===0) return false;

            //1.run destoried page function;
            var cur=G.queue.pop();
            var atom=G.queue[G.queue.length-1];
            //console.log(JSON.stringify(atom));

            if(G.queue.length===1) self.hideBack();

            var evs=pages[cur.name].events;
            //var input={};
            //if(atom.callback) input=atom.callback();
            evs.after(atom.params,function(){
                //console.log(`After back :${JSON.stringify(G.queue)}`);
                self.animateBack(function(){
                    $(this).removeAttr("disabled");
                    self.goto(atom.name,{},true);
                });
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

        animateBack:function(ck){
            console.log("ready to back");
            var cls=config.cls;
            var con=G.funs.getG("container");
            var dv=self.device(con);

            //1.get current container dom to mask 
            //2.set mask position to container.
            var dom=$("#"+cls.entry).html();
            var sel=$("#"+cls.mask);
            var mmap={
                width:dv.width+"px",
                height:dv.height+"px",
                top:dv.top+"px",
                left:dv.left+"px",
            };
            sel.html(dom).css(mmap);
            
            //3.set history snap to container.
            var last=G.queue[G.queue.length-1];
            var snap=last.snap;
            $("#"+cls.entry).html(snap);
            self.bind();

            //4.animate from left:0 to left:screen.width
            ck && ck();
            sel.show().animate({left:(dv.left+dv.screen)+'px'},1000,ck).hide();
        },
        animateLoad:function(dom,ck){
            console.log("ready to load");
            var cls=config.cls;
            var con=G.funs.getG("container");
            var dv=self.device(con);
            var cmap={
                width:dv.width+"px",
                height:dv.height+"px",
                top:dv.top+"px",
                left:(dv.left+dv.screen)+"px",
            };

            console.log(cls.mask);
            console.log(dv);
            console.log(JSON.stringify(cmap));
            $("#"+cls.mask).html(dom).css(cmap).show();
            //need to reselect the target dom to do animation.
            $("#"+cls.mask).animate({left:dv.left+'px'},1000,function(){
                $("#"+cls.mask).hide();
                ck && ck();
            });
        },
        device:function(con){
            var sel=$("#"+con);
            var w=sel.width(),h=sel.height();
            var offset=sel.offset();
           return {
                width:w,
                height:h,
                top:offset.top,
                left:offset.left,
                screen:$(window).width(),
           };
        },
        hideBack:function(){
            var cls=config.cls;
            $("#"+cls.entry).find('.'+cls.back).hide();
        },
        showBack:function(){
            var cls=config.cls;
            $("#"+cls.entry).find('.'+cls.back).show();
        },
        error:function(txt){
            console.log(txt);
        },
    };

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
            convert:function(txt, ext){
                var arr = txt.match(/\[.*?\)/g);
                //console.log(arr);
                if(arr.length===0) return txt;
                var map = {};
                var format=exports.tools.format;
                for (var i = 0; i < arr.length; i++) {
                    var row = arr[i];
                    map[row] = format(row, ext);
                }
    
                for (var k in map) {
                    var target = map[k];
                    txt = txt.replaceAll(k, target);
                }
                return txt;
            },
            format:function(txt, ext) {
                var arr = txt.split("](anchor://");
                var last = arr.pop(),first = arr.pop();
                var an = last.substr(0, last.length - 1).split("/");
                var name = first.substr(1, first.length);
                var details = {
                    anchor: an[0],
                    block: an[1] !== undefined ? parseInt(an[1]) : 0,
                };
    
                var more = "";
                if (ext != undefined) {
                    for (var k in ext) {
                        more += `${k}="${ext[k]}" `;
                    }
                }
                return `<span ${more} data='${JSON.stringify(details)}'>${name}</span>`;
            },
            hash:function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) },
            shorten:function(address,n){if (n === undefined) n = 10;return address.substr(0, n) + '...' + address.substr(address.length - n, n);},
        }
    };

    window[config.app]=exports;
    self.struct();

})(agent,con,error);