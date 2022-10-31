# cApp

Anchor cApp, pure on chain application.

## cApp protocol

Basic definition of cApp data.

```JSON
    {"type":"app","lib":[]}
```

## Protocol key words

Definition reverse keywords.
Basic keywords.

- type: Enum in ["DATA","APP","CREATION"]

- code: Enum in ["UTF8","ASCII"]
  
- format: Enum in ["JSON","JS","CSS","MD"]
  
- app:  Anchor
  cApp name, identify data by this.

- ver:  version like "0.0.1"
  cApp version

- lib:  Array like [ Anchor, ... Anchor ]
  JS/CSS library which cApp need

- ext:  Array like [ Anchor, ... Anchor ]
  cApp extend function file. JS file normally.

- lang: Data language
  cApp data language, used to filter data.

- params: Object
  cApp params, when type is "DATA" and "app" is not empty

Extend keywords.

- ref:  Array like [ Anchor, ... Anchor ]
  
- tag:  Array like [ Anchor, ... Anchor ]
  
- limit: number
  
- auth:  String as SS58 account

### JS lib protocol

```JSON
    {"type":"data","format":"JS","limit":0}
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
  