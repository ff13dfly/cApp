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
        animate:{
            interval:500,
        },
    };

    //galobal cache;
    var pages={};
    var G={
        queue:[],       // page stack
        RPC:null,       // RPC call function   
        container:'',   // entry container id
        name:'',        // App name, used to filter anchors.
        device:null,
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

    var tools={
        convert:function(txt, ext){
            var arr = txt.match(/\[.*?\)/g);
            if(arr===null || arr.length===0) return txt;
            var map = {},format=tools.format;
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
                for (var k in ext)more += `${k}="${ext[k]}" `;
            }
            return `<span ${more} data='${JSON.stringify(details)}'>${name}</span>`;
        },
        hash:function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) },
        shorten:function(address,n){if (n === undefined) n = 10;return address.substr(0, n) + '...' + address.substr(address.length - n, n);},
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
            var framework=`<div class="row" id="${cls.entry}">
                <div class="col-12 ${cls.nav}">
                    <div class="row pt-2">
                        <div class="col-2"><p class="${cls.back}"> < </p></div>
                        <div class="col-8 text-center ${cls.title}"></div>
                        <div class="col-2"></div>
                    </div>
                </div>
                <div class="col-12 ${cls.body}"></div>
            </div>
            <div class="row pt-2" id="${cls.mask}"></div>`;
            var w=$(window).width();
            var cmap = `<style>
                #${cls.entry}{width:${w}px;height:100%;background:#FFFFFF}
                .${cls.nav} {background:#EEEEEE;height:45px;position:fixed;top:0px;left:0px;width:100%}
                .${cls.nav} .row {background:#EEEEEE;height:45px;font-size:18px;}
                .${cls.body} {margin-top:45px;height:100%;width:100%;background:#FFFFFF;}
                #${cls.mask} {display:none;position:fixed;z-index:99;background:#FFFFFF;width:100%;height:100%;top:0px;}
            </style>`;
            $("#"+con).html(cmap+framework);   
            
            //3.check app container size and offset,listening scroll event
            $(window).off("scroll").on("scroll",function(){
                self.device(cls.entry);
                //console.log(`Scrolling result:${JSON.stringify(G.device)}`);
            }).trigger("scroll");
        },

        clsAutoset:function(pre){
            var hash=tools.hash;
            for(var k in config.cls){
                if(!config.cls[k])config.cls[k]=pre+hash();
            }
            return true;
        },
        goto:function(name,params,skip){
            console.log(`--------------Loading page start--------------`);
            console.log(`Function [goto] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
            //console.log(`Opening page "${name}"`);
            if(!pages[name]) return false;
            var row=pages[name];

            //1.cache current container dom as history snap. It can be use by back function
            if(G.queue.length>0 && !skip){
                var curDom=self.getCurDom();
                var last=G.queue[G.queue.length-1];
                last.snap=curDom;
            }
            //if(G.queue.length===1)self.hideBack();
            //else self.showBack();

            //2.prepare the target page data
            //creat related data.will sent to page to use as cache
            //This will be pushed to the history queue, so when page reload as back, the data is ready.
            var cache=$.extend({},row.data);
            cache.params=params;                    //set params
            if(!skip) G.queue.push(cache);          //put page on history queue;
            var act=!(G.queue.length===1 || skip);  //wether animation
            
            //console.log("[function Goto] cache:"+JSON.stringify(cache));
            var events=row.events;
            if(!events.before){
                self.showPage(act,params,cache,events,skip);               
            }else{
                events.before(params,cache,function(dt){
                    if(dt!==undefined){
                        cache.raw=dt;        //load data to cache
                    }
                    self.showPage(act,params,cache,events,skip);
                });
            }
        },

        showPage:function(isAnimate,params,cache,events,skip){
            console.log(`Function [showPage] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
            if(G.queue.length>1) self.showBack();
            if(!skip){
                cache.preload=self.preload(cache);
                if(!isAnimate){
                    self.initPage(cache);
                    events.loading(params,cache,function(){
                            
                    });
                }else{
                    self.animateLoad(cache.preload,function(){
                        self.initPage(cache);
                        console.log('After initPage:')
                        console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
                        events.loading(params,cache,function(){
    
                        });
                    });
                }
            }else{
                self.bind();
            }
        },
        
        initPage:function(data){
            console.log(`Function [initPage] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
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
            console.log(`Function [preload] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
            var cls=config.cls;
            var dom=$("#"+cls.entry).html();
            var sel=$(dom).clone();
            sel.find("."+cls.body).html(data.template);
            sel.find('.'+cls.title).html(data.title);
            if(G.queue.length>1) sel.find('.'+cls.back).show();
            //console.log(sel.get(0));
            return sel.prop("outerHTML");
        },
        getCurDom:function(){
            // without nav and back button
            var cls=config.cls;
            var con=G.funs.getG("container");
            return $("#"+con).find("#"+cls.entry).html();
        },
        back:function(){
            console.log(`--------------Back page start--------------`);
            console.log(`Function [back] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            //console.log(`Before back :${JSON.stringify(G.queue)}`);
            $(this).attr("disabled","disabled");
            if(G.queue.length===0) return false;

            //1.run destoried page function;
            var cur=G.queue.pop();
            var atom=G.queue[G.queue.length-1];

            if(G.queue.length===1) self.hideBack();

            var evs=pages[cur.name].events;
            //var input={};
            //if(atom.callback) input=atom.callback();
            evs.after(atom.params,cur,function(){
                //console.log(`After back :${JSON.stringify(G.queue)}`);
                self.animateBack(atom.snap,function(){
                    $(this).removeAttr("disabled");
                    var skip=true;   //skip push history quueu
                    self.goto(atom.name,atom.params,skip);
                });
            });
        },
        bind:function(){
            var cls=config.cls;
            // <span class="" href="page" input=""></span>
            $("#"+G.container).find('span').off('click').on('click',function(){
                var sel=$(this);
                var page=sel.attr("page");
                var params=JSON.parse(sel.attr("data"));
                self.goto(page,params);
            });

            $("#"+G.container).find('.'+cls.back).off('click').on('click',self.back);
        },

        animateBack:function(dom,ck){
            console.log(`Function [animateBack] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
            //console.log("ready to back");
            var cls=config.cls;
            var dv=G.device;

            var cur=$("#"+cls.entry).html(); //1.get current container dom
            $("#"+cls.entry).html(dom);  //2.set history snap to container.
            if(G.queue.length===1){
                self.hideBack();
            }   
            //3.set mask position and set current dom to it.
            var cmap={
                left:dv.left+"px",
            };
            var at=config.animate.interval;
            var ani={left:dv.screen+'px'};
            $("#"+cls.mask).html(cur).css(cmap).show().animate(ani,at,'',function(){
                $("#"+cls.mask).hide();
                console.log(`--------------Back page end--------------`);
                ck && ck();
            });
        },
        animateLoad:function(dom,ck){
            console.log(`Function [animateLoad] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            console.log(dom);
            // history queue have been saved
            var cls=config.cls;
            var dv=G.device;
            //console.log(`Container ${G.funs.getG("container")} : ${JSON.stringify(dv)}`);
            var cmap={
                left:dv.screen+"px",
            };
            var at=config.animate.interval;
            var ani={left:(dv.screen-dv.width)+'px'};
            //console.log(`Animation : ${JSON.stringify(ani)}`);
            $("#"+cls.mask).html(dom).css(cmap).show().animate(ani,at,'',function(){
                $("#"+cls.mask).hide();
                
                console.log(`--------------Loading page end--------------`);
                ck && ck();
            });
        },
        device:function(con){
            //console.log("Check container:"+con);
            //var cls=config.cls;
            var sel=$("#"+con),w=sel.width(),h=sel.height();
            var offset=sel.offset();
            var top=$(document).scrollTop();
            G.device={
                width:w,
                height:h,
                top:offset.top-top,
                left:offset.left,
                screen:$(window).width(),
            };
            return true;
        },
        statusBack:function(){
            var cls=config.cls;
            return $("#"+cls.entry).find('.'+cls.back).is(":hidden");
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
        tools:tools,
        fresh:self.bind,
        back:self.back,
        page:function(name,pg){
            pages[name]=$.extend({},pg);     //need to clone.
            if(name===config.default){
                self.hideBack();
                self.goto(name,{});
            }
        }
    };

    window[config.app]=exports;
    self.struct();

})(agent,con,error);