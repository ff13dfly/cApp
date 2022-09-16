# Summary

## Anchor Linker

format definition
name:   anchor name, must
block:  anchor on target block, not necessary

```TEXT
    {anchor://name/block}
```

使用和MD一致的语法来处理关联

```TEXT
    This is a test txt [anchor testme](anchor://testme/309) to confirm the replace [anchor app](anchor://app/251) for anchor.
```


## Definition

```JSON
    {
        "name":"jquery",
        "raw":"[code]",
        "protocol":{"type":"data","format":"JS","ver":"3.8.0"}
    }
```

```JSON
    {
        "name":"bootstrap",
        "raw":"[code]",
        "protocol":{"type":"data","format":"JS","lib":["bootstrap_css"],"ver":"5.1.3"}
    }
```

```JSON
    {
        "name":"bootstrap_css",
        "raw":"[code]",
        "protocol":{"type":"data","format":"CSS","ver":"5.1.3"}
    }
```

```JSON
    {
        "name":"cMedia",
        "raw":"[code]",
        "protocol":{"type":"app","format":"JS","lib":["jquery","bootstrap"],"ver":"0.0.1"}
    }
```

## Sample

```JSON
    {"type":"data","format":"JSON","app":"cMedia"}
```

```JSON
    {"title": "Test anchor format","desc": "It is a good way to test anchor format","content":"This is a test txt [anchor testme](anchor://testme/309) to confirm the replace [anchor app](anchor://app/251) for anchor."}
```

```JSON
    {"title": "Odesa under further missile attacks","desc": "The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.","content":"The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.  Social media showed at least one large fire burning. and a witness said a large shopping center was on fire. The resident of a city more than 40 kilometers (25 miles) from Odesa reported hearing the blasts.   A few hours earlier, Odesa city council reported three cruise missiles were fired from a Tu-22 bomber. Five buildings were destroyed and two people injured.  The targets were unknown but some images from Odesa suggested a mixed residential-industrial area had been hit.  Video released by the city council showed widespread devastation across a wide area.   On Monday morning authorities four sea-launched Onyx cruise missiles were fired towards Odesa.   The earlier attacks came as European Council President Charles Michel visited Odesa.  On Sunday, ten cruise missiles were fired at the Odesa area. Russia has used submarines, surface ships and aircraft to launch missiles at Odesa in recent days.","images":["base64 image","base64 image"]}
```

```JSON
    {"title": "News here!","desc": "The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.","content":"The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.  Social media showed at least one large fire burning. and a witness said a large shopping center was on fire. The resident of a city more than 40 kilometers (25 miles) from Odesa reported hearing the blasts.   A few hours earlier, Odesa city council reported three cruise missiles were fired from a Tu-22 bomber. Five buildings were destroyed and two people injured.  The targets were unknown but some images from Odesa suggested a mixed residential-industrial area had been hit.  Video released by the city council showed widespread devastation across a wide area.   On Monday morning authorities four sea-launched Onyx cruise missiles were fired towards Odesa.   The earlier attacks came as European Council President Charles Michel visited Odesa.  On Sunday, ten cruise missiles were fired at the Odesa area. Russia has used submarines, surface ships and aircraft to launch missiles at Odesa in recent days.","images":["base64 image","base64 image"]}
```
