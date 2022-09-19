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
    var self={
        listening:function(){
            var info=App.info();
            var RPC=App.cache.getG("RPC");
            RPC.common.subscribe(function(list){
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
            var ctx = row.raw,cls=config.cls;
            var dt={anchor:row.anchor,block:row.block,owner:row.account};
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
                 Anchor : <strong class="${cls.anchor}"><span page="history" data='${JSON.stringify({anchor:row.anchor})}'>${row.anchor}</span></strong> 
                </div>
                <div class="col-12"><hr /></div>
            </div>`;
            //console.log(`Config:${JSON.stringify(config)}`);
            $("#"+cls.entry).prepend(dom);
        },

        //prepare the basic data when code loaded
        struct:function(){
            self.clsAutoset(config.prefix);
            //console.log(`Config:${JSON.stringify(config)}`);
        },
        clsAutoset:function(pre){
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre+hash();
            }
            return true;
        },
    };


    var test={
        auto:function(){
            test.row();
        },
        row:function(){
            var row={
                anchor:"fNews",
                block:133,
                account:"5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
                raw:{
                    title:"Break news! Test cMedia",
                    desc:"The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.",
                    content:"A good news, this is the content.",
                },
            };
            self.decode(row);

            var row={
                anchor:"testMe",
                block:127,
                account:"5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
                raw:{
                    title:"Break news! Test cMedia again",
                    desc:"Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.",
                    content:"A good news, this is the content.",
                },
            };
            self.decode(row);

            var row={
                anchor:"format",
                block:97,
                account:"5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
                raw:{
                    title:"Break news! Test cMedia again",
                    desc:"Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.",
                    content:"A good news, this is the content.",
                },
            };
            self.decode(row);

            App.fresh();
        },
    };


    var page={
        
        "data":{
            "name":config.name,
            "title":"cMedia App",     //default page title
            "raw":null,
            "params":{},
            "preload":"Loading...",
            "snap":"",
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
        },      
        "events":{
            "before":function(params,ck){
                //console.log(`${config.name} event "before" param :${JSON.stringify(params)}`);
                //console.log('Before page loading...'+JSON.stringify(cache));
                var dt={hello:"world"};
                ck && ck(dt);
            },
            "loading":function(params,data,ck){
                //console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                //console.log(data);
                test.auto();        //test data, need to remove
                self.listening();
                ck && ck();
            },
            "after":function(params,ck){
                //console.log(`${config.name} event "after" param :${JSON.stringify(params)}`);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);