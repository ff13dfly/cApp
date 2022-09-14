//basic cApp framework, you can use it easily.
//you can load lib on cApp protocol keyword "lib"

/*
    {"type":"app","format":"JS","lib":["jquery","bootstrap"],"ver":"0.0.1"}
 */

(function(agent,con,error){
    if(error!=null) console.log(error);
    if(!con) console.log('No container to run cApp.');
    if(!agent) console.log('No way to interact with anchor network.');

    var config={
        name:'cNews',           // name of cApp, will set to windows
        default:"index",        // default page
        cls:{
            nav:"cnews_nav",
            title:"cnews_title",
            body:"cnews_body",
        }
    };

    // golobal vars for exchange vars between pages.
    // stack object {"page":"","callback":function(){}};
    var G={
        queue:[],           // page stack
    };

    var pages={};

    var self={
        auto:function(){
            var cls=config.cls;
            var framework=`<div>
                <div class="${cls.nav}"></div>
                <div class="${cls.body}"></div>
            </div>`;
            $("#"+con).html(framework);
        },
        load:function(name,input){
            if(!pages[name]) return false;
            var row=pages[name];
            //1.body add dom;

            //2.auto run js code on page
            if(input===undefined) input={};
            input.RPC=agent;
            row.auto(input);
        },
        error:function(txt){
            console.log(txt);
        },
    };

    var exports={
        to:function(name,input){
            if(!page[name]) return self.error();

            var atom={name:name};
            if(input.callback) atom.callback=input.callback;
            G.queue.push(atom);

            self.load(name,input);
        },

        back:function(){
            if(G.queue.length===0) return false;
            //1.run destoried page callback;
            var atom=G.queue.pop();
            var input={};
            if(atom.callback) input=atom.callback();

            //2.load target page and get the callback result as input
            
        },

        page:function(name,obj){
            pages[name]=obj;
            if(name===config.default) {
                obj.auto({RPC:agent});
            }
        }, 
    };

    window[config.name]=exports;
    self.auto();

})(agent,con,error);