
const developerKey = 'AIzaSyB7ae05ZDWxcvkjzZFPpgjmoRFQ_C89ZQg';
const clientId = '686887041548-hk26nfacbcflql93pk2nvikh9jv915sj.apps.googleusercontent.com';
const scope =  
                'https://www.googleapis.com/auth/drive.readonly' 
                ;
let GoogleAuth;
let access_token;

var folder_id;

var books_list = [];


class Book{
    constructor(author, title, content, id){
        this.author = author;
        this.title = title;
        this.content = content;
        this.id = id;

    }
    get(id){
        if (this.id === id)
            return true;
        return false;
    }
    show() {
        var ul = document.getElementById('libary');
        ul.classList.add('invisible');
        var book = document.getElementsByClassName('book-field')[0];
        book.classList.remove('invisible');
        book.innerHTML = this.content;
        book.id = this.id;
        console.log(getCookie(this.id))
        if(getCookie(this.id) === null) {
            console.log(pageYOffset);
        }
        else {
            window.scrollTo(0, getCookie(this.id))
        }

    }

}


function onSingIn() {
    const authBt = document.getElementById('googleDrive');
    const signOutBtn = document.getElementById('googleDriveOff');
    const pickerBtn = document.getElementById('googlePicker');
    const menu = document.getElementById('mainmenu');
    const auth_menu = document.getElementById('main-auth');
    const main = document.getElementById('main');
    authBt.classList.add('invisible');
    signOutBtn.classList.remove('invisible');
    pickerBtn.classList.remove('invisible');
    menu.classList.remove('invisible');
    auth_menu.classList.add('invisible');
    main.classList.remove('invisible');
}



function onLogOut() {
    const authBt = document.getElementById('googleDrive');
    const signOutBtn = document.getElementById('googleDriveOff');
    const pickerBtn = document.getElementById('googlePicker');
    const menu = document.getElementById('mainmenu');
    const auth_menu = document.getElementById('main-auth');
    const main = document.getElementById('main');
    const lab = document.getElementById('libary');
    authBt.classList.remove('invisible');
    signOutBtn.classList.add('invisible');
    pickerBtn.classList.add('invisible');
    menu.classList.add('invisible');
    auth_menu.classList.remove('invisible');
    main.classList.add('invisible');
    lab.classList.add('invisible');
    var book = document.getElementsByClassName("book-wrapper");
    for (var i = 0; i < book.length; i++) {
        tmp = book[i];
        tmp.remove();
    }

}

// ===== start function ===== //
window.onApiLoad = function() {
    if(getCookie('auth') !== null) {

        onSingIn();
        console.log('fine')
    }
    else {
        onLogOut()
        
    }
    
    try {   
            gapi.load('auth2', function() {
            auth2 = gapi.auth2.init({
                client_id: clientId,
                prompt: 'select_account',
                scope: scope
                
            }).then(function() {

                GoogleAuth = gapi.auth2.getAuthInstance();
                const authBt = document.getElementById('googleDrive')
                const signOutBtn = document.getElementById('googleDriveOff');
                const pickerBtn = document.getElementById('googlePicker')
                if (GoogleAuth.currentUser.get().Ca === null)
                    onLogOut();
                else onSingIn();
                    onAuthApiLoad();
                
            });
        });
        } catch(err) {
            console.log(err);
        }

        
        
    
}

function onAuthApiLoad() {

    access_token = getCookie("access_token")
    const authBt = document.getElementById('googleDrive');
    const signOutBtn = document.getElementById('googleDriveOff');
    const pickerBtn = document.getElementById('googlePicker');
    const errorBtn = document.getElementById('folder_error_button');
    //console.log(GoogleAuth.currentUser.get())
    const bookPicker = document.getElementById("books");
    try {

        access_token =  GoogleAuth.currentUser.get().uc.access_token;
    }
    catch(err){
        
    }
    authBt.addEventListener('click', function() {
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            GoogleAuth.grantOfflineAccess({
                prompt: 'select_account', //select_account, consent
                scope: scope
            }).then(
                function(resp) {
                    onSingIn();
                    document.cookie = 'auth=google';
                    googleUser = GoogleAuth.currentUser.get();
                    googleUser.reloadAuthResponse().then(
                        function(authResponse) {

                            //signOutBtn.classList.remove("invisible");
                            access_token = authResponse.access_token;
                            document.cookie = 'access_token='+access_token;
                            getFolder(); // при нажатии на кнопку авторизации начинается поиск папки на гугл диске
                            /*setTimeout(() => {
                                if (folder_id === 'err' || folder_id === undefined){
                                     document.cookie = 'folder_id=no_folder';
                                     console.log(getCookie('folder_id'))
                                 }
                                else{
                                    document.cookie = 'folder_id='+folder_id;
                                    console.log(getCookie('folder_id'))
                                }
                            }, 1000)*/
                    
                            //createPicker(authResponse);
                        }
                    );
                }
            );
            
        } else {
            //reloadUserAuth();
        }
        
    });

    signOutBtn.addEventListener('click', function() {
        //console.log("singed_out");
        GoogleAuth.signOut();
        onLogOut();
        deleteCookie("folder_id");
    });


    pickerBtn.addEventListener('click', function() {
        /*googleUser = GoogleAuth.currentUser.get();
        googleUser.reloadAuthResponse().then(
            function(authResponse) {
                access_token = authResponse.access_token;

            }
        );*/
        var id_folder = getCookie('folder_id');
        if (id_folder === 'no_folder') { //путь до папки записан в куки
            // добавить чек для куки

            // скрыввать класс итем после нахождения либо не нахождения папки
            //
            // 
            folderNotFound();
        }
        else {
            getFilesFromFolder();
        }
    });
    errorBtn.addEventListener('click', function() {
        getFolder(); // при нажатии на кнопку авторизации начинается поиск папки на гугл диске
        setTimeout(() => {
            if (folder_id === 'err' || folder_id === undefined){
                document.cookie = 'folder_id=no_folder';
                var block = document.getElementById('folder_error_button')
                block.innerHTML = 'Папка по прежнему не найдена';
             }
            else{
                document.cookie = 'folder_id='+folder_id;
                var block = document.getElementById('folder_error');
                block.classList.add('invisible');
                block = document.getElementById('folder_error_button');
                block.classList.add('invisible');

            }
        }, 1000)
    });
/*    bookPicker.addEventListener('click', function() {
        let target = event.target; // где был клик?
          console.log(target); // подсветить TD
    });*/
}

function reloadUserAuth() {

    googleUser = GoogleAuth.currentUser.get();
    googleUser.reloadAuthResponse().then(
        function(authResponse) {
            //signOutBtn.classList.remove("invisible");
            access_token = authResponse.access_token;
            createPicker(authResponse);
        }
    );
}

function createPicker(authResult) {
    
    if (authResult && !authResult.error) {

        gapi.load('picker', function() {
            const picker = new google.picker.PickerBuilder().
            enableFeature(google.picker.Feature.MULTISELECT_ENABLED).
            addView(new google.picker.DocsView(google.picker.ViewId.DOCS).
                setIncludeFolders(true).
                setParent(getCookie("folder_id")).
                setSelectFolderEnabled(true)
                    ).
            setOAuthToken(access_token).
            setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
            picker.setVisible(true);
        });
    }
}

async function pickerCallback(_data) {
    console.log(_data);
    if(_data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        getBook(_data[google.picker.Response.DOCUMENTS][0]);

    }
}



async function getBook(data){

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.googleapis.com/drive/v3/files/"+data+'?alt=media', true);
    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
    xhr.onload = function(){

        let parser = new DOMParser();
        let xmlDOM = parser.parseFromString(xhr.responseText, 'application/xml')
        author = xmlDOM.getElementsByTagName('author')[0];
        author_str = '' + author.getElementsByTagName('first-name')[0].innerHTML + " ";
        author_str += author.getElementsByTagName('middle-name')[0].innerHTML + " ";
        author_str += author.getElementsByTagName('last-name')[0].innerHTML;

        title = xmlDOM.getElementsByTagName('book-title')[0].innerHTML;

        content = xmlDOM.getElementsByTagName('body')[0].innerHTML;
        books_list.push(new Book(author_str, title, content, data));
        elem = document.getElementById('libary');
        elem.classList.remove('invisible');
        let li = document.createElement('li');
        li.className = 'book-wrapper';
        li.id = data;
        li.onclick = function(id){
            let target = event.target;
            for (var i = 0; i < id.path.length; i++) {
                if(id.path[i].nodeName == 'LI'){
                    for(var j = 0; j < books_list.length; j++) {
                        if(books_list[j].get(id.path[i].id) === true) {
                            books_list[j].show();
                        }
                    }
                    return;
                }
            }
        };
        var your_binary_data = xmlDOM.getElementsByTagName("binary")[0].innerHTML; // parse text data to URI format
        img = 'data:image/jpeg;base64,' + your_binary_data;
        li.innerHTML = '<img src = "'+ img + '"><p class="author">' + author_str + ' </p><p class="title"> '+ title +' </p>';
        elem.append(li);
        load_circle.classList.add('invisible');
    }
    xhr.send();
    
}



function getFolder(){
    load_circle = document.getElementById("loader");
    load_circle.classList.remove('invisible');
    var xhr = new XMLHttpRequest();
    xhr.open("GET",'https://www.googleapis.com/drive/v3/files', true);
    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
    xhr.onload = function() { 
        var str = JSON.parse(xhr.responseText);
        files = str.files;
        for(var i = 0; i < files.length; i++) {
           if (files[i].name ==='books' && files[i].mimeType === "application/vnd.google-apps.folder") {
                folder_id = files[i].id;
                document.cookie = 'folder_id='+folder_id;
                
                load_circle.classList.add('invisible');
                onSingIn();
                return;
           }
        }
        load_circle = document.getElementById("loader");
        load_circle.classList.add('invisible');
        onSingIn();
        folderNotFound();
    }
    xhr.send();

}

function getCookie ( cookie_name )
{
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
 
  if ( results )
    return ( unescape ( results[2] ) );
  else
    return null;
}

function deleteCookie ( cookie_name )
{
  var cookie_date = new Date ( );  // Текущая дата и время
  cookie_date.setTime ( cookie_date.getTime() - 1 );
  document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}

function getFilesFromFolder() {
    load_circle = document.getElementById("loader");
    load_circle.classList.remove('invisible');
    if(books_list.length > 0){
        console.log('wtf')
        lib = document.getElementById('libary');
        lib.classList.remove('invisible');
        var book = document.getElementsByClassName('book-field')[0];
        book.classList.add('invisible');
        load_circle.classList.add('invisible');

    }
    else {

        var xhr = new XMLHttpRequest();
        console.log(access_token);
        xhr.open("GET","https://www.googleapis.com/drive/v3/files?q='" + getCookie("folder_id") + "'+in+parents&key="+ developerKey+"", true);
        xhr.setRequestHeader('Authorization','Bearer '+ access_token);
        xhr.onload = function() { 
            console.log(xhr.responseText);
            getListOfBooks(xhr.responseText);

        }
        xhr.send();
    }


}

function folderNotFound() {
    console.log('wtf');
    var block = document.getElementById('folder_error')
    block.classList.remove("invisible");
    var block = document.getElementById("folder_error_button");
    block.classList.remove("invisible");
}

function getListOfBooks(response){
    var text = JSON.parse(response);
    for(var i = 0; i < text.files.length; i++) {
        if (text.files[i].mimeType === 'text/xml') {
            
            getBook(text.files[i].id);
        } 
    }

}

function doStopper() {
    var book_id = document.getElementsByClassName('book-field')[0];
    document.cookie = book_id.id +'='+pageYOffset;
}




// 2 страницы
// для авторизованных пользователей

//https://docs.google.com/picker/pvr?hl=en_US&oauth_token=ya29.A0AfH6SMA0_3KwrlqzJ1q8m4ajMxZimsJpxB2eOcLaO3DwleU8eEvEMHcy5vqiIWju8QesKgWWaHPPmAcaMzT7H6ScpRcQ2d57gvonhrJdbqahw1KesZqGUcvBj8x3YC7I6g2HRcl-SbFoWbGJZpljaHo-D56A4A&hostId=localhost&xtoken=AL7Jy1w7vg98qW2F5SSH7lq3s0D71CPTwQ:1614120487533