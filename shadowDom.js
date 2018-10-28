HTMLElement.prototype.createShadowRoot = 
    HTMLElement.prototype.createShadowRoot ||
    HTMLElement.prototype.webkitCreateShadowRoot || 
    function(){}
var tmpl = document.querySelector("#content");
var host = document.querySelector("#shadow-dom-host");
var root = host.createShadowRoot();
root.appendChild(document.importNode(tmpl.content, true));