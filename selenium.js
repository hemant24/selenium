
$(document).ready(function(){
	var t1= $("body");
	var id = 0;
	var allElements = {}
	elItrate(t1)
	function elItrate(el){
		el.contents().each(function(){
				var $this = $(this);
				if($this.children().length != 0){
					$this.contents().each(function(){
						elItrate($(this));
					})
				}else{
				
					var nodeType = analyseType($this);
					if(nodeType){
						if( ! allElements[nodeType] ){
							allElements[nodeType] = new Array();
						}
						allElements[nodeType].push ( {
								id : ++id,
								//obj : $this,
								attributes : giveAttributes($this)
								
							} )
						
					}
				}
				
			})
	}
	
	function giveAttributes(el){
		var attributes = el[0].attributes;
		var result = [];
		for(var i in attributes){
			var attr = attributes[i]
			if(typeof attr == 'object' ){
				result.push({
					name : attr.nodeName,
					value : attr.nodeValue
				})
			}
		}
		return result ;
	}
	
	function analyseType(el){
		var supportedType = ['INPUT','A','#text','BUTTON']
		var nodeType = el[0].nodeName;
		var result = null;
		if(supportedType.indexOf(nodeType) != -1){
			if(nodeType == "#text" && $.trim(el.text().replace(/\n/g,'')) != ""){
				nodeType = 'TEXT';
			}else if( nodeType == "#text" ){
				nodeType = null;
			}
			
			
			
			result = nodeType ;
		}
		return result;
	}
	
	function createGenerator(){
		var generateButton = $("<button>Generate</button>");
		var myDiv = $("<div class='i18n' style='height:300px;position:fixed;overflow:scroll;background-color:white;z-index:900;'></div>")
		var myBackgroundDiv = $("<div class='i18nbk' style='height:300px;'></div>")
		$("body").prepend(myBackgroundDiv);
		$("body").prepend(myDiv);
		generateButton.click(handleGenerate);
		myDiv.append(generateButton);
		
		for(var i in allElements){
			var locatorTypeList = allElements[i]
			var header=$("<p></p>");
			var ul = $("<ul></ul>");
			header.text(i);
			myDiv.append(header);
			myDiv.append(ul);
			for(var x in locatorTypeList){
				var locatorAttr = locatorTypeList[x].attributes;
				var li = $("<li></li>");
				li.text(locatorTypeList[x].id)
				ul.append(li);
				for(var y in locatorAttr){
					var attr = locatorAttr[y];
					var radioBtn = $('<input type="radio" name="'+ locatorTypeList[x].id +'" >' +attr.name +'='+ attr.value+'</input>')
					radioBtn.attr('data-key', attr.name )
					radioBtn.click(handleAttrSelect)
					li.append(radioBtn)
					
				}
			}
		}
		
	}
	
	createGenerator()
	
	function handleAttrSelect(){
		var id = $(this).attr('name')
		var element = getElement(id)
		var attributes = element.attributes
		for ( var i in attributes){
			if($(this).attr('data-key') == attributes[i].name){
				element.selectedAttribute = attributes[i]
				break;
			}
		}
		
	}
	
	
	function getElement(id){
		for(var i in allElements){
			for( var x in allElements[i]){
				var element = allElements[i][x]
				if(element.id == id){
					return element;
				}
			}
		}
	}
	
	function handleGenerate(){
			console.log(allElements)
	}
	
	
	//console.log(allElements)
});