!function(e,a){"use strict";var t=location.pathname.replace(/\/[^/]+$/,""),n=location.hostname.search("landmark.blueraster.io")>-1,t=n?t.replace("map","map-app"):t,s="1.0.9",i="3.13",o=["//js.arcgis.com/"+i+"/init.js"],m=["//js.arcgis.com/"+i+"/esri/css/esri.css","//js.arcgis.com/"+i+"/dijit/themes/tundra/tundra.css"],r={parseOnLoad:!0,async:!0,cacheBust:"v="+s,packages:[{name:"js",location:t+"/js"},{name:"libs",location:t+"/libs"},{name:"main",location:t+"/js/main"},{name:"map",location:t+"/js/map"},{name:"utils",location:t+"/js/utils"},{name:"components",location:t+"/js/components"}],aliases:[["react","https://fb.me/react-0.13.0.min.js"]],deps:["dojo/domReady!"],callback:function(){c(n?"/map-app/js/loader.js":"js/loader.js")}},c=function(e){var t=a.createElement("script"),n=a.getElementsByTagName("head")[0];t.src=e,t.async=!0,n.appendChild(t)},l=function(e){var t=a.createElement("link"),n=a.getElementsByTagName("head")[0];t.rel="stylesheet",t.type="text/css",t.href=e,n.appendChild(t)};e.requestAnimationFrame=function(){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame}();var p=function(){e.dojoConfig=r;for(var a=0;a<m.length;a++)l(m[a]);for(var t=0;t<o.length;t++)c(o[t])};e.requestAnimationFrame?e.requestAnimationFrame(p):"complete"===a.readyState?p():e.onload=p}(this,document);