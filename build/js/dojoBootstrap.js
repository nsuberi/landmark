!function(e,a){"use strict";var n=location.pathname.replace(/\/[^/]+$/,""),t=location.hostname.search("landmarkmap.org")>-1,n=t?n.replace("map","map-app"):n,s="1.1.6",o="3.13",i=["//js.arcgis.com/"+o+"/init.js"],m=["//js.arcgis.com/"+o+"/esri/css/esri.css","//js.arcgis.com/"+o+"/dijit/themes/tundra/tundra.css"],r={parseOnLoad:!0,async:!0,cacheBust:"v="+s,packages:[{name:"js",location:n+"/js"},{name:"libs",location:n+"/libs"},{name:"main",location:n+"/js/main"},{name:"map",location:n+"/js/map"},{name:"utils",location:n+"/js/utils"},{name:"components",location:n+"/js/components"}],aliases:[["react","https://fb.me/react-0.13.0.min.js"]],deps:["dojo/domReady!"],callback:function(){c(t?"/map-app/js/loader.js":"js/loader.js")}},c=function(e){var n=a.createElement("script"),t=a.getElementsByTagName("head")[0];n.src=e,n.async=!0,t.appendChild(n)},l=function(e){var n=a.createElement("link"),t=a.getElementsByTagName("head")[0];n.rel="stylesheet",n.type="text/css",n.href=e,t.appendChild(n)};e.requestAnimationFrame=function(){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame}();var p=function(){e.dojoConfig=r;for(var a=0;a<m.length;a++)l(m[a]);for(var n=0;n<i.length;n++)c(i[n])};e.requestAnimationFrame?e.requestAnimationFrame(p):"complete"===a.readyState?p():e.onload=p}(this,document);