var supertext = {};
var supertext_store = {}
supertext.store = function(component){
    if(!supertext_store.init){
        var dataStore = component.data;
        dataStore.init = 1;
        supertext_store = dataStore;
    }
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

//superActions
supertext.isValidTag = function(tag) {
  var valid = false;
  for (var i in supertext.tags) {
    var vtag = supertext.tags[i];
    if (vtag == tag) {
      valid = true;
      break;
    }
  }
  return valid;
};

supertext.getStore = function(key = null){
    if(key && supertext_store[key]){
        return supertext_store[key]
    }else{
        console.error("Store is null");
        return '';
    }
}
supertext.setStore =function(key = null, content = null){
    if(!key){
        console.error('store_key is undefined')
    }
    if(key && content){
        if(!supertext_store[key]){
            supertext_store[key] = ""
        }
            
        supertext_store[key] = content; 
    }
} 

//SuperTags
supertext.event = function(eventName,action){
    return {
        type:'event',
        eventName: eventName,
        action: action
    }
}
supertext.attribute = function(name, content){
    return {
        type:'attribute',
        name:name,
        content:content
    }
}
supertext.data = function(name){
    return {
        type:'data',
        name:name
    }
}

supertext.list = function(data,template){
    return {
        type:'list',
        template: template,
        data: data
    }
}

supertext.eventData = function(key, content){
    if(!content && key){
        return supertext.getStore(key);
    }
    if(key && content){
        supertext.setStore(key, content);
    }
}

isObject = function(item){
    return typeof item == 'object';
}   
supertext.element_old = function(tag) {
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
            
        }
        if(isObject(item) && item.type == 'attribute'){
            element.setAttribute(item.name, item.content);
        }
        if(isObject(item) && item.type == 'data'){
        
            element.innerHTML = supertext.getStore(item.name);
        }
        if( typeof item == 'number'){
            element.innerHTML = item;
        }
    }
    return element;
  };
};
supertext.element = function(tag){
    return function() {
        var items = []
        for(i in arguments){
            items.push(arguments[i])
        }
        return {
            tag:tag,
            childs:items
        }
    }
}
supertext.componentList = []
supertext.TEMPLATES = []
supertext.template = function(name, element){
    supertext.TEMPLATES[name] = function(){
        return element;
    }
}
supertext.getTemplate = function (name){
    return supertext.TEMPLATES[name];
} 
supertext.componentList = []
supertext.component = function(name,options){
    options.name = name;
    supertext.componentList.push(options);
}
supertext.getComponent = function(name){
    var item_component = false
    for( i in supertext.componentList){
        var item = supertext.componentList[i]
        if(name == item.name){
            item_component = item;
            break;
        };   
    }
    return item_component;
}
supertext.body = function(element){
   supertext.clear()
   document.body.append(element)
    
}
supertext.clear = function(){
    document.body.innerHTML ='';
}
supertext.appendChilds = function(element,childs, component){
    var data = component.data;
    for(i in childs){
        item = childs[i]
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
                    element.append(document.createTextNode(item));
                    break;

            }    
        }
        if(item.type == 'data'){
            var item_data = data[item.name];
            element.append(document.createTextNode(item_data));
        }
        if(item.type == 'event'){
            var action = function(){}
            if(typeof item.action == 'string'){
                if(component.actions && 
                component.actions[item.action] && 
                typeof component.actions[item.action] == 'function'
                ){
                    action = component.actions[item.action]
                }
            }
            if(typeof item.action == 'function'){
                action = item.action;
            }
            element.addEventListener(item.eventName, function(){action(supertext.eventData)}, true);
        }
        if(item.type == 'list'){
            
            var list_data = data[item.data];
            var v_template = item.template
            for(var i in list_data){
                var list_data_item = list_data[i]
                

                var v_component = {
                    actions: component.actions,
                    data:list_data_item
                }
                
                
                var v_element = document.createElement(v_template.tag)
                v_element = supertext.appendChilds(v_element, v_template.childs, v_component);
                element.append(v_element);    
            
            }
        }
        if(isObject(item) && supertext.isValidTag(item.tag)){    
            var item_element = document.createElement(item.tag)
            item_element = supertext.appendChilds(item_element,item.childs, component);
            element.append(item_element);
        }
    }
    return element;
}
supertext.render = function(name){
    
    var component = supertext.getComponent(name);
    var tag = component.template.tag
    var element = document.createElement(tag)
    element = supertext.appendChilds(element, component.template.childs, component);
    return element;
}