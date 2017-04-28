(function(d,f){var n="",s,m={Webkit:"webkit",Moz:"",O:"o"},a=document.createElement("div"),l=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,j,o,i,k,e,h,r,p,b,q={};function c(t){return t.replace(/([a-z])([A-Z])/,"$1-$2").toLowerCase()}function g(t){return s?s+t:t.toLowerCase()}d.each(m,function(u,t){if(a.style[u+"TransitionProperty"]!==f){n="-"+u.toLowerCase()+"-";s=t;return false}});j=n+"transform";q[o=n+"transition-property"]=q[i=n+"transition-duration"]=q[e=n+"transition-delay"]=q[k=n+"transition-timing-function"]=q[h=n+"animation-name"]=q[r=n+"animation-duration"]=q[b=n+"animation-delay"]=q[p=n+"animation-timing-function"]="";d.fx={off:(s===f&&a.style.transitionProperty===f),speeds:{_default:400,fast:200,slow:600},cssPrefix:n,transitionEnd:g("TransitionEnd"),animationEnd:g("AnimationEnd")};d.fn.animate=function(u,v,w,x,t){if(d.isFunction(v)){x=v,w=f,v=f}if(d.isFunction(w)){x=w,w=f}if(d.isPlainObject(v)){w=v.easing,x=v.complete,t=v.delay,v=v.duration}if(v){v=(typeof v=="number"?v:(d.fx.speeds[v]||d.fx.speeds._default))/1000}if(t){t=parseFloat(t)/1000}return this.anim(u,v,w,x,t)};d.fn.anim=function(B,w,v,D,x){var C,z={},F,A="",y=this,u,E=d.fx.transitionEnd,t=false;if(w===f){w=d.fx.speeds._default/1000}if(x===f){x=0}if(d.fx.off){w=0}if(typeof B=="string"){z[h]=B;z[r]=w+"s";z[b]=x+"s";z[p]=(v||"linear");E=d.fx.animationEnd}else{F=[];for(C in B){if(l.test(C)){A+=C+"("+B[C]+") "}else{z[C]=B[C],F.push(c(C))}}if(A){z[j]=A,F.push(j)}if(w>0&&typeof B==="object"){z[o]=F.join(", ");z[i]=w+"s";z[e]=x+"s";z[k]=(v||"linear")}}u=function(G){if(typeof G!=="undefined"){if(G.target!==G.currentTarget){return}d(G.target).unbind(E,u)}else{d(this).unbind(E,u)}t=true;d(this).css(q);D&&D.call(this)};if(w>0){this.bind(E,u);setTimeout(function(){if(t){return}u.call(y)},((w+x)*1000)+25)}this.size()&&this.get(0).clientLeft;this.css(z);if(w<=0){setTimeout(function(){y.each(function(){u.call(this)})},0)}return this};a=null})(Zepto);