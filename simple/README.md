# Summary

Editor cApp, you can edit anchor content and add it to Anchor network.

## Definition

- Simple format
  
```JSON
{"type":"data","app":"news"}
```

## Sample

- cEditor application anchor protocol.
  
```JSON
{
    "name":"editor",
    "raw":"JS code...",
    "protocol":{"type":"app","lib":["jquery","bootstrap","simpleMDE"]}
}
    
```

- cherry editor, Tecent MD editor
  
```JSON
{
    "name":"chapp",
    "data":"var aa=new Cherry({});console.log(aa)",
    "protocol":{"type":"app","lib":["cherry"]}
}
```

```JSON
{
    "name":"cherry",
    "data":"file",
    "protocol":{"type":"app","ext":["cherry_css"]}
}
```

- jquery lib anchor protocol.
  
```JSON
{
    "data":"console.log('This is code running from cApp demo, target container:'+con);console.log(agent);",
    "protocol":{"type":"data","format":"JS","limit":0}
}
```

- bootstrap lib anchor protocol.
  
```JSON
    {"type":"data","lib":["jquery","bootstrap_css"],"limit":0}
    {"type":"data","format":"JS","limit":0}
    {"type":"data","format":"CSS","limit":0}
```

- simpleMDE lib anchor protocol.
  
```JSON
    {"type":"data","lib":["ace","marked"],"limit":0}
    {"type":"data","format":"JS","limit":0}
    {"type":"data","format":"CSS","limit":0}
```

- editor lib anchor protocol. Need to include all component.
  
```JSON
    {"type":"data","format":"JS","ext":["editor_header","editor_simple_image","editor_image","editor_embed","editor_quote","editor_code","editor_link","editor_list","editor_delimiter","editor_warning","editor_table","editor_markdown"]}
```
