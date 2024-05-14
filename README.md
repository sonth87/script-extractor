# script-extractor
extract script and it's properties from string


Executing extract
Transform:

```
"<script async src='https://www.googletagmanager.com/gtag/js?id=G-SKYJESDIW1X' />"
  |
  V
<script async src='https://www.googletagmanager.com/gtag/js?id=G-SKYJESDIW1X' />
```


```
"<script>console.log('this is script')</script>"
  |
  V
<script>console.log('this is script')</script>
```

```
"<script async defer >console.log('this is script')</script>"
  |
  V
<script async defer >console.log('this is script')</script>
```

```
"alert('alert script')"
  |
  V
<script>alert('alert script')</script>
```
