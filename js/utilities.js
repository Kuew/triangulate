// handles global functions for this app
var utilities = {
    
    init:function(){
    
    	// enable tooltip
	  	if(!Modernizr.touch){ 
	  		$('.show-tooltip').tooltip({container: 'body', placement: 'bottom'});
	  	}
      
        // toggle nav
        $(document).on('click', '.show-menu, .hide-menu', function(){
            $('body').toggleClass('show-nav'); 
        });
        
        // segmented control
        $(document).on('click', '.segmented-control li', function(){
        
        	// hide other segements
			var lis = $(this).parents('.segmented-control').find('li');
			
			for(x=0; x<lis.length; x++){
				var target = $(lis[x]).attr('data-target');
				
				$(target).addClass('hidden');
				$(lis[x]).removeClass('active');
			}
        
			// show current segment
	        var target = $(this).attr('data-target');
	        $(target).removeClass('hidden');
	        $(this).addClass('active');
        });
        
        // set current page in menu
        var currpage = $('body').data('currpage');
        $('.menu-'+currpage).addClass('active');
        
        // setup dropdown control
        $(document).on('click', '.dropdown-menu a', function(){
	        
	        var value = $(this).attr('data-value');
	        
	        var input = $(this).parents('.form-group').find('input');
	        
	        console.log(input);
	        
	        $(input).val(value);
	        $(input).trigger('change');
	        
        });
        
         // setup toggle
        $(document).on('click', '[data-toggle]', function(){
	        
	        var node = $(this).attr('data-toggle');
	        
	        $(node).toggleClass('hidden');
	        
        });
       
    },
    
    // reset segmented control
    resetSegmentedControl:function(selector){
	  
	 	 // hide other segements
		var lis = $(selector).find('li');
		
		for(x=0; x<lis.length; x++){
			var target = $(lis[x]).attr('data-target');
			
			$(target).addClass('hidden');
			$(lis[x]).removeClass('active');
		}
    
		// show current segment
        var first = $(selector).find('li:first-child');
        var target = first.attr('data-target');
        
        $(first).addClass('active');
        $(target).removeClass('hidden');
        
    },
    
    // basic email validation, ref: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    veryBasicEmailValidation:function(email){
	
    	var re = /\S+@\S+\.\S+/;
		return re.test(email);
	    
    },
    
    // use Google maps to geocode address, #ref: https://developers.google.com/maps/documentation/javascript/geocoding
    geocode:function(address, callback){
    
    	try{
	    	if(google.maps.Geocoder){
	    
				var geocoder = new google.maps.Geocoder();
				
				geocoder.geocode({'address': address}, function(results, status){
				
					console.log('fn geocode: ' + results);
				
					if (status == google.maps.GeocoderStatus.OK){
						// #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
						callback(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
					}
				
				});
		      
	      	}
	      	else{
		      	return false;
	      	}
      	}
      	catch(e){
	      	return false;
      	}

    },

    // use Google maps to reverse geocode address, #ref: https://developers.google.com/maps/documentation/javascript/geocoding
    reverseGeocode:function(latitude, longitude, callback){
		
		try{
			if(google.maps.Geocoder){
	
				var latLng  = new google.maps.LatLng(latitude, longitude);
				var geocoder = new google.maps.Geocoder();
				
				geocoder.geocode({'latLng': latLng}, function(results, status){
				
					console.log(results);
				
					if (status == google.maps.GeocoderStatus.OK){
						// #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
						callback(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
					}
				
				});
			
			}
	      	else{
		      	return false;
	      	}
      	}
      	catch(e){
	      	return false;
      	}

    },
	
	// gets a query string variable by name	
	getQueryStringByName:function(name){
		  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		  var regexS = "[\\?&]" + name + "=([^&#]*)";
		  var regex = new RegExp(regexS);
		  var results = regex.exec(window.location.href);
		  if(results == null)
		    return "";
		  else
		    return decodeURIComponent(results[1].replace(/\+/g, " "));
	},

	// gets the selected text
	getSelectedText:function(){

		var text = "";
	    if(window.getSelection) {
	        text = window.getSelection().toString();
	    }else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	},
	
	// saves a selection to add a link
	saveSelection:function(){
	    if (window.getSelection) {
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            var ranges = [];
	            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
	                ranges.push(sel.getRangeAt(i));
	            }
	            return ranges;
	        }
	    } else if (document.selection && document.selection.createRange) {
	        return document.selection.createRange();
	    }
	    return null;
	},
	
	// restores the selection
	restoreSelection:function(savedSel) {
	    if (savedSel) {
	        if (window.getSelection) {
	            sel = window.getSelection();
	            sel.removeAllRanges();
	            for (var i = 0, len = savedSel.length; i < len; ++i) {
	                sel.addRange(savedSel[i]);
	            }
	        } else if (document.selection && savedSel.select) {
	            savedSel.select();
	        }
	    }
	},
	
	// converts an rgb color to a hex color value
	rgbToHex:function(rgb){
		
		if(jQuery.browser.msie)return rgb.replace('#', '');
		
		 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		 function hex(x) {
		  hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
		  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
		 }
		 return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	},
	
	// replaces all occurances for a string
	replaceAll:function(src, stringToFind, stringToReplace){
	  	var temp = src;
	
		var index = temp.indexOf(stringToFind);
		
		while(index != -1){
			temp = temp.replace(stringToFind,stringToReplace);
			index = temp.indexOf(stringToFind);
		}
		
		return temp;
	},
	
	// converts to local date
	convertToLocalDate:function(date, offset){
		if(date != null && date != ''){
			var m = moment.utc(date, 'YYYY-MM-DD HH:mm:ss');
			m.add('hours',offset);
			
			return m.format('YYYY-MM-DD');
		}
		else{
			return '';
		}
	},
	
	// converts to local date
	convertToLocalTime:function(date, offset){
		if(date != null && date != ''){
			var m = moment.utc(date, 'YYYY-MM-DD HH:mm:ss');
			m.add('hours',offset);
			
			return m.format('HH:mm:ss');
		}
		else{
			return '';
		}
	},
	
	// parses latitude from LatLong
	parseLatitude:function(latLong){
		if(latLong != null && latLong != ''){
		
			var point = latLong.replace('POINT(', '').replace(')', '');
			var arr = point.split(' ');
		
			return arr[0];
		}
		else{
			return '';
		}	
	},
	
	// parses longitude from LatLong
	parseLongitude:function(latLong){
		if(latLong != null && latLong != ''){
		
			var point = latLong.replace('POINT(', '').replace(')', '');
			var arr = point.split(' ');
		
			return arr[1];
		}
		else{
			return '';
		}
	},
	
	// executes a funtion by its name
	executeFunctionByName:function(functionName, context /*, args */) {
		var args = [].slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		
		var func = namespaces.pop();
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		return context[func].apply(this, args);
	},
	
	// gets index of array by attribute
	getIndexByAttribute:function(arr, attr, value){
		
		for(z=0; z<arr.length; z++){
			if(arr[z][attr] == value){
				return z;
			}
		}
		
		return -1;
		
	},
	
	// gets alignment for a given element
	getAlignClass:function(cssClass){
	
		// error checking
		if(cssClass == null || cssClass == undefined){
			return '';
		}
		
		var alignClass = '';
		
		// check for alignemnt
		if(cssClass.indexOf('text-left')!=-1){
			alignClass = ' text-left';
		}
		else if(cssClass.indexOf('text-center')!=-1){
			alignClass = ' text-center';
		}
		else if(cssClass.indexOf('text-right')!=-1){
			alignClass = ' text-right';
		}
	
		return alignClass;
	},
	
	// gets display for a given element
	getDisplay:function(cssClass){
	
		// error checking
		if(cssClass == null || cssClass == undefined){
			return '';
		}
		
		var display = 'standalone';
		
		// check for alignemnt
		if(cssClass.indexOf('display-left')!=-1){
			display = 'left';
		}
		else if(cssClass.indexOf('display-right')!=-1){
			display = 'right';
		}
	
		return display;
	},
	
	// generates an element 
	element:function(tag, attrs, html){
		
		// start tag
		var el = '<' + tag;
		
		// add attrs to tag
		for(var key in attrs){
		
			var value = attrs[key];
			
			if(value != '' && value != null && value != undefined){
				el += ' ' + key + '="' + value + '"';
			}
		}
		
		// end tag, add html
		el += '>';
		el += html;
		el += '</' + tag + '>';
		
		return el;

	},
	
	// sets up flipsnap
	setupFs:function(){
	
		// calculate distance
		var d = $('.fs-container').width() - 100;
		
		// setup flipsnap
	    var fs = Flipsnap('.main nav .fs', {distance: d, maxPoint:3});
	    
	    // create next and previous buttons
	    $('.fs-container').append(
	    		'<a class="fs-next"><i class="fa fa-chevron-right"></i></a>' +
	    		'<a class="fs-prev"><i class="fa fa-chevron-left"></i></a>');
        
        $('.fs-next').on('click', function(){
            fs.toNext(); 
            
            if(fs.hasPrev()){
                $('.fs-prev').show();
            }
            else{
                $('.fs-prev').hide();
            }
            
            if(fs.hasNext()){
                $('.fs-next').show();
            }
            else{
                $('.fs-next').hide();
            }
        });
        
        $('.fs-prev').on('click', function(){
            fs.toPrev(); 
            
            if(fs.hasPrev()){
                $('.fs-prev').show();
            }
            else{
                $('.fs-prev').hide();
            }
            
            if(fs.hasNext()){
                $('.fs-next').show();
            }
            else{
                $('.fs-next').hide();
            }
        });

		
	}
}

$(document).ready(function(){
    utilities.init();
});
