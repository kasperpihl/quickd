/** Basic upload manager for single or multiple files (Safari 4 Compatible)
 * @author  Andrea Giammarchi
 * @blog    WebReflection [webreflection.blogspot.com]
 * @license Mit Style License
 */
var sendFile = 10485760; // maximum allowed file size (5mb)
                        // should be smaller or equal to the size accepted in the server for each file

// function to upload a single file via handler
sendFile = (function(toString, maxSize){
    var isFunction = function(Function){return  toString.call(Function) === "[object Function]";},
        split = "onabort.onerror.onloadstart.onprogress".split("."),
        length = split.length;
    return  function(handler){
        if(maxSize && maxSize < handler.file.fileSize){
            if(isFunction(handler.onerror))
                handler.onerror();
            return handler;
        };
        var xhr = new XMLHttpRequest,
            upload = xhr.upload;
			
		log("upload? ", upload);
        for(var i = 0; i < length;  i++  )
            upload[split[i]] = (function(event){
                return  function(rpe){
                    if(isFunction(handler[event]))
                        handler[event].call(handler, rpe, xhr);
                };
            })(split[i]);
		
        upload.onload = function(rpe){
            if(handler.onreadystatechange === false){
                if(isFunction(handler.onload))
                    handler.onload(rpe, xhr);
            } else {
                setTimeout(function(){
                    if(xhr.readyState === 4){
                        if(isFunction(handler.onload))
                            handler.onload(rpe, xhr);
                    } else {
                        setTimeout(arguments.callee, 15);
					}
                }, 15);
            }
        };
		//log("headers", handler.file.fileName, handler.file.fileSize);
        xhr.open("post", handler.url+"?upload=true", true);
        xhr.setRequestHeader("If-Modified-Since", "Mon, 26 Jul 1997 05:00:00 GMT");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("X-File-Name", handler.file.fileName);
        xhr.setRequestHeader("X-File-Size", handler.file.fileSize);
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(handler.file);
        return  handler;
    };
})(Object.prototype.toString, sendFile);

// function to upload multiple files via handler
function sendMultipleFiles(handler){
    var length = handler.files.length,
        i = 0,
        onload = handler.onload;
    handler.current = 0;
    handler.total = 0;
    handler.sent = 0;
    while(handler.current < length)
        handler.total += handler.files[handler.current++].fileSize;
    handler.current = 0;
    if(length){
        if(handler.onBeforeSend) handler.onBeforeSend();
		handler.file = handler.files[handler.current];
        sendFile(handler).onload = function(rpe, xhr){
			if (handler.onImgUploaded) handler.onImgUploaded(rpe, xhr);           
		    if(++handler.current < length){
                handler.sent += handler.files[handler.current - 1].fileSize;
                handler.file = handler.files[handler.current];
                var imgHandler = sendFile(handler);
				if (imgHandler) imgHandler.onload = arguments.callee;
            } else if(onload) {
                handler.onload = onload;
                handler.onload(rpe, xhr);
            }
        };
    };
    return  handler;
};