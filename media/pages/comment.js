/*
    {"type":"data","format":"JS"}
 */

(function(App){
    if(!App) return false;
    var config={
        name:'comment',
        prefix:"ct_",
        cls:{
            entry:'ct_index',
            content:'',
            comment:'',
        },
    };

    var self={
        show:function(params,data){
            console.log(params);
            var cls=config.cls;
            var dom=`<style>
            </style>
            <div class="row">
                <div class="col-12 gy-2">
                    <textarea class="form-control ${cls.content}" placeholder="Adding comment..." rows="10"></textarea>   
                </div>
                <div class="col-6 gy-2">
                    <input type="text" class="form-control" disabled="disabled" value="${params.anchor}" >
                </div>
                <div class="col-6 gy-2 text-end">
                    <button class="btn btn-md btn-primary" id="${cls.add}">Comment</button>
                </div>
            </div>`;
            $("#" + cls.entry).html(dom);
            self.bind();
        },
        bind:function(){

        },
        struct:function(){
            var pre=config.prefix;
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre + hash();
            }
            return true;
        }
    };

    var test={
        auto:function(){

        },
    };

    var page={
        "data":{
            "name":config.name,
            "title":"Anchor comment",     //default page title
            "raw":null,
            "params":{},
            "preload":"Loading...",
            "snap":"",
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
        },      
        "events":{
            "before":function(params,data,ck){
                ck && ck();
            },
            "loading":function(params,data){
                //console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                test.auto();        //test data, need to remove
                self.show(params,data);
            },
            "after":function(params,data,ck){
                //console.log(`${config.name} event "after" param :${JSON.stringify(params)}`);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);