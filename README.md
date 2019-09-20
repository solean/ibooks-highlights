# ibooks-highlights

If you have iBooks highlights/annotations on your Mac (which should also be synced with your other iCloud devices),
you can use this module to extract them from the obscure sqlite database that they are stored in.



Example of extracting the highlights in JSON and spitting them to the console:

`$ npm install ibooks-highlights`

```
const ibooks = require('ibooks-highlights');
ibooks.getAnnotations().then(console.log);
```
