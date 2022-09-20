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
        "protocol":{"type":"app","format":"JS","lib":["jquery","bootstrap"],"ver":"0.1.0"}
    }
```

## Sample

```JSON
    {"type":"data","format":"JSON","app":"cMedia"}
```

```JSON
    {"title": "Test anchor format","desc": "It is a good way to test anchor format","content":"This is a test txt [anchor testme](anchor://testme/244) to confirm the replace [anchor app](anchor://fnews/250) for anchor."}
```

```JSON
    {"title": "Odesa under further missile attacks","desc": "The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.","content":"The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.  Social media showed at least one large fire burning. and a witness said a large shopping center was on fire. The resident of a city more than 40 kilometers (25 miles) from Odesa reported hearing the blasts.   A few hours earlier, Odesa city council reported three cruise missiles were fired from a Tu-22 bomber. Five buildings were destroyed and two people injured.  The targets were unknown but some images from Odesa suggested a mixed residential-industrial area had been hit.  Video released by the city council showed widespread devastation across a wide area.   On Monday morning authorities four sea-launched Onyx cruise missiles were fired towards Odesa.   The earlier attacks came as European Council President Charles Michel visited Odesa.  On Sunday, ten cruise missiles were fired at the Odesa area. Russia has used submarines, surface ships and aircraft to launch missiles at Odesa in recent days.","images":["base64 image","base64 image"]}
```

```JSON
    {"title": "News here!","desc": "The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.","content":"The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.  Social media showed at least one large fire burning. and a witness said a large shopping center was on fire. The resident of a city more than 40 kilometers (25 miles) from Odesa reported hearing the blasts.   A few hours earlier, Odesa city council reported three cruise missiles were fired from a Tu-22 bomber. Five buildings were destroyed and two people injured.  The targets were unknown but some images from Odesa suggested a mixed residential-industrial area had been hit.  Video released by the city council showed widespread devastation across a wide area.   On Monday morning authorities four sea-launched Onyx cruise missiles were fired towards Odesa.   The earlier attacks came as European Council President Charles Michel visited Odesa.  On Sunday, ten cruise missiles were fired at the Odesa area. Russia has used submarines, surface ships and aircraft to launch missiles at Odesa in recent days.","images":["base64 image","base64 image"]}
```


## program

### 程序加载逻辑

- 1.页面载入时，对cls进行赋值；

- 2.通过唯一入口goto进行页面访问时：
  
    -- 2.1.执行events.before，获取数据后，克隆出1个page对象（仅仅data部分），将获取的数据存入；

    -- 2.2.将整理好的数据，压入G.queue，作为历史记录进行访问；

    -- 2.3.将page.template写入到主容器里，准备显示数据；

- 3.执行events.loading，开始页面的操作和功能组织；渲染之后的数据，保存在cache里

- 4.调用back的时候，执行events.after，同时G.queue进行出栈操作

### 页面动画实现 (进入)

- 1.增加1个mask的层，隐藏在屏幕右侧；

- 2.将before渲染之后的数据，填充到mask层里；

- 3.动画[从右到左]移动覆盖到container；
- 
- 4.用新页面的内容，填充container；

- 5.隐藏mask层，移动到屏幕右侧；

### 页面动画实现 (退出)

1.获取当前主容器的dom

2.在destory之后，把dom填充到mask里并覆盖在container之上；

3.开始执行back里的
