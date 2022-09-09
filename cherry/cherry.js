//Anchor App说明
//1.使用new Function的方式加载cApp，const anchorApp=new Function("agent", "con", str);
//2.传入3个参数 agent:polkadot处理网络的各种方法; con:dom容器的id ; jquery:jquery操作库

console.log(agent);
console.log(con);
console.log(error);

let editor=null;
const self = {
    load: function () {
        var cfg = {
            id: con,
            toolbars: {
                toolbar: [
                    'switchModel',
                    '|',
                    'bold',
                    'italic',
                    'strikethrough',
                    '|',
                    'color',
                    'header',
                    '|',
                    'list',
                    {
                        insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'pdf', 'word'],
                    },
                    //'graph',
                    //'settings',
                ],
            },
            editor: {
                defaultModel: 'editOnly',
            },
        }
        editor = new Cherry(cfg);
        console.log(editor);
    },
}

self.load();