class Dropbox {

	constructor() {

	}

	async getBook(data, time){
	    var url = "https://content.dropboxapi.com/2/files/download";

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);
	    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
	    xhr.setRequestHeader("Dropbox-API-Arg", '{"path": "' + data + '"}');
	    xhr.setRequestHeader('Content-Type','application/octet-stream')
	    xhr.onload = function(){
	        if (xhr.status === 200) {
	    			    	/*var enc = new string_transcoder("windows-1252");
				var tenc = enc.transcode(xhr.responseText);
		    	console.log(text);*/
	            let parser = new DOMParser();
	            let xmlDOM = parser.parseFromString(xhr.responseText, 'application/xml')
	            var author = xmlDOM.getElementsByTagName('author')[0];

	            var title = '';
	            var content = '';
	            try {
	                var author_str = '' + author.getElementsByTagName('first-name')[0].innerHTML + " ";
	            } 
	            catch(err){
	                var author_str = '';
	            }
	            try {
	                var tmp = author.getElementsByTagName('middle-name')[0].innerHTML + " ";
	                author_str += tmp
	            }
	            catch(err){console.log(err)}
	            try {
	                var tmp = author.getElementsByTagName('last-name')[0].innerHTML;
	                author_str += tmp
	            }
	            catch(err){}
	            title = xmlDOM.getElementsByTagName('book-title')[0].innerHTML;
	            content = xhr.responseText;
	            if(!getCookie('current_book')) {
	                books_list.push(new Book(author_str, title, content, data, time));
	                var elem = document.getElementById('libary');
	                elem.classList.remove('invisible');
	                let li = document.createElement('li');
	                var mode;
	                if (!getCookie('show_mode')) {
	                    mode = ' ';
	                }
	                else mode = 'list';
	                li.className = 'book-wrapper '+mode;
	                li.id = data;

	                li.onclick = function(id){
	                    document.cookie = 'current_book='+data;
	                    update_settings('current_book',data)
	                    let target = event.target;
	                    target = target.parentElement      
	                    for(var j = 0; j < books_list.length; j++) {
	                        if(books_list[j].get(data) === true) {
	                            books_list[j].show();
	                        }
	                    }
	                };
	                var your_binary_data = xmlDOM.getElementsByTagName("binary")[0].innerHTML; // parse text data to URI format
	                var img = 'data:image/jpeg;base64,' + your_binary_data;
	                var mode;
	                if (!getCookie('show_mode') ) {
	                    mode = ' ';
	                }
	                else mode = 'list-img-wrapper';
	                li.innerHTML = '<div class = "img-wrapper ' + mode + '"><img src = "'+ img + '"></div><p class="author">' + author_str + ' </p><p class="title"> '+ title +' </p>';
	                elem.append(li);
	                var load_circle = document.getElementById("loader");
	                load_circle.classList.add('invisible');
	            }
	            else {
	                if (data == getCookie("current_book")) {
	                    var load_circle = document.getElementById("loader");
	                    load_circle.classList.add('invisible');
	                    var book = new Book(author_str, title, content, data, 0)
	                    book.show();
	                }
	                
	            }        
	        }
	    }


		xhr.send();
	}

	getFilesFromFolder() {
		
	    const book_field = document.getElementsByClassName('book-field')[0];
	    book_field.innerHTML = '';
	    book_field.id = '';
	    var load_circle = document.getElementById("loader");
	    load_circle.classList.remove('invisible');
	    if(books_list.length > 0){
	        var lib = document.getElementById('libary');
	        lib.classList.remove('invisible');
	        var book = document.getElementsByClassName('show_book')[0];
	        book.classList.add('invisible');
	        load_circle.classList.add('invisible');
	    }
	    else {

	        try{

			    var xhr = new XMLHttpRequest();
			    var data = {
			        "path": "/books/",
			        "recursive": true,
			        "include_media_info": true,
			        "include_deleted": true,
			        "include_has_explicit_shared_members": false,
			        "include_mounted_folders": true,
			        "include_non_downloadable_files": true};
			        
			    //xhr.open("GET",'https://www.googleapis.com/drive/v3/files?pageToken=~!!~AI9FV7Q4NBKdqQj6AXUBdvwalrBIKCxyiAvZvIyWN8GfHD7IdcM3IB1srkp6wQN0EHmSc_pcGDvxf0q6XyiLHFZgJOaESENazCr1Afxi1BlNSmeBOBdfZQcOazezyPelBQyCTdpr5clWK8z4J2asbFOwrriU_knooB1I4TJhUh98B1BqIUt0yYPTpbYkd6SoOzqvmMt-oBKSxl74Y-Ns_7RHq89rd21fT_vS9woAgMs2IuEo3GEwL3IJsRfsOJF36yp1BLn2o5K_9cXljOirdfmNWU1nrryQld03yS83dJcXUjiXtuwfaawj7Y3fDsxrXK2j7OFPfltgS7tv5GmMB5A_dJEY8ZKrG0g7Paa6NKW0YqOBGXLuR8z20RzIDEOp_iFhno_Y-jPq', true);
			    xhr.open('POST', 'https://api.dropboxapi.com/2/files/list_folder', true);
			    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
			    xhr.setRequestHeader("Content-Type", "application/json");
			    
			    xhr.onload = function() { 
				   	if (xhr.readyState === xhr.DONE) {
	                    if (xhr.status === 200) {
	                        service.getListOfBooks(xhr.responseText);
	                    }
	                    else if(xhr.status === 401) {
	                    	console.log(xhr.response)
	                        //onLogOut();
	                        //service.reloadUserAuth()
	                           
	                    }
	                }
	       
	            };
			    xhr.send(JSON.stringify(data));    
			  
	        }
	        catch(err) {
	        	console.log(err)
	            access_token = authResponse.access_token;
	            document.cookie = 'access_token='+access_token;
	        }
	    }
	}

	async create_setting_file() {
		var url = "https://content.dropboxapi.com/2/files/upload";

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);

		xhr.setRequestHeader('Authorization','Bearer '+ access_token);
		xhr.setRequestHeader("Dropbox-API-Arg", '{"path": "/books/setting.json","mode": "add","autorename": false,"mute": false,"strict_conflict": false}');
		xhr.setRequestHeader("Content-Type", "application/octet-stream");

		xhr.onreadystatechange = function () {
			if(xhr.status === 200){
				var str = JSON.parse(xhr.responseText);
				document.cookie = 'setting_file=' + str['id'];
			}
		   	else if (xhr.readyState === 4) {
		      console.log(xhr.status);
		      console.log(xhr.responseText);
		   }};



		xhr.send();
	   
	}
	async write_in_settings() {
	    var url = "https://content.dropboxapi.com/2/files/upload";

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);

		xhr.setRequestHeader('Authorization','Bearer '+ access_token);
		xhr.setRequestHeader("Dropbox-API-Arg", '{"path": "/books/setting.json","mode": "overwrite","autorename": false,"mute": false,"strict_conflict": false}');
		xhr.setRequestHeader("Content-Type", "application/octet-stream");

		xhr.onreadystatechange = function () {
			console.log(xhr.response)
		};

	    xhr.send(JSON.stringify(settings))
	}


	async get_settings_from_file() {
		console.log('fineee')
	    var url = "https://content.dropboxapi.com/2/files/download";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);
	    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
	    xhr.setRequestHeader("Dropbox-API-Arg", '{"path": "' + getCookie('setting_file') + '"}');
	    xhr.setRequestHeader('Content-Type','application/octet-stream')
	    xhr.onload = function() {
	        if(xhr.status === 200) {   
	            settings = JSON.parse(xhr.response)

	            for(var key in settings){
	                document.cookie = key + '=' + settings[key];
	                console.log(key + "             "+ settings[key]);
	            }
	            set_settings();
	        }
	        else {
	           // onLogOut();
	        }
	    }
	    xhr.send()
	}



	reloadUserAuth() {
	    var googleUser = GoogleAuth.currentUser.get();
	    googleUser.reloadAuthResponse().then(
	        function(authResponse) {
	            //signOutBtn.classList.remove("invisible");
	            access_token = authResponse.access_token;
	            document.cookie = 'access_token='+access_token; 
	            console.log('fine')
	        }
	    );
	}


	create_folder() {
		console.log('asdasd');
		var url = "https://api.dropboxapi.com/2/files/create_folder_v2";

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);

		xhr.setRequestHeader("Authorization", "Bearer " + access_token);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = function () {
		   if (xhr.readyState === 4) {
		      console.log(xhr.status);
		      console.log(xhr.responseText);
		   }};

		var data = '{"path": "/books","autorename": false}';

		xhr.send(data);
	}


	getFolder(){
		var load_circle = document.getElementById("loader");
	    if (!getCookie('current_book')) {
	        load_circle.classList.add('invisible');
	    }
	    var xhr = new XMLHttpRequest();
	    var data = {
	        "path": "/books/",
	        "recursive": true,
	        "include_media_info": true,
	        "include_deleted": true,
	        "include_has_explicit_shared_members": false,
	        "include_mounted_folders": true,
	        "include_non_downloadable_files": true};

	    xhr.open('POST', 'https://api.dropboxapi.com/2/files/list_folder', true);
	    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
	    xhr.setRequestHeader("Content-Type", "application/json");
	    xhr.onload = function() { 
	        if (xhr.status === 200) {
	            var str = JSON.parse(xhr.responseText);
	            var folder_id = str['entries'][0]['id'].split(':')[1];
	            document.cookie = 'folder_id='+folder_id;
	            onSingIn();
	        }
	        else {
	        	console.log(xhr.response);
	        	var err = JSON.parse(xhr.response)['error_summary'];
	            if(err.includes('path/not_found')) {
	            	console.log('wtf is that')
	            	service.create_folder();
	            }

	        }
	    }
	    xhr.send(JSON.stringify(data));
	}


	getListOfBooks(response){
	    var text = JSON.parse(response)['entries'];
	    var setting_file = true;
	    for(var i = 0; i < text.length; i++) {
	    	if(text[i]['.tag'] === 'file'){
	    		var book_name = text[i]['name'].split('.')
	    		if(book_name[book_name.length - 1] === 'fb2') {
	    			var id = text[i]['id'];
	    			service.getBook(id, text[i]['client_modified']);
	    			//console.log();
	    		}
	    		else if(text[i]['name'] === 'setting.json') {

	    			document.cookie = 'setting_file=' + text[i]['id'];
	        	    setting_file = false;
	    		}
	    	}
	    }
	    if(setting_file){
	        service.create_setting_file();
	    }
	}


}

