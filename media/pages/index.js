;(function(App){
    if(!App) return false;
    var config={
        name:"index",
        prefix:"ii_",
        cls:{
            entry:'ii_index',
            row:'',
            anchor:'',
        }
    };
    var cache=null;
    
    var self={

        listening:function(input){
            var info=App.info();
            //$("#cMedia_index").html("This is a cApp, fullscreen function.");
            input.RPC.common.subscribe(function(list){
                if(list.length ==0) return false;
                for(var i=0;i<list.length;i++){
                    var row=list[i];
                    if(row.protocol && row.protocol.type==="data" && row.protocol.app===info.app){
                        self.decode(row);
                        App.fresh();
                    }
                }
            });
        },
        decode:function(row){
            var ctx = row.raw;
            var cls=config.cls;
            var dt={anchor:row.anchor,block:row.block};
            var dom=`<div class="row">
                <div class="col-12 pt-2 ${cls.row}" >
                    <span page="view" data='${JSON.stringify(dt)}'><h4>${ctx.title}</h4></span>
                </div>
                <div class="col-12 ${cls.row}">
                    <span page="view" data='${JSON.stringify(dt)}'>${!ctx.desc?"":ctx.desc}</span>
                </div>
                <div class="col-4">${App.tools.shorten(row.account,4)}</div>
                <div class="col-8 text-end">
                 Block : <strong>${row.block}</strong> , 
                 Anchor : <strong class="${cls.anchor}">${row.anchor}</strong> 
                </div>
                <div class="col-12"><hr /></div>
            </div>`;
            //console.log(`Config:${JSON.stringify(config)}`);
            $("#"+cls.entry).prepend(dom);
        },
        struct:function(){
            self.clsAutoset(config.prefix);
            console.log(`Config:${JSON.stringify(config)}`);
        },
        clsAutoset:function(pre){
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre+hash();
            }
            return true;
        },
    };

    var page={
        "data":{
            "title":"cMedia App",     //default page title
            "raw":null,
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
            "input":{page:0},
        },      
        "events":{
            "before":function(ck){
                console.log('Before page loading...'+JSON.stringify(cache));
                var dt={hello:"world"};
                ck && ck(dt);
            },
            "loading":function(input,data){
                console.log('Page loading...'+JSON.stringify(data));
                cache=data;
                self.listening(input);
            },
            "after":function(ck){
                console.log('after page destoried...');
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);