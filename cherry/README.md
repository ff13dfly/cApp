# Summary

Editor bases on Cherry.

- App protocol
  
```JSON
{
    "name":"che",
    "protocol":{"type":"app","lib":["cherry"]}
}
```

- Cherry library
  
```JSON
{
    "name":"cherry",
    "protocol":{"type":"data","format":"JS","lib":["cherry_css"]}
}
```

```JSON
{
    "name":"cherry_css",
    "protocol":{"type":"data","format":"CSS"}
}
```
