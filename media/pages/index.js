/*
    {"type":"data","format":"JS"}
 */

(function(app){
    if(!app) return false;
    var config={
        name:'index',
    };
    var self={
        listening:function(){
            var info=app.info();
            agent.common.subscribe(function(list){
                //console.log('New block finalized.');
                if(list.length ==0) return false;
                for(let i=0;i<list.length;i++){
                    const row=list[i];
                    if(row.protocol && row.protocol.type==="data" && row.protocol.app===info.app){
                        console.log(row);
                    }
                }
            });
        },
    };

    var obj={
        "template":`<div>list of page</div>`,     //includindg dom and css, will add to body container,
        "auto":function(input){
            //console.log("Hello world");
            console.log(app);
            self.listening();
        },
        "callback":function(){
            return {page:3};
        },
        "title":"",     //default page title
    };

    app.page(config.name,obj);
})(cMedia);