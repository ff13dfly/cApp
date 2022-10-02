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
            <div class="row" id="${cls.mask}"></div>`;
            var w=$(window).width();
            var cmap = `<style>
                #${cls.entry}{width:${w}px;height:100%;background:#FFFFFF}
                #${cls.entry} .${cls.body} {margin-top:45px;height:100%;width:100%;background:#FFFFFF;}
                #${cls.entry} .${cls.nav} {color:#222222;background:#EEEEEE;height:45px;position:fixed;top:0px;left:0px;width:100%}
                .${cls.nav} .row {background:#EEEEEE;height:45px;font-size:18px;}
                .${cls.back}{color:#222222;}  
                #${cls.mask} {display:none;position:fixed;z-index:99;background:#FFFFFF;width:100%;height:100%;top:0px;}
                #${cls.mask} .${cls.body} {margin-top:0px;height:100%;width:100%;background:#FFFFFF;}
            </style>`;
            $("#"+con).html(cmap+framework);   
            
            //3.check app container size and offset,listening scroll event
            $(window).off("scroll").on("scroll",function(){
                self.device(cls.entry);
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
            //console.log(`--------------Loading page start--------------`);
            //console.log(`Function [goto] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            //console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
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
            var cfg={
                skip:skip,         //no preload and animate
                animate:act,       //wether animate
                overwrite:true,     //overwrite template after animate
            }
            if(!events.before){
                self.showPage(params,cache,events,cfg);               
            }else{
                events.before(params,cache,function(dt){
                    //load data to cache
                    if(dt!==undefined){
                        if(dt.overwrite!==undefined) cfg.overwrite=dt.overwrite;
                        self.decodeBefore(dt);
                    }
                    //show target page
                    //console.log(`Ready to show page: ${cache.name}`);
                    self.showPage(params,cache,events,cfg);
                });
            }
        },
        decodeBefore:function(fmt){
            //depend on fmt, can stop loading page
        },
        showPage:function(params,cache,events,cfg){
            if(!cfg.skip){
                cache.preload=self.preload(cache);
                self.animateLoad(cache,function(){
                    events.loading(params,cache);
                },cfg);
            }else{
                self.bind();
            }
        },
        preload:function(data){
            //console.log(data);
            //console.log(`Function [preload] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            //console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
            var res={head:'',body:''},cls=config.cls;

            var dom=$("#"+cls.entry).html();
            var sel=$(dom).clone();
            sel.find('.'+cls.title).html(data.title);
            if(G.queue.length>1) sel.find('.'+cls.back).show();

            res.head=sel.prop("outerHTML");
            res.body=data.preload;
            return res;
        },
        getCurDom:function(){
            // without nav and back button
            var cls=config.cls;
            var con=G.funs.getG("container");
            return $("#"+con).find("#"+cls.entry).html();
        },
        back:function(){
            //console.log(`--------------Back page start--------------`);
            //console.log(`Function [back] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            //console.log(`Before back :${JSON.stringify(G.queue)}`);
            $(this).attr("disabled","disabled");
            if(G.queue.length===0) return false;

            //1.run destoried page function;
            var cur=G.queue.pop();
            var atom=G.queue[G.queue.length-1];
            var evs=pages[cur.name].events;
            evs.after((!atom || !atom.params)?{}:atom.params,cur,function(){
                //console.log(`After back :${JSON.stringify(G.queue)}`);
                self.animateBack(atom.snap,function(){
                    if(G.queue.length===1) self.hideBack();
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
                if(!page) return false;     //skip normal span
                var params=JSON.parse(sel.attr("data"));
                self.goto(page,params);
            });

            $("#"+G.container).find('.'+cls.back).off('click').on('click',self.back);
        },

        animateBack:function(dom,ck){
            //console.log(`Function [animateBack] back status ${self.statusBack()},history lenght ${G.queue.length}`);
            //console.log(`Title:${$("#"+config.cls.entry).find('.'+config.cls.title).html()}`);
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
                left:(dv.left+dv.back.left)+"px",
            };
            var at=config.animate.interval;
            var ani={left:(dv.screen+dv.back.left)+'px'};
            //console.log(cur);
            //console.log(`Animation Backing from ${JSON.stringify(cmap)} to ${JSON.stringify(ani)}`);
            $("#"+cls.mask).html(cur).css(cmap).show().animate(ani,at,'',function(){
                $("#"+cls.mask).hide();
                //console.log(`--------------Back page end--------------`);
                ck && ck();
            });
        },
        animateLoad:function(cache,ck,cfg){
            //console.log(`Now title ${$("#"+cls.entry).find('.'+cls.title).html()}`);    
            //console.log(`Container ${G.funs.getG("container")} : ${JSON.stringify(dv)}`);   
            //console.time('动画运行时间');
            //console.log(`Animation Loading from ${JSON.stringify(cmap)} to ${JSON.stringify(ani)}`);
            var cls=config.cls;
            //var dom=cache.preload;
            if(!cfg.animate){
                self.pageAuto(cache,cfg);
                ck && ck();
            }else{
                var dv=G.device;
                var cmap={
                    left:(dv.screen+dv.back.left)+"px",
                };
                var at=config.animate.interval;
                var ani={left:(dv.screen-dv.width+dv.back.left)+'px'};
                var dom=`${cache.preload.head}<div class="${cls.body}">${cache.preload.body}</div>`;
                $("#"+cls.mask).html(dom).css(cmap).show().animate(ani,at,'',function(){
                    self.pageAuto(cache,cfg);
                    ck && ck();
                });
            }
        },
        pageAuto:function(cache,cfg){
            var cls=config.cls;
            var sel=$("#"+cls.entry);
            if(G.queue.length>1) self.showBack();
            sel.find('.'+cls.title).html(cache.title);
            sel.find('.'+cls.back).off('click').on('click',self.back);
            //var body=cfg.overwrite===true?cache.preload.body:$("#"+cls.mask).find('.'+cls.body).html();
            //console.log(body);
            sel.find('.'+cls.body).html(cache.preload.body);
            if(cfg.animate) $("#"+cls.mask).hide();
        },
        
        statusBack:function(){
            var cls=config.cls;
            return $("#"+cls.entry).find('.'+cls.back).is(":hidden");
        },
        hideBack:function(){
            //console.log('Hiding back arrow.');
            var cls=config.cls;
            $("#"+cls.entry).find('.'+cls.back).hide();
        },
        showBack:function(){
            //console.log('Showing back arrow.');
            var cls=config.cls;
            $("#"+cls.entry).find('.'+cls.back).show();
        },
        error:function(txt){
            console.log(txt);
        },
        device:function(con){
            var cls=config.cls;
            var sel=$("#"+con),w=sel.width(),h=sel.height();
            var offset=sel.offset();
            var top=$(document).scrollTop();
            var back=sel.find('.'+cls.back).offset();
            G.device={
                width:w,
                height:h,
                top:offset.top-top,
                left:offset.left,
                screen:$(window).width(),
                back:back,
            };
            //console.log(`Check container:${con},result: ${JSON.stringify(G.device)}`);
            return true;
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
            //console.log(`Structing page ${name}`);
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