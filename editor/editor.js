//Anchor App说明
//1.使用new Function的方式加载cApp，const anchorApp=new Function("agent", "con", str);
//2.传入3个参数 agent:polkadot处理网络的各种方法; con:dom容器的id ; jquery:jquery操作库

//console.log(Arguments);
const container = con;
const tools = agent.tools;

const hash = function(n) { return Math.random().toString(36).substr(n != undefined ? n : 6) };


const config={
    app:'editor',     //设置筛选的data内容
    cacheMax:10,    //cache的最大长度
    cls:{
        page:'w'+hash(),      //page容器的class
    }
};

if($===undefined) console.log('No jquery exsist, cEditor will not run properly.');
let editor=null;

const self={
    loadPage:function(con){
        // $(con).html(`<form id="form">
        //     <textarea class="form-control" name="text" id="editor"></textarea>
        // </form>`);

        $(con).html(`<div class="row">
                <div class="col-12 text-end">
                    <button class="btn btn-md btn-primary" id="save_me">Save</button>
                </div>
            </div><div id="editorjscon"></div>`).find('#save_me').off('click').on('click',self.save);

        const ecfg={
            holder: 'editorjscon', 
            tools: {
                header: Header,
                image: SimpleImage,
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                            byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                        }
                    }
                },
                embed: {
                    class: Embed,
                    config: {
                        services: {
                            youtube: true,
                            coub: true
                        }
                    }
                },
                quote: Quote,
                code: CodeTool,
                linkTool: {
                    class: LinkTool,
                    config: {
                        endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                delimiter: Delimiter,
                warning: Warning,
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    },
                },
            },
            onReady: () => {
                console.log('Editor.js is ready to work!');
            }
        };
        editor = new EditorJS(ecfg);
    },
    save:function(){
        console.log('ready to save');
        editor.save().then((outputData) => {
            console.log('Article data: ', outputData)
        }).catch((error) => {
            console.log('Saving failed: ', error)
        });
    },
    loadStyle: function(con){
        $(con).append(`<style>
            #editorjscon{width:100%;height:60%;background:#EEEEEE;}
            .${config.cls.page} {display:none;width:100%;height:100%;z-index:999;position:fixed;left:0px;top:0px;background:#FFFFFF}
            .${config.cls.header} {height:58px;width:100%;background:#EEEEEE;position:fixed;left:0px;top:0px;}
            .${config.cls.title} {margin-top:58px;}
            .${config.cls.back} {padding-top:15px;}
            .${config.cls.sign} {color:#BBBBBB}
        </style>`);
    },
    
    checkUTF8:function(text) {
        var utf8Text = text;
        try {
            // Try to convert to utf-8
            utf8Text = decodeURIComponent(escape(text));
            // If the conversion succeeds, text is not utf-8
        }catch(e) {
            // console.log(e.message); // URI malformed
            // This exception means text is utf-8
        }   
        return utf8Text; // returned text is always utf-8
    },
    toBinary:function(string) {
        const codeUnits = new Uint16Array(string.length);
        for (let i = 0; i < codeUnits.length; i++) {
          codeUnits[i] = string.charCodeAt(i);
        }
        return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
    },
    fromBinary:function(encoded) {
        const binary = atob(encoded);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return String.fromCharCode(...new Uint16Array(bytes.buffer));
    },
    load:function(){
        self.loadPage(container);
        self.loadStyle(container);
    },
}

self.load();  //自动加载部分