# cApp
Anchor cApp, pure on chain application.


## cApp protocol

Basic definition of cApp data.
```JSON
    {"type":"app","lib":[]}
```

## Protocol key words

Definition highcase. 

- type: ["DATA","APP"]
- code: ["UTF8"]
- format: ["JSON","JS","CSS"]
- app:  
- ver:  version of cApp
- lib:  []
- ext:  []
- ref:  []
- tag:  []
- limit:   

### JS lib protocol

```JSON
    {"type":"data","fmt":"JS","limit":0}
```

- ref: related Anchor
- limit: lib limit level, string type, ["MIT","Apache 2.0",""], Anchor copyright transfer agreement
- lib:[[Anchor,n],Anchor,[Anchor,n],...]

### cApp lib load sample

- entry app protocol, vExplorer will load the library automatically.
  
```JSON
{
    "name":"demo",
    "data":"console.log('This is code running from cApp demo, target container:'+con);console.log(agent);",
    "protocol":{"type":"app","lib":["jquery","bootstrap","simpleMDE"]}
} 
```

## data protocol

```JSON
{
    "name":"libnmae",
    "data":"console.log('hello library');",
    "protocol":{"type":"data","format":"JS","code":"utf8","lib":["jquery","testme"],"ext":["edit_header","edit_image","edit_block"]}
}  
```

```JSON
{
    "name":"testme",
    "data":"console.log('testme library');",
    "protocol":{"type":"data","format":"JS","code":"utf8","lib":["jquery","good_test","jrender"],"ext":["test_a","test_b","test_c"]}
}  
```

- app: filter Anchor, can be used for cApp to check data format
- code: code format ["utf8","ascii"]
- ref: related Anchor

-------------------Separator-------------------

## 测试出现问题的插件,simple

- simple image
- embed


- 以上是没发现起作用的

- quota : 好像用处不大
- code : 好像用处不大
- link : 从指定的URL获取数据的，不是给text加URL的
- raw : 嵌入HTML的，被废弃了
- delimiter
- warning
  