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
        $(con).html(`<textarea id="mds_con"></textarea>`);
        const mds = new SimpleMDE({
            autofocus: true,
            autosave: {
                enabled: true,
                uniqueId: "MyUniqueID",
                delay: 1000,
            },
            blockStyles: {
                bold: "__",
                italic: "_"
            },
            element: document.getElementById("mds_con"),
            forceSync: true,
            //hideIcons: ["guide", "heading"],
            indentWithTabs: false,
            initialValue: "Hello world!",
            insertTexts: {
                horizontalRule: ["", "\n\n-----\n\n"],
                image: ["![](http://", ")"],
                link: ["[", "](http://)"],
                table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"],
            },
            lineWrapping: false,
            parsingConfig: {
                allowAtxHeaderWithoutSpace: true,
                strikethrough: false,
                underscoresBreakWords: true,
            },
            placeholder: "Type here...",
            previewRender: function(plainText) {
                return customMarkdownParser(plainText); // Returns HTML from a custom parser
            },
            previewRender: function(plainText, preview) { // Async method
                setTimeout(function(){
                    preview.innerHTML = customMarkdownParser(plainText);
                }, 250);
        
                return "Loading...";
            },
            promptURLs: true,
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
            },
            shortcuts: {
                drawTable: "Cmd-Alt-T"
            },
            showIcons: ["code", "table"],
            spellChecker: false,
            status: false,
            status: ["autosave", "lines", "words", "cursor"], // Optional usage
            status: ["autosave", "lines", "words", "cursor", {
                className: "keystrokes",
                defaultValue: function(el) {
                    this.keystrokes = 0;
                    el.innerHTML = "0 Keystrokes";
                },
                onUpdate: function(el) {
                    el.innerHTML = ++this.keystrokes + " Keystrokes";
                }
            }], // Another optional usage, with a custom status bar item that counts keystrokes
            styleSelectedText: false,
            tabSize: 4,
            toolbar: false,
            toolbarTips: false,
        });
        // mds.codemirror.on("change", function(){
        //     console.log(mds.value());
        // });
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