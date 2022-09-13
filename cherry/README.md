# Summary

Editor bases on Cherry.

- App protocol
  
```JSON
{
    "name":"che",
    "protocol":{"type":"app","lib":["jquery","cherry"]}
}
```

- jquery library
  
```JSON
{
    "name":"cherry",
    "protocol":{"type":"data","format":"JS","ver":"3.8.0"}
}
```

- Cherry library
  
```JSON
{
    "name":"cherry",
    "protocol":{"type":"data","format":"JS","ver":"0.8.1","lib":["cherry_css"]}
}
```

```JSON
{
    "name":"cherry_css",
    "protocol":{"type":"data","format":"CSS","ver":"0.8.1"}
}
```
