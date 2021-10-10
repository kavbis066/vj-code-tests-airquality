function changeLang(lang) {
    var translate = new Translate();
    var currentLang = lang;
    var attributeName = 'data-tag';
    translate.init(attributeName, currentLang);
    translate.process();
    translate.populate();
}

function Translate() {
    //initialization
    this.init = function (attribute, lang) {
        this.attribute = attribute;
        this.lang = lang;
    }

    //translate
    this.process = function() {
        _self = this;
        var xhrFile = new XMLHttpRequest();
        // load content data
        xhrFile.open("GET", "./language/"+this.lang+".json", false);
        xhrFile.onreadystatechange = function () {
            if (xhrFile.readyState === 4) {
                if (xhrFile.status === 200 || xhrFile.status === 0) {
                    var langObject = JSON.parse(xhrFile.responseText);
                    console.log(langObject["name1"]);
                    var allDom = document.getElementsByTagName("*");
                    for (var i= 0; i < allDom.length; i++) {
                        var elem = allDom[i];
                        var key = elem.getAttribute(_self.attribute);
                        //console.log(key);
                        if(key != null) {
                            console.log(key);
                            elem.innerHTML = langObject[key];
                        }
                    }                                
                }
            }
        };
        xhrFile.send();
    }

    this.populate = function (){
        _self = this;
        
        var xhr = new XMLHttpRequest(),
                    method = 'GET',
                    overrideMimeType = 'application/json',
                    url = `./language/${this.lang}-city.json`;
        //xhr.open("GET", "./language/"+this.lang+"-city.json", false);
        xhr.onreadystatechange = function (){
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
                var langObject = JSON.parse(xhr.responseText);
                var search = document.getElementById('search');
                for (var myObj in langObject){
                    search.innerHTML = `${search.innerHTML}<option>${langObject[myObj].name}</option>`;
                }
            }
            
        };
        xhr.open(method, url, true)
        xhr.send();
    }
}

function show(search) {
    var result = document.getElementById('results');
    result.innerHTML = search.value;
}