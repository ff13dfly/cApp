# cApp
Anchor cApp, pure on chain application.


# protocol
Basic definition of cApp data.
```
    {"type":"app","lib":[]}
```

# lib protocol

```
    {"type":"data","fmt":"js","limit":0}
```
- ref: related Anchor
- app: filter Anchor
- limit: lib limit level


- lib:[[Anchor,n],Anchor,[Anchor,n],...]

# data protocol

```
    {"type":"data","app":"blog","code":"utf8","ref":[Anchor,Anchor,...]}
```

- app: filter Anchor, can be used for cApp to check data format
- code: code format ["utf8","ascii"]
- ref: related Anchor


# 测试出现问题的插件
- simple image
- embed


- 以上是没发现起作用的

- quota : 好像用处不大
- code : 好像用处不大
- link : 从指定的URL获取数据的，不是给text加URL的
- raw : 嵌入HTML的，被废弃了
- delimiter
- warning
  