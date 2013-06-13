
$(document).ready(function(){
	
	var id = 0;
	
	var allElements = {}
	
	var t1= $("body");
	
	var DomParser = {
		parse : function (el){
			el.contents().each(function(){
					var $this = $(this);
					if($this.children().length != 0){
						$this.contents().each(function(){
							DomParser.parse($(this));
						})
					}else{
					
						var nodeType = DomParser.analyseType($this);
						if(nodeType){
							if( ! allElements[nodeType] ){
								allElements[nodeType] = new Array();
							}
							allElements[nodeType].push ( {
									id : ++id,
									//obj : $this,
									attributes : DomParser.giveAttributes($this)
									
								} )
							
						}
					}
					
				})
		},
		giveAttributes : function (el){
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
		},
		analyseType	: function (el){
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
		
	
	}
	
	var Viewer = {
		display : function (){
			var generateButton = $("<button>Generate</button>");
			var myDiv = $("<div class='i18n' style='height:300px;position:fixed;overflow:scroll;background-color:white;z-index:900;'></div>")
			var myBackgroundDiv = $("<div class='i18nbk' style='height:300px;'></div>")
			$("body").prepend(myBackgroundDiv);
			$("body").prepend(myDiv);
			generateButton.click(Generator.generate);
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
						radioBtn.attr('data-value', attr.value )
						radioBtn.click(Viewer.handleAttrSelect)
						li.append(radioBtn)
						
					}
					var selectorInput = $('<input type="text" name="'+ locatorTypeList[x].id +'" ></input>')
					selectorInput.blur(Viewer.handleOnBlur)
					li.append(selectorInput);
				}
			}
		
		},
		handleAttrSelect : function (){
			var selectorInput = $(this).parent('li').find('input[type="text"]')
			var id = $(this).attr('name')
			var element = Viewer.getElement(id)
			var key = $(this).attr('data-key')
			var value = $(this).attr('data-value')
			selectorInput.val("//*[@"+key+"='"+value+"']")
			element.selector = selectorInput.val()
		},
		handleOnBlur : function(){
		if($(this).val().length > 0){
				var id = $(this).attr('name')
				var element = Viewer.getElement(id)
				element.selector = $(this).val()
			}
		},
		getElement : function (id){
			for(var i in allElements){
				for( var x in allElements[i]){
					var element = allElements[i][x]
					if(element.id == id){
						return element;
					}
				}
			}
		}
	}
	
	var Generator = {
		generate : function(){
			console.log(allElements)
		}
	}

	
	
	DomParser.parse(t1)
	
	Viewer.display()

});