// create namespace
var triangulate = triangulate || {};
triangulate.component = triangulate.component || {};

// slideshow component
triangulate.component.slideshow = {

	// init slideshow
	init:function(){
		
		$(document).on('click', '.add-slideshow-image', function(){
			$('#imagesDialog').attr('data-plugin', 'triangulate.component.slideshow');
			$('#imagesDialog').modal('show');
		});
		
		// caption focus (for images)
		$(document).on('focus', '.caption input', function(){
			$(this.parentNode.parentNode).addClass('edit');
		});
	
		// caption blur (for images)
		$(document).on('blur', '.caption input', function(){
			var caption = $(this).val();
			$(this.parentNode.parentNode).find('img').attr('title', caption);
			$(this.parentNode.parentNode).removeClass('edit');
		});
		
		// remove-image click
		$(document).on('click', '.remove-image', function(){
			$(this.parentNode).remove();
			context.find('a.'+this.parentNode.className).show();
			return false;
		}); 
	
		// make parsed elements sortable
		$(document).on('triangulate.editor.contentLoaded', function(){	
			// make the elements sortable
			$('.triangulate-slideshow div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
			
		});
		
	},
	
	// adds an image to the slideshow
	addImage:function(image){
	
		// get current node
		var node = $(triangulate.editor.currNode);
		
		// build html
		var html = '<span class="image"><img src="' + image.fullUrl + '" title="">' +
				   '<span class="caption"><input type="text" value="" placeholder="Enter Caption" maxwidth="140"></span>' +
				   '<a class="remove-image fa fa-minus-circle"></a></span>';
				   
		$(node).find('.images').append(html);
		
		$('#imagesDialog').modal('hide');
		
		return true;
	
	},

	// creates slideshow
	create:function(){
	
		// generate uniqId
		var id = triangulate.editor.generateUniqId('slideshow', 'slideshow');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="images">' +
					'<button type="button" class="add-slideshow-image"><i class="fa fa-picture-o"></i></button>' +
					'</div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-slideshow';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		triangulate.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// make the elements sortable
		$('.triangulate-slideshow div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
		
		return true;
		
	},
	
	// parse slideshow
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="images">' +
					'<button type="button" class="add-slideshow-image"><i class="fa fa-picture-o"></i></button>';
		
		// get images			
		var imgs = $(node).find('img');			
					
		for(var y=0; y<imgs.length; y++){
		
			// get caption
			var caption = $(imgs[y]).attr('title');
			
			// get image html
			var imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
			
			// build html
			html +=	'<span class="image">' + imghtml + 
					'<span class="caption">' +
					'<input type="text" value="' + caption + '" placeholder="Enter caption" maxwidth="140">' +
					'</span>' +
					'<a class="remove-image fa fa-minus-circle"></a>' +
					'</span>';
		
		}			

		// add button				  	
		html += '</div>';				
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-slideshow';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate slideshow
	generate:function(node){

  		// html for tag
  		var html = '';
  		
  		// get images
  		var imgs = $(node).find('img');
  		
  		for(var y=0; y<imgs.length; y++){
			var imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
			html += '<div>'+imghtml+'</div>';
		}
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('triangulate-slideshow', attrs, html);
		
	},
	
	// config slideshow
	config:function(node, form){}
	
};

triangulate.component.slideshow.init();

// map component
triangulate.component.map = {

	// creates map
	create:function(){
	
		// generate uniqId
		var id = triangulate.editor.generateUniqId('map', 'map');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<i class="in-textbox fa fa-map-marker"></i>' +
					'<input type="text" value="" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210">';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-map';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		triangulate.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse map
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var address = $(node).attr('address');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<i class="in-textbox fa fa-map-marker"></i>' +
					'<input type="text" value="' + address + '" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210">';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-map';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate map
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['address'] = $(node).find('input').val();
		
		// return element
		return utilities.element('triangulate-map', attrs, '');
		
	},
	
	// config map
	config:function(node, form){}
	
};

// form component
triangulate.component.form = {

	// inits the form
	init:function(){
	
		// adds a field
		$(document).on('click', '.add-field', function(){
			
			var node = $(triangulate.editor.currNode);
			
			// add temp field
			node.find('.field-list').append(
				triangulate.component.form.buildMock('text', 'Field', 'field-1', 'false', '', '', '', '')
			);
			
		});
		
		// make parsed elements sortable
		$(document).on('triangulate.editor.contentLoaded', function(){	
			// make the elements sortable
			$('.triangulate-form div').sortable({handle: '.mock-field', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
			
		});
		
	},
	
	// builds a mock
	buildMock:function(type, label, id, required, helper, placeholder, cssClass, options){
	
		// create field
  		var field = '<label for="field" element-text="label">' + label + '</label>' +
				'<div class="mock-field">' +
				'<span class="placeholder" element-text="placeholder">' + placeholder + '</span>' +
				'<span class="field-type" element-text="type">' + type + '</span></div>' +
				'<span class="helper-text" element-text="helper">' + helper + '</label>';
		
		// tag attributes
		var attrs = [];
		attrs['class'] = 'triangulate-field triangulate-element';
		attrs['data-type'] = type;
		attrs['data-label'] = label;
		attrs['data-required'] = required;
		attrs['data-helper'] = helper;
		attrs['data-placeholder'] = placeholder;
		attrs['data-id'] = id;
		attrs['data-cssclass'] = cssClass;
		attrs['data-options'] = options;
		
		// return element
		return utilities.element('div', attrs, field);
		
	},
	

	// builds a field
	buildField:function(type, label, id, required, helper, placeholder, cssClass, options){

		// set label
		var html = '<label for="' + id + '">' + label + '</label>';

		// create textbox
		if(type=='text'){
			html += '<input id="' + id + '" name="' + id + 
					'" type="text" class="form-control" placeholder="'+placeholder+'">';
		}

		// create textarea
		if(type=='textarea'){
			html += '<textarea id="' + id + '" name="' + id + '" class="form-control"></textarea>';
		}

		// create select
		if(type=='select'){
			html += '<select id="' + id + '" name="' + id + '" class="form-control">';

			var arr = options.split(',');

			for(x=0; x<arr.length; x++){
	  			html += '<option>' + $.trim(arr[x]) + '</option>';
			}

			html += '</select>'
		}

		// create checkboxlist
		if(type=='checkboxlist'){
			html += '<span class="list">';

			var arr = options.split(',');

			for(x=0; x<arr.length; x++){
	  			html += '<label class="checkbox"><input name="' + id + '" type="checkbox" value="' + $.trim(arr[x]) + '">' + $.trim(arr[x]) + '</label>';
			}

			html += '</span>';
		}

		// create radio list
		if(type=='radiolist'){
			html += '<span class="list">';

			var arr = options.split(',');

			for(x=0; x<arr.length; x++){
	  			html += '<label class="radio"><input name="' + id + '" type="radio" value="' + $.trim(arr[x]) + '" name="' + id + '">' + $.trim(arr[x]) + '</label>';
			}

			html += '</span>';
		}

		// create helper
		if(helper != '') {
			html += '<span class="help-block">' + helper + '</span>';
		}

		// create recaptcha
		if (type=='recaptcha') {
			var html = '{{reCaptcha}}';
		}

		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'form-group';
		attrs['data-type'] = type;
		attrs['data-label'] = label;
		attrs['data-required'] = required;
		attrs['data-helper'] = helper;
		attrs['data-placeholder'] = placeholder;
		attrs['data-id'] = id;
		attrs['data-cssclass'] = cssClass;
		attrs['data-options'] = options;
		
		// return element
		return utilities.element('div', attrs, html);
		
	},

	// creates form
	create:function(){
	
		// generate uniqId
		var id = triangulate.editor.generateUniqId('form', 'form');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="field-list">' +
					triangulate.component.form.buildMock('text', 'Field', 'field-1', 'false', '', '', 'form-control', '') +
					'</div>';
					
		html += '<button type="button" class="add-field"><i class="fa fa-plus-circle"></i></button>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-form';
		attrs['data-cssclass'] = '';
		attrs['data-type'] = 'default';
		attrs['data-action'] = '';
		attrs['data-success'] = 'Form submitted successfully.';
		attrs['data-error'] = 'There was an error submitting your form.';
		attrs['data-submit'] = 'Submit';
		attrs['data-field-count'] = '1';
		
		// append element to the editor
		triangulate.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		$('.triangulate-form div').sortable({handle: '.mock-field', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
	
		return true;
		
	},
	
	// parse form
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu + '<div class="field-list">';
		
		var fields = $(node).find('div');
		
		for(y=0; y<fields.length; y++){
		
			// tag attributes
			var type = $(fields[y]).attr('data-type') || '';
			var label = $(fields[y]).attr('data-label') || '';
			var required = $(fields[y]).attr('data-required') || '';
			var helper = $(fields[y]).attr('data-helper') || '';
			var placeholder = $(fields[y]).attr('data-placeholder') || '';
			var id = $(fields[y]).attr('data-id') || '';
			var cssClass = $(fields[y]).attr('data-cssclass') || '';
			var options = $(fields[y]).attr('data-options') || '';
			
			// build mock element
			html += triangulate.component.form.buildMock(type, label, id, required, helper, placeholder, cssClass, options)
		  	
		}
		
		html += '</div>';
		
		html += '<button type="button" class="add-field"><i class="fa fa-plus-circle"></i></button>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-form';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-type'] = $(node).attr('type');
		attrs['data-action'] = $(node).attr('action');
		attrs['data-success'] = $(node).attr('success');
		attrs['data-error'] = $(node).attr('error');
		attrs['data-submit'] = $(node).attr('submit');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate form
	generate:function(node){
	
		var fields = $(node).find('.field-list>div');
		var html = '';
		    
		  
  		for(var y=0; y<fields.length; y++){
  			field = $(fields[y]);
  			
  			// build field
  			html += triangulate.component.form.buildField(
  				field.attr('data-type') || '', 
  				field.attr('data-label') || '', 
  				field.attr('data-id') || '', 
  				field.attr('data-required') || '', 
  				field.attr('data-helper') || '', 
  				field.attr('data-placeholder') || '', 
  				field.attr('data-cssclass') || '', 
  				field.attr('data-options') || '');  				
  		}
	
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['type'] = $(node).attr('data-type');
		attrs['action'] = $(node).attr('data-action');
		attrs['success'] = $(node).attr('data-success');
		attrs['error'] = $(node).attr('data-error');
		attrs['submit'] = $(node).attr('data-submit');
		
		
		// return element
		return utilities.element('triangulate-form', attrs, html);
		
	},
	
	// config form
	config:function(node, form){}
	
};

triangulate.component.form.init();

// content component
triangulate.component.content = {

	// creates content
	create:function(){
	
		// generate uniqId
		var id = triangulate.editor.generateUniqId('content', 'content');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-cube"></i> <span node-text="url">Not Selected</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-content';
		attrs['data-cssclass'] = '';
		attrs['data-url'] = '';
		
		// append element to the editor
		triangulate.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse content
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var url = $(node).attr('url');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-cube"></i> <span node-text="url">' + url + '</span></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-content';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-url'] = $(node).attr('url');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate content
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['url'] = $(node).attr('data-url');
		
		// return element
		return utilities.element('triangulate-content', attrs, '');
		
	},
	
	// config map
	config:function(node, form){}
	
};

// list component
triangulate.component.list = {

	// creates list
	create:function(){
	
		// generate uniqId
		var id = triangulate.editor.generateUniqId('list', 'list');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-cubes"></i> <span node-text="type">Not Selected</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-list';
		attrs['data-cssclass'] = '';
		attrs['data-type'] = '';
		attrs['data-display'] = '';
		attrs['data-pagesize'] = '';
		attrs['data-orderby'] = '';
		attrs['data-pageresults'] = '';
		attrs['data-tag'] = '';
		attrs['data-desclength'] = '';
		
		// append element to the editor
		triangulate.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse list
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var type = $(node).attr('type');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-cubes"></i> <span node-text="type">' + type + '</span></div>';
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-list';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-type'] = $(node).attr('type');
		attrs['data-display'] = $(node).attr('display');
		attrs['data-pagesize'] = $(node).attr('pagesize');
		attrs['data-orderby'] =  $(node).attr('orderby');
		attrs['data-pageresults'] =  $(node).attr('pageresults');
		attrs['data-tag'] =  $(node).attr('tag');
		attrs['data-desclength'] = $(node).attr('desclength');
		
		utilities.element('div', attrs, html)
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate list
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['type'] = $(node).attr('data-type');
		attrs['display'] = $(node).attr('data-display');
		attrs['pagesize'] = $(node).attr('data-pagesize');
		attrs['orderby'] = $(node).attr('data-orderby');
		attrs['pageresults'] = $(node).attr('data-pageresults');
		attrs['tag'] = $(node).attr('data-tag');
		attrs['desclength'] = $(node).attr('data-desclength');
		
		// return element
		return utilities.element('triangulate-list', attrs, '');
		
	},
	
	// config list
	config:function(node, form){}
	
};

// html component
triangulate.component.html = {

	init:function(){
		
		// handle html div click
		$(document).on('click', '.triangulate-html div', function(){
			$(this).parent().toggleClass('active');	
		});
		
	},

	// creates html
	create:function(){
	
		// generate uniqId
		var id = triangulate.editor.generateUniqId('html', 'html');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-html5"></i> '+
					'<span node-text="description">HTML</span>' +
					'<i class="fa fa-angle-down"></i></div>' +
					'<textarea></textarea>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-html';
		attrs['data-cssclass'] = '';
		attrs['data-description'] = 'HTML';
		
		// append element to the editor
		triangulate.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse html
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var description = $(node).attr('description');
		var code = $(node).html();
		
		// create pretty code for display
		var pretty = utilities.replaceAll(code, '<', '&lt;');
		pretty = utilities.replaceAll(pretty, '>', '&gt;');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-html5"></i> '+
					'<span node-text="description">' + description + '</span>' +
					'<i class="fa fa-angle-down"></i></div>' +
					'<textarea>' + code + '</textarea>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-html';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-description'] = description;
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate html
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['description'] = $(node).attr('data-description');
		
		var html = $(node).find('textarea').val();
		
		// return element
		return utilities.element('triangulate-html', attrs, html);
		
	},
	
	// config html
	config:function(node, form){}
	
};

triangulate.component.html.init();

// login
triangulate.component.login = {

	// creates login
	create:function(){
	
		// generate uniqId
		var id = triangulate.editor.generateUniqId('login', 'login');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-key"></i> <span>Login</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-login';
		attrs['data-cssclass'] = '';
		attrs['data-success'] = 'Login successful.';
		attrs['data-error'] = 'Your username or password is invalid. Please try again.';
		attrs['data-button'] = 'Login';
		
		// append element to the editor
		triangulate.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse login
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-key"></i> <span>Login</span></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-login';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-success'] = $(node).attr('success');
		attrs['data-error'] = $(node).attr('error');
		attrs['data-button'] = $(node).attr('button');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate login
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['success'] = $(node).attr('data-success');
		attrs['error'] = $(node).attr('data-error');
		attrs['button'] = $(node).attr('data-button');
		
		// return element
		return utilities.element('triangulate-login', attrs, '');
		
	},
	
	// config login
	config:function(node, form){}
	
};

// registration
triangulate.component.registration = {

	// creates registration
	create:function(){
	
		// generate uniqId
		var id = triangulate.editor.generateUniqId('registration', 'registration');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-key"></i> <span>Registration</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-registration';
		attrs['data-cssclass'] = '';
		attrs['data-success'] = 'Registration successful.';
		attrs['data-error'] = 'There was a problem registering. Please try again.';
		attrs['data-required'] = 'All fields are required.';
		attrs['data-button'] = 'Register';
		
		// append element to the editor
		triangulate.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse registration
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var type = $(node).attr('type');
		
		// build html
		var html = triangulate.editor.defaults.elementMenu +
					'<div class="title triangulate-element"><i class="fa fa-key"></i> <span>Registration</span></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'triangulate-registration';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-success'] = $(node).attr('success');
		attrs['data-error'] = $(node).attr('error');
		attrs['data-required'] = $(node).attr('required');
		attrs['data-button'] = $(node).attr('button');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate registration
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['success'] = $(node).attr('data-success');
		attrs['error'] = $(node).attr('data-error');
		attrs['required'] = $(node).attr('data-required');
		attrs['button'] = $(node).attr('data-button');
		
		// return element
		return utilities.element('triangulate-registration', attrs, '');
		
	},
	
	// config list
	config:function(node, form){}
	
};


