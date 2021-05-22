class Google {

	constructor() {

	}

	async getBook(data, time){
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", "https://www.googleapis.com/drive/v3/files/"+data+'?alt=media', true);
	    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
	    xhr.onload = function(){
	        if (xhr.status === 200) {
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
	            catch(err){}
	            try {
	                var tmp = author.getElementsByTagName('last-name')[0].innerHTML;
	                author_str += tmp
	            }
	            catch(err){}
	            title = xmlDOM.getElementsByTagName('book-title')[0].innerHTML;
	            content = xhr.responseText;
	            var your_binary_data = xmlDOM.getElementsByTagName("binary")[0].innerHTML; // parse text data to URI format
                var img = 'data:image/jpeg;base64,' + your_binary_data;
                books_list.push(new Book(author_str, title, content, data, time, img));
	            var elem = document.getElementById('libary');
                if(!getCookie('current_book')){
	                elem.classList.remove('invisible');
                }
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
                
                var mode;
                if (!getCookie('show_mode') ) {
                    mode = ' ';
                }
                else mode = 'list-img-wrapper';
                li.innerHTML = '<div class = "img-wrapper ' + mode + '"><img src = "'+ img + '"></div><p class="author">' + author_str + ' </p><p class="title"> '+ title +' </p>';
                elem.append(li);
                var load_circle = document.getElementById("loader");
                load_circle.classList.add('invisible');
                if (data == getCookie("current_book")) {
                    var load_circle = document.getElementById("loader");
                    load_circle.classList.add('invisible');
                    var book = new Book(author_str, title, content, data, 0, 0)
                    book.show();
                    //service.getFilesFromFolder(true);

                }
	               
	                
	                  
	        }
	    }
	    xhr.send();
	}


	getFilesFromFolder() {
	    const book_field = document.getElementsByClassName('book-field')[0];
	    var info_icon = document.getElementById('info_icon');
    	info_icon.classList.add('invisible');
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
	            
	            xhr.open("GET","https://www.googleapis.com/drive/v3/files?pageSize=1000&fields=files(createdTime%2Ckind%2CmimeType%2Cname%2Cid)&q='" + getCookie("folder_id") + "'+in+parents&key="+ developerKey_google , true);
	            xhr.setRequestHeader('Authorization','Bearer '+ access_token);
	            xhr.onload = function() { 
	                if (xhr.readyState === xhr.DONE) {
	                    if (xhr.status === 200) {
	                        service.getListOfBooks(xhr.responseText);
	                    }
	                    else if(xhr.status === 401) {
	                        service.reloadUserAuth()
	                        service.getFilesFromFolder();
	                    }
	                }
	            }
	            xhr.send();
	        }
	        catch(err) {
	            access_token = authResponse.access_token;
	            document.cookie = 'access_token='+access_token;
	        }
	    }
	}

	async create_setting_file() {
	    var xhr = new XMLHttpRequest();

	    xhr.open("POST","https://www.googleapis.com/drive/v3/files?alt=json&key="+ developerKey_google , true);
	    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
	    xhr.setRequestHeader('Content-Type','application/json');
	    xhr.onload = function() {

	        document.cookie = 'setting_file=' + JSON.parse(xhr.response).id;
	    }
	    xhr.send(JSON.stringify({"name":"setting.json","parents":[getCookie("folder_id")]}))
	}
	async write_in_settings() {
	    var xhr = new XMLHttpRequest();
	    xhr.open("PATCH","https://www.googleapis.com/upload/drive/v3/files/" + getCookie("setting_file") +"?key" + developerKey_google , true);
	    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
	    xhr.setRequestHeader('Content-Type','text/html; charset=utf-8');
	    xhr.onload = function() {
            if(xhr.status === 401) {
                service.reloadUserAuth()
                   
            }
	    }
	    xhr.send(JSON.stringify(settings))
	}


	async get_settings_from_file() {

	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", "https://www.googleapis.com/drive/v3/files/"+getCookie("setting_file")+'?alt=media', true);
	    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
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
	        	
	        	service.get_settings_from_file();
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
	            document.location.reload();
	        }
	    );

	}
	getFolder(){
	    var load_circle = document.getElementById("loader");
	    if (!getCookie('current_book')) {
	        
	        load_circle.classList.add('invisible');

	    }
	    var xhr = new XMLHttpRequest(); 
	    
	    xhr.open('GET', 'https://www.googleapis.com/drive/v3/files?q=name%20%3D%20%27books%27' , true);
	    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
	    xhr.onload = function() { 
	        if (xhr.status === 200) {
	            var str = JSON.parse(xhr.responseText);
	            var files = str.files;
	            var folder_id = files[0].id;
	            document.cookie = 'folder_id='+folder_id;
	            load_circle.classList.add('invisible');
	            onSingIn();
	        }
	        else {
	            load_circle = document.getElementById("loader");
	            load_circle.classList.add('invisible');
	            onSingIn();
	            folderNotFound();
	        }
	    }
	    xhr.send();
	}

	getListOfBooks(response){
	    var text = JSON.parse(response);
	    var setting_file = true;
	    for(var i = 0; i < text.files.length; i++) {
	        if (text.files[i].mimeType.includes('xml')) {
	            service.getBook(text.files[i].id, text.files[i].createdTime);
	        }
	        else if (text.files[i].mimeType.includes('zip')) {
	           // getBook(text.files[i].id, true);
	            console.log('its zip');
	        }
	        else if (text.files[i].name == 'setting.json'){
	            document.cookie = 'setting_file=' + text.files[i].id;
	            setting_file = false;
	        } 
	    }
	    if(setting_file){
	        service.create_setting_file();
	    }
	}

}

