/*
 * jQuery JSON Plugin
 * version: 2.1 (2009-08-14)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org 
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is 
 * copyrighted 2005 by Bob Ippolito.
 */
 
(function($) {
    /** jQuery.toJSON( json-serializble )
        Converts the given argument into a JSON respresentation.

        If an object has a "toJSON" function, that will be used to get the representation.
        Non-integer/string keys are skipped in the object, as are keys that point to a function.

        json-serializble:
            The *thing* to be converted.
     **/
    $.toJSON = function(o)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o);
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON() );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push( $.toJSON(o[i]) || "null" );

                return "[" + ret.join(",") + "]";
            }
        
            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                if (typeof o[k] == "function") 
                    continue;  //skip pairs where the value is a function.
            
                var val = $.toJSON(o[k]);
            
                pairs.push(name + ":" + val);
            }

            return "{" + pairs.join(", ") + "}";
        }
    };

    /** jQuery.evalJSON(src)
        Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
})(jQuery);

var Fileify = {
  render_applet: function(){
    jar_file = "fileify.jar";
    s = "<!--[if !IE]> Firefox and others will use outer object -->";
    s += "<object classid='java:name.colyer.matt.fileify.FileService' height='1' id='FileService' name='FileService' type='application/x-java-applet;version=1.5' width='1'>";
    s += "<param name=\"archive\" value=\""+jar_file+"\" />";
    s += "<param name='mayscript' value='true' />";
    s += "<!--<![endif]-->";
    s += "<!-- MSIE (Microsoft Internet Explorer) will use the inner object -->";
    s += '<object id="GitService" classid="clsid:CAFEEFAC-0016-0000-0000-ABCDEFFEDCBA" codebase="http://java.sun.com/out-of-proc-plugin-url-placeholder.exe#1,6,0,16" height="1" width="1" >';
    s += "<param name=\"archive\" value=\""+jar_file+"\" />";
    s += "<param name='code' value='name.colyer.matt.fileify.FileService' />";
    s += "<param name='mayscript' value='true' />";
    s += "<div style='display:none'></div>";
    s += "</object>";
    s += "<!--[if !IE]> close outer object -->";
    s += "</object>";
    s += "<!--<![endif]-->";
    document.write(s);
  },

  loaded : function(){
    Fileify.applet = Fileify._get_service();
    $(document).trigger("fileifyready");
  },

  read : function(filename){
    return $.evalJSON(Fileify.applet.runPrivileged("read", $.toJSON([filename])));
  },

  write : function(filename, content){
    return $.evalJSON(Fileify.applet.runPrivileged("write", $.toJSON([filename, content])));
  },

  _get_service : function(){
    // Safari allows access to both but only document.applets works.
    if (document.applets && document.applets['FileService']){
      return document.applets['FileService'];
    }else{
      return document.FileService;
    }
  }
}

var applet_loaded_min = function(){
  Fileify.loaded();
}
Fileify.render_applet();
