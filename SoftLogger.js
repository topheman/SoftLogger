/*
Copyright (C) 2013 Christophe Rosset <tophe@topheman.com>

Released under the MIT license:
https://github.com/topheman/SoftLogger/blob/master/LICENSE

/**
 * 
 * @param {Object} options
 *   @logMaxNumber {Int}
 *   @fitToCanvas {Boolean}
 *   @ctxOptions {Object}
 *      @x {Int}
 *      @y {Int}
 *      @lineHeight {Int}
 *      @fillStyle {Int}
 *      @font {Int}
 *      @x {Int}
 * @returns {SoftLogger}
 *
 */
function SoftLogger(options){
    
    if ( SoftLogger.caller !== SoftLogger.getInstance ) {  
        throw new Error("This object cannot be instanciated");
    }
    
    if(!console){
        console = {};
        console.log = function(){};
        console.info = function(){};
    }
    
    options = options ? options : {};
    
    var logMaxNumber,
        logs = [],
        lastLog = null,
        lastLogIteration = 1,
        log,
        oldConsoleLog,
        logging = false,
        tmpLogMaxNumber,
        canvas, ctxOptions;
    
    //init options
    if(options.fitToCanvas){
        if(options.fitToCanvas.nodeName !== 'CANVAS'){
            throw new Error('Please pass canvas node via fitToCanvas attribute');
        }
        else{
            canvas = options.fitToCanvas;
        }
    }
    ctxOptions = options.ctxOptions ? options.ctxOptions : {};
    ctxOptions.x = typeof ctxOptions.x !== 'undefined' ? ctxOptions.x : 10;
    ctxOptions.y = typeof ctxOptions.y !== 'undefined' ? ctxOptions.y : 10;
    ctxOptions.lineHeight = typeof ctxOptions.lineHeight !== 'undefined' ? ctxOptions.lineHeight : 14;
    ctxOptions.fillStyle = typeof ctxOptions.fillStyle !== 'undefined' ? ctxOptions.fillStyle : "black";
    ctxOptions.font = typeof ctxOptions.font !== 'undefined' ? ctxOptions.font : "Arial 12px";
    
    
    //init logMaxNumber
    if(canvas){
        tmpLogMaxNumber = ((canvas.height - ctxOptions.y) - (canvas.height - ctxOptions.y)%ctxOptions.lineHeight)/ctxOptions.lineHeight;
        if(!options.logMaxNumber || (options.logMaxNumber && options.logMaxNumber > tmpLogMaxNumber)){
            logMaxNumber = tmpLogMaxNumber;
        }
    }
    else{
        logMaxNumber = options.logMaxNumber > 0 ? options.logMaxNumber : 10;
    }
    
    oldConsoleLog = console.log;
    
    log = function(){
        var result = '',i;
        //process the arugments to a string
        for(i=0; i<arguments.length; i++){
            if(i > 0){
                result += ', ';
            }
            result += arguments[i] !== null ? typeof arguments[i] !== 'undefined' ? arguments[i].toString() : 'undefined' : 'null';
        }
        //compare to the last log and add it to the logs
        if(lastLog === result){
            lastLogIteration++;
            logs.splice(logs.length-1,1);
            logs.push(result + '('+lastLogIteration+')');
        }
        else{
            lastLogIteration = 1;
            lastLog = result;
            logs.push(result);
        }
        //crop the logs array if > logsMaxNumber
        if(logs.length > logMaxNumber){
            logs.splice(0,1);
        }
    };
    
    /**
     * Toggles from catching console entries to normal console mode
     */
    this.toggleConsole = function(){
        //only works if console api is present
        if(oldConsoleLog){
            //catch the console entries, redirect them to SoftLogger
            if(logging === false){
                console.log = log;
                logging = true;
            }
            //switch back to normal consol logging
            else{
                console.log = oldConsoleLog;
                logging = false;
            }
        }
    };
    
    /**
     * Returns an array of the logs of the length logMaxNumber
     * @returns {Array}
     */
    this.getLogs = function(){
        return logs;
    };
    
    this.draw = function(ctx){
        ctx.save();
        ctx.fillStyle   = ctxOptions.fillStyle;
        ctx.font        = ctxOptions.font;
        for(var i=0; i< logs.length; i++){
            ctx.fillText(logs[i], ctxOptions.x, ctxOptions.y+i*ctxOptions.lineHeight);
        }
        ctx.restore();
    };
    
    //switch on catching console entries
    this.toggleConsole();
    
}

SoftLogger.instance = null;

SoftLogger.getInstance = function(logMaxNumber){
    if(this.instance === null){
        this.instance = new SoftLogger(logMaxNumber);
    }
    return this.instance;
};