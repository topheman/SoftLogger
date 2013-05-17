SoftLogger
==========

Simple logger that overrides console.log and let's you inject it in a canvas (or wherever you want).

Example using SoftLogger : http://topheman.github.io/boxbox/boxbox/demos/topheman/smileyFaces/demo.html

Instanciation :

```js
//retrieve your canvas
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

//instanciate your logger
var logger = SoftLogger.getInstance({
    fitToCanvas:true,
    canvas: canvas,
    ctxOptions : {
        x: 10,
        y: 10
    }
});

//then, in your animation/game loop, use the draw method
logger.draw(ctx);
```

Methods

SoftLogger.getInstance(options)

.draw(ctx)

.toggleConsole()

.getLogs()

Copyright (C) 2013 Christophe Rosset <tophe@topheman.com>

Released under the MIT license:
https://github.com/topheman/SoftLogger/blob/master/LICENSE