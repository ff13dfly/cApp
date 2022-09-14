//basic cApp framework, you can use it easily.
//you can load lib on cApp protocol keyword "lib"

;(function(agent,con,error){
    if(error!=null) console.log(`Error:${JSON.stringify(error)}`);
    if(!con) console.log('No container to run cApp.');
    if(!agent) console.log('No way to interact with anchor network.');

    var config={
        app:'cMedia',          // name of cApp, will set to windows
        default:"index",        // default page
        cls:{
            container:"cmedia_con",
            nav:"cmedia_nav",
            title:"cmedia_title",
            back:"cmedia_back",
            body:"cmedia_body",
            href:"cmedia_href",         //auto page load class
        }
    };

    var G={
        queue:[],           // page stack
    };

    var pages={};

    var self={
        struct:function(){
            var cls=config.cls;
            var framework=`<div class="row pt-2" id="${cls.container}">
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
        goto:function(name,input){
            console.log(`Opening page "${name}"`);
            if(!pages[name]) return false;
            var row=pages[name];

            if(row.events.before){
                row.events.before(function(){
                    G.queue.push($.extend({},row.data));    //put page on history queue;
                    self.initPage(row,input);
                });
            }else{
                G.queue.push($.extend({},row.data));    //put page on history queue;
                self.initPage(row,input);
            }
        },
        initPage:function(row,input){
            console.log("init page.");
            //console.log(row);
            var cls=config.cls;

            //1.body add dom;
            $("."+cls.body).html(row.template);

            //1.1.set title
            var data=row.data;
            $("#"+cls.container).find('.'+cls.title).html(data.title);

            $("#"+cls.container).find('.'+cls.back).off('click').on('click',self.back);

            //2.auto run js code on page
            if(input===undefined) input={};
            input.RPC=agent;
            row.events.loading(input);      // page entry
        },
        hideBack:function(){
            var cls=config.cls;
            $("#"+cls.container).find('.'+cls.back).hide();
        },
        showBack:function(){
            var cls=config.cls;
            $("#"+cls.container).find('.'+cls.back).show();
        },
        back:function(){
            if(G.queue.length===0) return false;
            //1.run destoried page callback;
            var atom=G.queue.pop();
            var input={};
            if(atom.callback) input=atom.callback();
        },
        bind:function(){
            // <span class="" href="page" input=""></span>
            console.log('Auto open page');
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
    };

    window[config.app]=exports;
    self.struct();

})(agent,con,error);