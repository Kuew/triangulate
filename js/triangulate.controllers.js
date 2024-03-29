angular.module('triangulate.controllers', [])


// login controller
.controller('LoginCtrl', function($scope, $window, $rootScope, $i18next, Setup, User) {
	
	$rootScope.template = 'login';
	
	// setup
	$scope.setup = Setup;
	
	// login
	$scope.login = function(user){
	
		message.showMessage('progress');
	
		// login user
		User.login(user.email, user.password, 
			function(data){		// success
			
				message.showMessage('success');
				
				// retrieve the current user
				$rootScope.user = data.user;
				
				// set user in session
				$window.sessionStorage.user = data.user;
				
				// make sure the user has admin permissions
				if(data.user.CanEdit != '' && data.user.CanPublish != ''  && data.user.CanRemove != ''  && data.user.CanCreate != ''){
				
					// save token
					$window.sessionStorage.token = data.token;
					
					if(Setup.debug)console.log('[triangulate.debug] $rootScope.user');
					console.log($rootScope.user);
					
					// set language to the users language
					$i18next.options.lng = $rootScope.user.Language;
					
					// go to start URL
					location.href = data.start;
					
				}
				else{
					console.log('[triangulate.error] user does not have admin privileges');
					message.showMessage('error');
				}
				
			},
			function(){		// failure
				message.showMessage('error');
			});
		
	};
	
})

// create controller
.controller('CreateCtrl', function($scope, $rootScope, Setup, Theme, Language, Site) {
	
	$rootScope.template = 'login';
	
	// setup
	$scope.setup = Setup;
	
	// determine timezone
	var tz = jstz.determine();
    $scope.name = '';
    $scope.friendlyId = '';
    $scope.email = '';
    $scope.password = '';
    $scope.timeZone = tz.name();
    $scope.siteLanguage = Setup.language;
    $scope.userLanguage = Setup.language;
    $scope.themeId = Setup.themeId;
    $scope.passcode = '';
    
    $(document).on('click', '#toggle-advanced', function(){
		$('.advanced').show();
	});
    
    // sets a theme
    $scope.setThemeId = function(id){
    	$scope.themeId = id;
    }
    
    // get themes
	Theme.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Theme.list');
		console.log(data);
		
		$scope.themes = data;
	});
    
    // get languages
	Language.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Language.list');
		console.log(data);
		
		$scope.languages = data;
	});
	
	// create a site
	$scope.create = function(){
		
		message.showMessage('progress');
		
		Site.create($scope.friendlyId, $scope.name, $scope.email, $scope.password, $scope.passcode, $scope.timeZone, 
			$scope.siteLanguage, $scope.userLanguage, $scope.themeId, 
			function(){  // success
				message.showMessage('success');
			},
			function(){  // failure
				message.showMessage('error');
			});
	}
	
})

// menu controller
.controller('MenuCtrl', function($scope, $rootScope, $state, Setup, Site) {

	$scope.user = $rootScope.user;
	
	// get menu json
	$scope.republish = function(){
		
		message.showMessage('progress');
		
		Site.publish(
			function(){  // success
				message.showMessage('success');
			},
			function(){  // failure
				message.showMessage('error');
			});
		
	}
	
})

// pages controller
.controller('PagesCtrl', function($scope, $rootScope, $i18next, Setup, PageType, Page, Stylesheet, Layout) {

	$rootScope.template = 'pages';
	
	// setup
	$scope.predicate = 'LastModifiedDate';
	$scope.setup = Setup;
	$scope.loading = true;
	$scope.pageTypeId = -1;
	
	$scope.current = null;
	$scope.temp = null;
	
	// sets the predicate
	$scope.setPredicate = function(predicate){
		$scope.predicate = predicate;
	}
	
	// sets the pageTypeId
	$scope.setPageType = function(pageType){
		$scope.current = pageType;
		$scope.pageTypeId = pageType.PageTypeId;
	}
	
	// shows the page type dialog for editing
	$scope.showEditPageType = function(){
	
		// set temporary model
		$scope.temp = $scope.current;
	
		$('#pageTypeDialog').modal('show');
    	
    	$('#pageTypeDialog').find('.edit').show();
		$('#pageTypeDialog').find('.add').hide();
	}
	
	// edits the page type
	$scope.editPageType = function(pageType){
	
		PageType.edit(pageType);
	
		$('#pageTypeDialog').modal('hide');
	}
	
	// shows the page type dialog for adding
	$scope.showAddPageType = function(){
	
		// set temporary model
		$scope.temp = null;
	
		$('#pageTypeDialog').modal('show');
    	
    	$('#pageTypeDialog').find('.add').show();
		$('#pageTypeDialog').find('.edit').hide();
	}
	
	// adds the page type
	$scope.addPageType = function(pageType){
	
		PageType.add(pageType);
	
		$('#pageTypeDialog').modal('hide');
	}
	
	// shows the remove page type dialog
	$scope.showRemovePageType = function(pageType){
	
		// set temporary model
		$scope.temp = pageType;
	
		$('#removePageTypeDialog').modal('show');
	}
	
	// removes the page type
	$scope.removePageType = function(pageType){
	
		PageType.remove(pageType);
	
		$('#removePageTypeDialog').modal('hide');
	}
	
	// shows the edit tags dialog
	$scope.showEditTags = function(page){
	
		// set temporary model
		$scope.temp = page;
	
		$('#editTagsDialog').modal('show');
	}
	
	// edit tags
	$scope.editTags = function(page){
	
		message.showMessage('progress');
	
		Page.editTags(page,
			function(){  // success
				message.showMessage('success');
			},
			function(){  // failure
				message.showMessage('error');
			});
	
		$('#editTagsDialog').modal('hide');
	}

	// shows the add page dialog
	$scope.showAddPage = function(){
	
		// set temporary model
		$scope.temp = null;
	
		$('#pageDialog').modal('show');
	}
	
	// adds a page
	$scope.addPage = function(page){
	
		message.showMessage('progress');
	
		Page.add($scope.pageTypeId, page,
			function(data){  // success
				message.showMessage('success');
			},
			function(){  // failure
				message.showMessage('error');
			});
	
		$('#pageDialog').modal('hide');
	}
	
	// shows the remove page dialog
	$scope.showRemovePage = function(page){
	
		// set temporary model
		$scope.temp = page;
	
		$('#removePageDialog').modal('show');
	}

	// removes a page
	$scope.removePage = function(page){
	
		message.showMessage('progress');
	
		Page.remove(page,
			function(data){  // success
				message.showMessage('success');
			},
			function(){  // failure
				message.showMessage('error');
			});
	
		$('#removePageDialog').modal('hide');
	}
	
	// toggles the state of a page
	$scope.togglePublished = function(page){
	
		message.showMessage('progress');
	
		Page.togglePublished(page,
			function(data){  // success
				message.showMessage('success');
			},
			function(){  // failure
				message.showMessage('error');
			});
	
		$('#removePageDialog').modal('hide');
	}
	
	// publishes a page
	$scope.togglePublished = function(page){
	
		message.showMessage('progress');
	
		Page.togglePublished(page,
			function(data){  // success
				message.showMessage('success');
			},
			function(){  // failure
				message.showMessage('error');
			});
	
		$('#pageDialog').modal('hide');
	}
	
	// list allowed page types
	PageType.listAllowed(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] PageType.listAllowed');
		console.log(data);
		
		$scope.pageTypes = data;
	});
	
	// list pages
	Page.listAllowed(function(data){
		
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Page.listAllowed');
		if(Setup.debug)console.log(data);
		
		$scope.pages = data;
		$scope.loading = false;
	});
	
	// list stylesheets
	Stylesheet.list(function(data){
		
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Stylesheet.list');
		if(Setup.debug)console.log(data);
		
		$scope.stylesheets = data;
	});
	
	// list layouts
	Layout.list(function(data){
		
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Layout.list');
		if(Setup.debug)console.log(data);
		
		$scope.layouts = data;
	});
	
})

// content controller
.controller('ContentCtrl', function($scope, $rootScope, $stateParams, $sce, Setup, Site, Page, PageType, Image, Icon, Theme, Layout, Stylesheet, Editor, Translation) {
	
	$rootScope.template = 'content';
	
	// setup
	$scope.setup = Setup;
	$scope.loading = true;
	$scope.content = '';
	$scope.sites = Setup.sites;
	$scope.node = {};
	$scope.element = {};
	
	// watch for changes in the node collection
    $scope.$watchCollection('node', function(newValues, oldValues){
    	
    	$.each(newValues, function(index, attr){	
	  		
	  		// check for changes
	  		if(newValues[index] != oldValues[index]){
	  		
		  		// set new values
		  		if(index != 'sortableItem'){
		  		
		  			console.log('$watch, set index=' + index +' to attr=' + attr);
		  		
		  			// set cortriangulateing data attribute
		  			$(triangulate.editor.currNode).attr('data-' + index, attr);
		  			
		  			// set config-text convenience method
		  			$(triangulate.editor.currNode).find('[node-text="' + index + '"]').text(attr);
		  			
		  			// create eventName
		  			var eventName = triangulate.editor.currConfig.attr('data-action') + '.node.' + index + '.change';
		  			
		  			// trigger change
		  			$(triangulate.editor.el).trigger(eventName, {index: index, attr: attr});
		  		}
	  		}
	  		
  		});
    	
    });
    
    // watch for changes in the node collection
    $scope.$watchCollection('element', function(newValues, oldValues){
    	
    	$.each(newValues, function(index, attr){	
	  		
	  		// check for changes
	  		if(newValues[index] != oldValues[index]){
	  		
		  		// set new values
		  		if(index != 'sortableItem'){
		  		
		  			console.log('$watch, set index=' + index +' to attr=' + attr);
		  		
		  			// set cortriangulateing data attribute
		  			$(triangulate.editor.currElement).attr('data-' + index, attr);
		  			
		  			// set config-text convenience method
		  			$(triangulate.editor.currElement).find('[element-text="' + index + '"]').text(attr);
		  			
		  			// create eventName
		  			var eventName = triangulate.editor.currConfig.attr('data-action') + '.element.' + index + '.change';
		  			
		  			// trigger change
		  			$(triangulate.editor.el).trigger(eventName, {index: index, attr: attr});
		  		}
	  		}
	  		
  		});
    	
    });
    

	// get pageId
	$scope.pageId = $stateParams.id;
	
	// save & publish
	$scope.saveAndPublish = function(){
		
		var editor = $('#triangulate-editor');
		
		// get the content and image from the editor
		var content = triangulate.editor.getContent(editor, Setup.api);
		var image = triangulate.editor.getPrimaryImage(editor);
		
		message.showMessage('progress');
		
		// save content for the page
		Page.saveContent($scope.pageId, content, image, 'publish', function(){
			message.showMessage('success');
		});
		
		// save settings for the page
		$scope.saveSettings();
		
		// set prefix
		var prefix = '[' + $scope.page.Url + ']';
		
		// save search index (todo)
		var translations = triangulate.editor.getTranslations(prefix);
		
		// get translations for the site
		Translation.retrieve(function(){
			
			// walkthrough translations
			for(var key in translations){
			
				// add translation to data
				Translation.add(key, translations[key]);
				
			}
			
			// save translation
			Translation.save(function(){
				
			})
			
		});
	}
	
	// save
	$scope.save = function(){
	
		var editor = $('#triangulate-editor');
		
		// get the content and image from the editor
		var content = triangulate.editor.GetContent(editor);
		var image = triangulate.editor.GetPrimaryImage(editor);
		
		Page.saveContent($scope.pageId, content, image, 'draft', function(data){});
		
	}
	
	// set location
	$scope.setLocation = function(){
		
		var callback = function(latitude, longitude, fmtAddress){
			$scope.page.Latitude = latitude;
			$scope.page.Longitude = longitude;
		}
		
		var address = $scope.page.Location;
		
		utilities.geocode(address, callback);
		
	}
	
	// show settings
	$scope.showPageSettings = function(){
		// hide config
	  	$('.context-menu').find('.config').removeClass('active');
	  	$('.page-settings').addClass('active');
	  	triangulate.editor.currNode = null;
	  	triangulate.editor.currElement = null;
	  	$(triangulate.editor.el).find('.current-element').removeClass('current-element');
	  	$(triangulate.editor.el).find('.current-node').removeClass('current-node');
	}
	
	// save settings
	$scope.saveSettings = function(){
	
		var beginDate = $.trim($scope.page.LocalBeginDate + ' ' + $scope.page.LocalBeginTime);
		var endDate = $.trim($scope.page.LocalEndDate + ' ' + $scope.page.LocalEndTime);
		
		Page.saveSettings($scope.pageId, 
			$scope.page.Name, $scope.page.FriendlyId, $scope.page.Description, $scope.page.Keywords, $scope.page.Callout, 
			$scope.page.Layout, $scope.page.Stylesheet, 
			beginDate, endDate, $scope.page.Location, $scope.page.Latitude, $scope.page.Longitude,
			function(data){});
		
	}
	
	// back
	$scope.back = function(){
		window.history.back();
	}
	
	// retrieve site
	Site.retrieve(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Site.retrieve');
		if(Setup.debug)console.log(data);
		
		$scope.site = data;
		
		// retrieve page
		Page.retrieveExtended($scope.pageId, $scope.site.Offset, function(data){
		
			// debugging
			if(Setup.debug)console.log('[triangulate.debug] Page.retrieveExtended');
			if(Setup.debug)console.log(data);
			
			$scope.page = data;
		});
		
	});

	// list pages
	Page.list(function(data){
		
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Page.list');
		if(Setup.debug)console.log(data);
		
		$scope.pages = data;
	});
	
	// list pages for theme
	Theme.listPages(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Theme.listPages');
		if(Setup.debug)console.log(data);
		
		$scope.themePages = data;
	});
	
	// list allowed page types
	PageType.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] PageType.listAll');
		console.log(data);
		
		$scope.pageTypes = data;
	});
	
	// list images
	Image.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Image.list');
		console.log(data);
		
		$scope.images = data;
	});
	
	// list items for editor
	Editor.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Editor.list');
		if(Setup.debug)console.log(data);
		
		$scope.editorItems = data;
		
		// setup flipsnap
		var fs = Flipsnap('.editor-actions div', {distance: 400, maxPoint:3});
        
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
        
        // setup editor
		var editor = triangulate.editor.setup({
		    			el: $('#triangulate-editor'),
		    			pageId: $stateParams.id,
		    			api: Setup.api,
		    			menu: data
					});
	});
	
	// list new images
	$scope.updateImages = function(){
		Image.list(function(data){
			// debugging
			if(Setup.debug)console.log('[triangulate.debug] Image.list');
			console.log(data);
			
			$scope.images = data;
		});
	}
	
	// add image
	$scope.addImage = function(image){
	
		var plugin = $('#imagesDialog').attr('data-plugin');
		
		// build add
		var fn = plugin + '.addImage';
		
		// execute method
		utilities.executeFunctionByName(fn, window, image);
	}
	
	// list icon
	Icon.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Image.list');
		console.log(data);
		
		$scope.icons = data;
	});
	
	// list layouts
	Layout.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Layout.list');
		console.log(data);
		
		$scope.layouts = data;
	});
	
	// list stylesheets
	Stylesheet.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Stylesheet.list');
		console.log(data);
		
		$scope.stylesheets = data;
	});
	
	// generate preview
	$scope.generatePreview = function(){
	
		var editor = $('#triangulate-editor');
	
		// get the content and image from the editor
		var content = triangulate.editor.getContent(editor);
		
		var image = triangulate.editor.getPrimaryImage(editor);
		var previewUrl = 'sites/' + $scope.site.FriendlyId + '/#/' + $scope.page.Url + '?preview=true';
		
		Page.preview($scope.pageId, content, function(data){});
	}				

})

// menus controller
.controller('MenusCtrl', function($scope, $rootScope, Setup, MenuType, MenuItem, Page) {

	$rootScope.template = 'menus';
	
	// setup
	$scope.setup = Setup;
	$scope.loading = true;
	$scope.friendlyId = 'primary';
	
	// set friendlyId
	$scope.setFriendlyId = function(friendlyId){
		$scope.friendlyId = friendlyId;
	}
	
	// creates a friendlyId
	$scope.createFriendlyId = function(temp){
		var keyed = temp.Name.toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '-');
		temp.FriendlyId = keyed.substring(0,25);
	}
	
	// list menutypes
	MenuType.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] MenuType.list');
		console.log(data);
		
		$scope.menuTypes = data;
	});
	
	// list menuitems
	MenuItem.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] MenuItem.list');
		console.log(data);
		
		$scope.menuItems = data;
		$scope.loading = false;
		
		// setup reorder
		$('div.list').sortable({handle:'span.hook', placeholder: 'placeholder', opacity:'0.6', stop:function(){
            
            // get order
            var items = $('#menuItemsList .listItem');
        
	        var priorities = {};
	        
	        // set order in the model
	        for(var x=0; x<items.length; x++){
	            var id = $(items[x]).data('id');
				MenuItem.setPriority(id, x);
	            priorities[id] = x;
	        }
	        
	        // update order
	        message.showMessage('progress');
	        
	        MenuItem.savePriorities(priorities, function(){
		    	message.showMessage('success'); 	   
	        });
            
        }});
	});
	
	// list pages
	Page.list(function(data){
		
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Page.list');
		if(Setup.debug)console.log(data);
		
		$scope.pages = data;
	});
	
	// shows the menutype dialog for adding
	$scope.showAddMenuType = function(){
	
		// set temporary model
		$scope.temp = null;
	
		$('#menuTypeDialog').modal('show');
    	
    	$('#menuTypeDialog').find('.add').show();
		$('#menuTypeDialog').find('.edit').hide();
	}
	
	// adds the menu type
	$scope.addMenuType = function(menuType){
	
		MenuType.add(menuType);
	
		$('#menuTypeDialog').modal('hide');
	}
	
	// shows the remove menu type dialog
	$scope.showRemoveMenuType = function(menuType){
	
		// set temporary model
		$scope.temp = menuType;
	
		$('#removeMenuTypeDialog').modal('show');
	}
	
	// removes the menu type
	$scope.removeMenuType = function(menuType){
	
		message.showMessage('progress');
	
		MenuType.remove(menuType, function(){
			$scope.friendlyId = 'primary';
			message.showMessage('success');
		});
	
		$('#removeMenuTypeDialog').modal('hide');
	}
	
	// shows the menu item dialog
	$scope.showAddMenuItem = function(){
	
		// set temporary model
		$scope.temp = {
			Name: '',
			Url: '',
			CssClass: ''
		};
	
		$('#addEditDialog').modal('show');
    	
    	$('#addEditDialog').find('.add').show();
		$('#addEditDialog').find('.edit').hide();
	}
	
	// add the menu item
	$scope.addMenuItem = function(menuItem){
	
		menuItem.Priority = $('#menuItemsList').find('.listItem').length;
		menuItem.Type = $scope.friendlyId;
	
		MenuItem.add(menuItem);
	
		$('#addEditDialog').modal('hide');
	}
	
	// shows the menu item dialog
	$scope.showEditMenuItem = function(menuItem){
	
		// set temporary model
		$scope.temp = menuItem;
	
		$('#addEditDialog').modal('show');
    	
    	$('#addEditDialog').find('.add').hide();
		$('#addEditDialog').find('.edit').show();
	}
	
	// edits the menu item
	$scope.editMenuItem = function(menuItem){
	
		message.showMessage('progress');
	
		MenuItem.edit(menuItem, function(){
			message.showMessage('success');
		});
	
		$('#addEditDialog').modal('hide');
	}
	
	// shows the remove item dialog
	$scope.showRemoveMenuItem = function(menuItem){
	
		// set temporary model
		$scope.temp = menuItem;
	
		$('#removeMenuItemDialog').modal('show');
	}

	// removes a menuItem
	$scope.removeMenuItem = function(menuItem){
	
		message.showMessage('progress');
	
		MenuItem.remove(menuItem, function(){
			message.showMessage('success');
		});
	
		$('#removeMenuItemDialog').modal('hide');
	}
	
	// toggle isNested
	$scope.toggleNested = function(menuItem){
		
		message.showMessage('progress');
	
		MenuItem.toggleNested(menuItem, function(){
			message.showMessage('success');
		});
		
	}
	
	// set url from page URL dropdown
	$scope.setUrl = function(page){
		$scope.temp.Name = page.Name
		$scope.temp.Url = page.Url;
		$scope.temp.PageId = page.PageId;
	}
	
	// publishes the menus
	$scope.publish = function(){
	
		message.showMessage('progress');
	
		MenuItem.publish(function(){
			message.showMessage('success');
		});
	}
	
})

// layouts controller
.controller('LayoutsCtrl', function($scope, $rootScope, Setup, Layout) {

	$rootScope.template = 'layouts';
	
	// setup
	$scope.setup = Setup;
	$scope.loading = true;
	$scope.content = '';
	
	// set code mirror options
	$scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
		mode: 'text/html',
    };
	
	// set name
	$scope.setName = function(name){
		$scope.name = name;
		
		// retrieve content for layout
		Layout.retrieve(name, function(data){
			$scope.content = data;
		});
	}
	
	// list files
	Layout.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Layout.list');
		console.log(data);
		
		$scope.files = data;
		
		// retrieve content for first layout
		if(data.length > 0){
			
			$scope.setName(data[0]);
		}
	});
	
	// shows the add file dialog
	$scope.showAddFile = function(){
	
		// set temporary model
		$scope.temp = null;
	
		$('#addDialog').modal('show');
	}
	
	// adds a file
	$scope.addFile = function(file){
	
		message.showMessage('progress');
	
		Layout.add(file, function(){
			message.showMessage('success');
		});
	
		$('#addDialog').modal('hide');
	}
	
	// shows the remove file dialog
	$scope.showRemoveFile = function(file){
	
		// set temporary model
		$scope.temp = file;
	
		$('#removeDialog').modal('show');
	}
	
	// removes the file
	$scope.removeFile = function(file){
	
		message.showMessage('progress');
	
		Layout.remove(file, function(){
			$scope.file = '';  // #todo
			
			message.showMessage('success');
		});
	
		$('#removeDialog').modal('hide');
	}
	
	// publishes a layout
	$scope.publish = function(){
		
		message.showMessage('progress');
		
		Layout.publish($scope.name, $scope.content, function(){
			message.showMessage('success');
		});
		
	}
	
})

// styles controller
.controller('StylesCtrl', function($scope, $rootScope, Setup, Stylesheet) {

	$rootScope.template = 'styles';
	
	// setup
	$scope.setup = Setup;
	$scope.loading = true;
	$scope.content = '';
	
	// set code mirror options
	$scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
		mode: 'text/css',
    };
	
	// set name
	$scope.setName = function(name){
		$scope.name = name;
		
		// retrieve content for layout
		Stylesheet.retrieve(name, function(data){
			$scope.content = data;
		});
	}
	
	// list files
	Stylesheet.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Stylesheet.list');
		console.log(data);
		
		$scope.files = data;
		
		// retrieve content for first layout
		if(data.length > 0){
			$scope.setName(data[0]);
		}
	});
	
	// shows the add file dialog
	$scope.showAddFile = function(){
	
		// set temporary model
		$scope.temp = null;
	
		$('#addDialog').modal('show');
	}
	
	// adds a file
	$scope.addFile = function(file){
	
		message.showMessage('progress');
	
		Stylesheet.add(file, function(){
			message.showMessage('success');
		});
	
		$('#addDialog').modal('hide');
	}
	
	// shows the remove file dialog
	$scope.showRemoveFile = function(file){
	
		// set temporary model
		$scope.temp = file;
	
		$('#removeDialog').modal('show');
	}
	
	// removes the file
	$scope.removeFile = function(file){
	
		message.showMessage('progress');
	
		Stylesheet.remove(file, function(){
			$scope.file = '';  // #todo
			
			message.showMessage('success');
		});
	
		$('#removeDialog').modal('hide');
	}
	
	// publishes a layout
	$scope.publish = function(){
		
		message.showMessage('progress');
		
		Stylesheet.publish($scope.name, $scope.content, function(){
			message.showMessage('success');
		});
		
	}
	
})

// settings controller
.controller('SettingsCtrl', function($scope, $window, $rootScope, Setup, Site, Currency) {
	
	$rootScope.template = 'settings';
	
	// setup
	$scope.setup = Setup;
		
	// retrieve site
	Site.retrieve(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Site.retrieve');
		if(Setup.debug)console.log(data);
		
		$scope.site = data;
		
		var calc = $scope.site.ShippingCalculation;
		var tiers = $scope.site.ShippingTiers;
		
		// set calculation
		if(calc == 'amount' || calc == 'weight'){
	                
            var tiers = JSON.parse(tiers);
            var tos = $('.shipping-'+calc).find('.to');
	        var froms = $('.shipping-'+calc).find('.from');
	        var rates = $('.shipping-'+calc).find('.rate');
            
            // set tiers
            for(x=0; x<tiers.length; x++){
                var tier = tiers[x];
                $(froms[x]).text(tier.from); 
                $(tos[x]).val(tier.to);
                $(rates[x]).val(tier.rate); 
  
            }
            
        }
		
	});
	
	// save settings
	$scope.save = function(){
        
        message.showMessage('progress');
        
        Site.save($scope.site, function(){
	        message.showMessage('success');
        },
        function(){
	     	message.showMessage('error');   
        });
		
		
	};
	
	// retrieve currencies
	Currency.list(function(data){
		$scope.currencies = data;
	});
	
})

// theme controller
.controller('ThemeCtrl', function($scope, $rootScope, Setup, Theme, Site) {
	
	$rootScope.template = 'theme';
	
	// setup
	$scope.setup = Setup;
	
    $scope.themeId = Site.Theme;
   
    // sets a theme
    $scope.setThemeId = function(id){
    	$scope.themeId = id;
    }
    
    // get themes
	Theme.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Theme.list');
		console.log(data);
		
		$scope.themes = data;
	});
	
	// retrieve site
	Site.retrieve(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Site.retrieve');
		if(Setup.debug)console.log(data);
		
		$scope.site = data;
		
		$scope.themeId = data.Theme;
	});
	
	// shows the dialog to apply a new theme
	$scope.showApply = function(theme){
	
		// set temporary model
		$scope.temp = theme;
	
		$('#applyDialog').modal('show');
    	
	}
	
	// applies a new theme
	$scope.applyTheme = function(theme){
	
		 message.showMessage('progress');
	
		// apply the theme
		Theme.apply(theme.name, 
			function(){
				 message.showMessage('success');
			});
	
		// hide the modal
		$('#applyDialog').modal('hide');
	}
	
	// shows the dialog to reset the current theme
	$scope.showReset = function(theme){
	
		// set temporary model
		$scope.temp = theme;
	
		$('#resetDialog').modal('show');
    	
	}
	
	// resets current theme
	$scope.resetTheme = function(theme){
	
		message.showMessage('progress');
	
		// reset the theme
		Theme.reset(theme.name, 
			function(){
				 message.showMessage('success');
			});
	
		$('#resetDialog').modal('hide');
	}
	
})

// branding controller
.controller('BrandingCtrl', function($scope, $rootScope, Setup, Site, Image) {
	
	$rootScope.template = 'branding';
	
	// setup
	$scope.setup = Setup;
	$scope.type = null;
	$scope.site = null;
	$scope.logoUrl = null;
	$scope.payPalLogoUrl = null;
	$scope.iconUrl = null;
	
	// retrieve site
	Site.retrieve(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Site.retrieve');
		if(Setup.debug)console.log(data);
		
		$scope.site = data;
		
		// update image urls
		if($scope.site.LogoUrl != null){
	    	$scope.logoUrl = '//' + $scope.site.Domain + '/files/' + $scope.site.LogoUrl;
	    }
	    
	    if($scope.site.PayPalLogoUrl != null){
			$scope.payPalLogoUrl = '//' + $scope.site.Domain + '/files/' + $scope.site.PayPalLogoUrl;
		}
		
		if($scope.site.IconUrl != null){
			$scope.iconUrl = '//' + $scope.site.Domain + '/files/' + $scope.site.IconUrl;
		}
		
	});
	
	// shows the images dialog
	$scope.showAddImage = function(type){
		$scope.type = type;
	
		$('#imagesDialog').modal('show');
	}
	
	// list new images
	$scope.updateImages = function(){
		Image.list(function(data){
			// debugging
			if(Setup.debug)console.log('[triangulate.debug] Image.list');
			console.log(data);
			
			$scope.images = data;
		});
	}
	
	// update the images for the dialog
	$scope.updateImages();
	
	// updates the icon bg
	$scope.updateIconBg = function(){
		
		message.showMessage('progress');
	
		Site.updateIconBg($scope.site.IconBg, function(){
			message.showMessage('success');
		});
	}
	
	// add image
	$scope.addImage = function(image){
	
		message.showMessage('progress');
	
		Site.addImage($scope.type, image, function(){
			message.showMessage('success');
			
			// update image
			if($scope.type == 'logo'){
				$scope.logoUrl = '//' + $scope.site.Domain + '/files/' + image.filename;
			}
			else if($scope.type == 'paypal'){
				$scope.payPalLogoUrl = '//' + $scope.site.Domain + '/files/' + image.filename;
			}
			else if($scope.type == 'icon'){
				$scope.iconUrl = '//' + $scope.site.Domain + '/files/' + image.filename;
			}
			
		});
	
		$('#imagesDialog').modal('hide');
	}

})

// files controller
.controller('FilesCtrl', function($scope, $rootScope, Setup, File) {
	
	$rootScope.template = 'files';
	
	// setup
	$scope.setup = Setup;
	$scope.loading = true;
	$scope.temp = null;
	
	$scope.updateFiles = function(){
		// list files
		File.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[triangulate.debug] File.list');
			console.log(data);
			
			$scope.files = data;
			$scope.loading = false;
		});
	}
	
	$scope.updateFiles();
	
	// sets file to be edit
	$scope.edit = function(file, $event){
		$scope.temp = file;
		
		var el = $event.target;
		
		$('.listItem').removeClass('editing');
		$(el).parents('.listItem').addClass('editing');
		
	}
	
	// cancels editing an item
	$scope.cancelEdit = function(file){
		$scope.temp = null;
		$('.listItem').removeClass('editing');
	}

	// shows the remove dialog
	$scope.showRemove = function(file){
		$scope.temp = file;
		
		$('#removeDialog').modal('show');
	}
	
	// removes a file
	$scope.remove = function(){
		
		message.showMessage('progress');
		
		File.remove($scope.temp, function(){
			message.showMessage('success');
		});
		
		$('#removeDialog').modal('hide');
	}

})

// users controller
.controller('UsersCtrl', function($scope, $rootScope, Setup, User, Role, Language, Image) {
	
	$rootScope.template = 'users';
	
	// setup
	$scope.setup = Setup;
	$scope.loading = true;
	$scope.temp = null;
	
	// list users
	User.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] User.list');
		console.log(data);
		
		$scope.users = data;
		$scope.loading = false;
	});
	
	// get languages
	Language.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Language.list');
		console.log(data);
		
		$scope.languages = data;
	});
	
	// get roles
	Role.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Role.list');
		console.log(data);
		
		// push admin, contributor and member
		data.push({
			RoleId: 'Admin',
			Name: 'Admin', 
			CanView: '', 
			CanEdit: '', 
			CanPublish: '', 
			CanRemove: '', 
			CanCreate: ''});
			
		data.push({
			RoleId: 'Contributor',
			Name: 'Contributor', 
			CanView: '', 
			CanEdit: '', 
			CanPublish: '', 
			CanRemove: '', 
			CanCreate: ''});
			
		data.push({
			RoleId: 'Member',
			Name: 'Member', 
			CanView: '', 
			CanEdit: '', 
			CanPublish: '', 
			CanRemove: '', 
			CanCreate: ''});
		
		$scope.roles = data;
	});
	
	// shows the user dialog for editing
	$scope.showEditUser = function(user){
	
		// set temporary model
		$scope.temp = user;
		
		$scope.temp.Password = 'temppassword';
	
		$('#addEditDialog').modal('show');
    	
    	$('#addEditDialog').find('.edit').show();
		$('#addEditDialog').find('.add').hide();
	}
	
	// edits the user
	$scope.editUser = function(user){
	
		message.showMessage('progress');
	
		User.edit(user, function(){
			message.showMessage('success');
		});
	
		$('#addEditDialog').modal('hide');
	}
	
	// shows the dialog to add a user
	$scope.showAddUser = function(){
	
		// set temporary model
		$scope.temp = {
			firstName: '', 
			lastName: '', 
			role: 'Admin', 
			language: 'en', 
			isActive: '1', 
			email: '', 
			password: ''};
	
		$('#addEditDialog').modal('show');
    	
    	$('#addEditDialog').find('.add').show();
		$('#addEditDialog').find('.edit').hide();
	}
	
	// adds the user
	$scope.addUser = function(user){
	
		message.showMessage('progress');
	
		User.add(user, function(){
			message.showMessage('success');
		});
	
		$('#addEditDialog').modal('hide');
	}
	
	// shows the remove user dialog
	$scope.showRemoveUser = function(user){
	
		// set temporary model
		$scope.temp = user;
	
		$('#removeDialog').modal('show');
	}
	
	// removes the user
	$scope.removeUser = function(user){
	
		message.showMessage('progress');
	
		User.remove(user, function(){
			message.showMessage('success');
		});
	
		$('#removeDialog').modal('hide');
	}
	
	// shows the images dialog
	$scope.showAddImage = function(user){
		$scope.temp = user;
		
		$('#imagesDialog').modal('show');
	}
	
	// list new images
	$scope.updateImages = function(){
		Image.list(function(data){
			// debugging
			if(Setup.debug)console.log('[triangulate.debug] Image.list');
			console.log(data);
			
			$scope.images = data;
		});
	}
	
	// update the images for the dialog
	$scope.updateImages();
	
	// add image
	$scope.addImage = function(image){
	
		message.showMessage('progress');
	
		User.addImage($scope.temp.UserId, image, function(){
			message.showMessage('success');
		});
	
		$('#imagesDialog').modal('hide');
	}


})

// roles controller
.controller('RolesCtrl', function($scope, $rootScope, Setup, Role, PageType) {
	
	$rootScope.template = 'roles';
	
	// setup
	$scope.setup = Setup;
	$scope.loading = true;
	$scope.temp = null;
	$scope.isDefault = true;
	
	// handle checkbox clicking
	$('body').on('click', '.chk-view-all', function(){
		$('.chk-view').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-edit-all', function(){
		$('.chk-edit').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-publish-all', function(){
		$('.chk-publish').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-remove-all', function(){
		$('.chk-remove').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-create-all', function(){
		$('.chk-create').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-view', function(){
		$('.chk-view-all').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-edit', function(){
		$('.chk-edit-all').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-publish', function(){
		$('.chk-publish-all').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-remove', function(){
		$('.chk-remove-all').removeAttr('checked');
	});
	
	$('body').on('click', '.chk-create', function(){
		$('.chk-create-all').removeAttr('checked');
	});

	// list roles
	Role.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] Role.list');
		console.log(data);
		
		$scope.roles = data;
		$scope.loading = false;
	});
	
	// list all page types
	PageType.list(function(data){
	
		// debugging
		if(Setup.debug)console.log('[triangulate.debug] PageType.list');
		console.log(data);
		
		$scope.pageTypes = data;
	});
	
	// sets up the checkboxes in the dialog
	$scope.setupCheckboxes = function(view, edit, publish, remove, create){
	
		$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked');
	
		// check view boxes
		if(view == 'All'){
			$('#addEditDialog').find('.chk-view-all').attr('checked', 'checked');
		}
		else{
			var list = view.split(',');
			
			for(x=0; x<list.length; x++){
				$('#addEditDialog').find('.chk-view-'+list[x]).attr('checked', 'checked');
			}
		}
		
		// check edit boxes
		if(edit == 'All'){
			$('#addEditDialog').find('.chk-edit-all').attr('checked', 'checked');
		}
		else{
			var list = edit.split(',');
			
			for(x=0; x<list.length; x++){
				$('#addEditDialog').find('.chk-edit-'+list[x]).attr('checked', 'checked');
			}
		}
		
		// check publish boxes
		if(publish == 'All'){
			$('.chk-publish-all').attr('checked', 'checked');
		}
		else{
			var list = publish.split(',');
			
			for(x=0; x<list.length; x++){
				$('#addEditDialog').find('.chk-publish-'+list[x]).attr('checked', 'checked');
			}
		}
		
		// check remove boxes
		if(remove == 'All'){
			$('#addEditDialog').find('.chk-remove-all').attr('checked', 'checked');
		}
		else{
			var list = remove.split(',');
			
			for(x=0; x<list.length; x++){
				$('#addEditDialog').find('.chk-remove-'+list[x]).attr('checked', 'checked');
			}
		}
		
		// check create boxes
		if(create == 'All'){
			$('#addEditDialog').find('.chk-create-all').attr('checked', 'checked');
		}
		else{
			var list = create.split(',');
			
			for(x=0; x<list.length; x++){
				$('#addEditDialog').find('.chk-create-'+list[x]).attr('checked', 'checked');
			}
		}
	}
	
	// shows the default values
	$scope.showDefault = function(role){
		
		// set default
		$scope.isDefault = true;
		
		// setup the checkboxes
		if(role == 'Admin'){
			$scope.setupCheckboxes('All', 'All', 'All', 'All', 'All');
		}
		else if(role == 'Contributor'){
			$scope.setupCheckboxes('All', 'All', '', '', '');
		}
		else if(role == 'Member'){
			$scope.setupCheckboxes('All', '', '', '', '');
		}
	
		$('#addEditDialog').modal('show');
    	
    	$('#addEditDialog').find('.edit').show();
		$('#addEditDialog').find('.add').hide();
		
	}
	
	// shows the role dialog for editing
	$scope.showEditRole = function(role){
	
		// set default
		$scope.isDefault = false;
	
		// set temporary model
		$scope.temp = role;
	
		// setup the checkboxes
		$scope.setupCheckboxes(role.CanView, role.CanEdit, role.CanPublish, role.CanRemove, role.CanCreate)
	
		$('#addEditDialog').modal('show');
    	
    	$('#addEditDialog').find('.edit').show();
		$('#addEditDialog').find('.add').hide();
	}
	
	// gets value
	$scope.getPermissions = function(type){
		
		var canDo = '';
		
		// get permissions 
		if($('.chk-'+type+'-all').prop('checked')){
			canView = 'All';
		}
		else{
			var checks = $('.chk-' + type);
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canDo += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// replace trailing comma and trim
		canDo = canDo.replace(/(^,)|(,$)/g, "");
		canDo = $.trim(canDo);
		
		return canDo;
	}
	
	// edits the role
	$scope.editRole = function(role){
	
		// set permissions
		role.CanView = $scope.getPermissions('view');
		role.CanEdit = $scope.getPermissions('edit');
		role.CanPublish = $scope.getPermissions('publish');
		role.CanRemove = $scope.getPermissions('remove');
		role.CanCreate = $scope.getPermissions('create');
	
		message.showMessage('progress');
	
		Role.edit(role, function(){
			message.showMessage('success');
		});
	
		$('#addEditDialog').modal('hide');
	}
	
	// shows the dialog to add a role
	$scope.showAddRole = function(){
	
		// set default
		$scope.isDefault = false;
	
		// set temporary model
		$scope.temp = {
			Name: '', 
			CanView: '', 
			CanEdit: '', 
			CanPublish: '', 
			CanRemove: '', 
			CanCreate: ''};
		
		$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked');
	
		$('#addEditDialog').modal('show');
    	
    	$('#addEditDialog').find('.add').show();
		$('#addEditDialog').find('.edit').hide();
	}
	
	// adds the role
	$scope.addRole = function(role){
	
		// set permissions
		role.CanView = $scope.getPermissions('view');
		role.CanEdit = $scope.getPermissions('edit');
		role.CanPublish = $scope.getPermissions('publish');
		role.CanRemove = $scope.getPermissions('remove');
		role.CanCreate = $scope.getPermissions('create');
	
		message.showMessage('progress');
	
		Role.add(role, function(){
			message.showMessage('success');
		});
		
		$('#addEditDialog').modal('hide');
	}
	
	// shows the remove role dialog
	$scope.showRemoveRole = function(role){
	
		// set temporary model
		$scope.temp = role;
	
		$('#removeDialog').modal('show');
	}
	
	// removes the role
	$scope.removeRole = function(role){
	
		Role.remove(role);
	
		$('#removeDialog').modal('hide');
	}

});