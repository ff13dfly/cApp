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
- code: code format
- ref: related Anchor