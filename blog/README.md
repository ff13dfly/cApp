# Summary

Blog cApp, you can write blog on Anchor network.

## Definition

- Entry list 
  
```JSON
{"list":[]}
```

- Blog row 
  
```JSON
{"title": "","content":"","tags":[]}
```

## Test Data

- blog cApp anchor : blog

```JSON
{"type":"app"}
```

- blog entry anchor : bbc
  
  ```JSON
  {"list":["blog_c"]}
  ```
  
  protocol
  
  ```JSON
  {"type":"data","format":"json"}
  ```

- blog entry anchor : blog_list
  
  ```JSON
  {"list":["blog_a","blog_b","blog_c"]}
  ```
  
  protocol
  
  ```JSON
  {"type":"data","format":"json"}
  ```

- blog anchor : blog_a
  
* content
  
  ```JSON
  {"title": "Mahinda Rajapaksa: Sri Lankan PM resigns amid economic crisis","content":"Sri Lanka's Prime Minister Mahinda Rajapaksa has resigned amid mass protests at the government's handling of a deepening economic crisis.  The move came as the island was placed under curfew after violent clashes between Rajapaksa supporters and anti-government protesters in Colombo.  Five people have died, including a ruling party MP, and more than 190 injured in violence in the capital.  There have been protests over soaring prices and power cuts since last month.  The island nation is facing its worst economic crisis since gaining independence from Britain in 1948.  Mr Rajapaksa, 76, sent his resignation letter to his younger brother President Gotabaya Rajapaksa, saying he hoped it would help resolve the crisis, but the move is highly unlikely to satisfy government opponents while the latter remains in power."}
  ```

* protocol
  
  ```JSON
  {"type":"data","format":"json"}
  ```

- blog anchor : blog_b
  
* content
  
```JSON
{"title": "Odesa under further missile attacks","content":"The city of Odesa, Ukraine, has come under further missile attacks Monday evening local time.   Around 10 p.m. local time (3 p.m. ET), witnesses in the center of the city said they heard several large explosions which shook buildings.  Social media showed at least one large fire burning. and a witness said a large shopping center was on fire. The resident of a city more than 40 kilometers (25 miles) from Odesa reported hearing the blasts.   A few hours earlier, Odesa city council reported three cruise missiles were fired from a Tu-22 bomber. Five buildings were destroyed and two people injured.  The targets were unknown but some images from Odesa suggested a mixed residential-industrial area had been hit.  Video released by the city council showed widespread devastation across a wide area.   On Monday morning authorities four sea-launched Onyx cruise missiles were fired towards Odesa.   The earlier attacks came as European Council President Charles Michel visited Odesa.  On Sunday, ten cruise missiles were fired at the Odesa area. Russia has used submarines, surface ships and aircraft to launch missiles at Odesa in recent days."}
  ```

* protocol
  
  ```JSON
  {"type":"data","format":"json"}
  ```

- blog anchor : blog_c
  
* content
  
```JSON
{"title": "cApp development is so easy","content":"It is simple to develop an application on chain via Anchor network. You can run a pure cApp by writing 200 rows JS code."}
```

* protocol
  
```JSON
{"type":"data","format":"json"}
```
