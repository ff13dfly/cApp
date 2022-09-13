//Anchor App说明
//1.使用new Function的方式加载cApp，const anchorApp=new Function("agent", "con","error" str);
//2.传入3个参数 agent:polkadot处理网络的各种方法; con:dom容器的id ; error:出错信息，未能加载的库等信息

if(error!=null) console.log(error);
if(!con) console.log('No container to run cApp.');
if(!agent) console.log('No way to interact with anchor network.');

var hash = function(pre,n) { return (!pre?'':pre)+Math.random().toString(36).substr(n != undefined ? n : 6) };
var editor=null;
var config={
    ids:{
        input_anchor:hash('c_'),
        button_save:hash('c_'),
    },
    autosave:true,
};

var anchor='';

const self = {
    load: function (){
        self.clean(con);
        self.init(con);
        self.action(con);
    },
    servers:function(){
    
    },
    init:function(con){
        var cfg = {
            id: con,
            toolbars: {
                toolbar: [
                    'switchModel','|',
                    'bold',
                    'italic',
                    'strikethrough','|',
                    'color',
                    'header','|',
                    'list',
                    {
                        insert: ['link', 'hr', 'br', 'code', 'toc', 'table'],
                    },
                ],
            },
            editor: {
                defaultModel: 'editOnly',
            },
        }
        editor = new Cherry(cfg);
    },
    action:function(con){
        var dom=`<div class="row pt-4">
            <div class="col-9">
                <input type="text" id="${config.ids.input_anchor}" class="form-control" placeholder="Anchor name..." value="">
            </div>
            <div class="col-3 text-end">
                <button class="btn btn-primary" id="${config.ids.button_save}">Save</button>
            </div>
        </div>`;
        $('#'+con).append(dom);
        self.bind();
    },
    bind:function(){
        $('#'+config.ids.input_anchor).off('change').on('change',function(){
            anchor=$(this).val().trim();
        });

        $('#'+config.ids.button_save).off('click').on('click',function(){
            if(!anchor) return console.log('No anchor to write');
            var md=editor.getValue().trim();
            if(!md) return console.log('No information to save.');
            //console.log(agent.extra.verify);
            
            if(!agent.extra.verify) return  console.log('Can not verify account');
            agent.extra.verify(function(pair){
                var proto={"type":"data","format":"MD","ref":["app"],"code":"UTF8"};
                agent.common.write(pair,anchor,md,proto,function(res){
                    console.log(res);
                });
            });
        });
    },
    clean:function(con){
        $('#'+con).html('');
    },
    
}

self.load();