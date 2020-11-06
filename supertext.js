var supertext = {};
var STORE = {}
supertext.store = function(dataStore){
    STORE = dataStore;
}
supertext.events = []
supertext.tags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "head",
  "header",
  "hgroup",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];
supertext.isValidTag = function(tag) {
  var valid = false;
  for (var i in supertext.tags) {
    var vtag = supertext.tags[i];
    if (vtag == tag) {
      valid = true;
      break;
    }
  }
};
supertext.render =function(){
    supertext.data("html", template());
    supertext.body(supertext.data('contador'));
}
supertext.data = function(get = null, set =null){
    if(get && set){
        if(STORE[get]){
            STORE[get] = set;  
        }else{
            STORE[get] = ""
            STORE[get] = set; 
        }
    }else
    if(get){
        return STORE[get]
    }else{
        console.error("Store is null");
    }
}
supertext.event = function(eventName,action){
    var data = supertext.data;
    return {
        type:'event',
        eventName: eventName,
        action: function(){ action(data); supertext.render() } 
    }
}
supertext.attribute = function(name, content){
    return {
        type:'attribute',
        name:name,
        content:content
    }
}


isObject = function(item){
    return typeof item == 'object';
}   
supertext.element = function(tag) {
  return function() {
   
    element = document.createElement(tag);
    for(i in arguments){
        item = arguments[i]
    
        if(typeof item == 'string'){
            var key = item.charAt(0);
            var content = '' 
            switch(key){
                case '.':
                    content = item.replace(".", "")
                    element.classList.add(content); 
                    break;
                case '#':
                    content = item.replace("#", "")
                    element.id = content;
                    break;
                default:
                    element.innerHTML = item;
                    break;

            }    
        }
        if(isObject(item) && item.tagName){
            element.append(item);
        }
        if(isObject(item) && item.type == 'event'){
            element.addEventListener(item.eventName, item.action, true);
        }
        if(isObject(item) && item.type == 'attribute'){
            element.setAttribute(item.name, item.content);
        }
        if( typeof item == 'number'){
            element.innerHTML = item;
        }
    }
    return element;
  };
};
supertext.componentList = []
supertext.component = function(name){
    return function(element){
        return element;
    }
}
supertext.body = function(element){
    supertext.clear();
    document.body.append(element);
}
supertext.clear = function(){
    document.body.innerHTML ='';
}
