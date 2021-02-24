
const developerKey = 'AIzaSyB7ae05ZDWxcvkjzZFPpgjmoRFQ_C89ZQg';
const clientId = '686887041548-hk26nfacbcflql93pk2nvikh9jv915sj.apps.googleusercontent.com';
const scope =   'https://www.googleapis.com/auth/drive.file ' +
                'https://www.googleapis.com/auth/drive.metadata ' +
                'https://www.googleapis.com/auth/drive.readonly';
let GoogleAuth;
let access_token;





function onSingIn() {
const authBt = document.getElementById('googleDrive');
const signOutBtn = document.getElementById('googleDriveOff');
const pickerBtn = document.getElementById('googlePicker');
    authBt.classList.add('invisible');
    signOutBtn.classList.remove('invisible');
    pickerBtn.classList.remove('invisible');
}

function onLogOut() {
    const authBt = document.getElementById('googleDrive');
    const signOutBtn = document.getElementById('googleDriveOff');
    const pickerBtn = document.getElementById('googlePicker');
    authBt.classList.remove('invisible');
    signOutBtn.classList.add('invisible');
    pickerBtn.classList.add('invisible');
}

// ===== start function ===== //
window.onApiLoad = function() {
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
                onAuthApiLoad()
            });
        });
        } catch(err) {
            console.log(err);
        }
    
}

function onAuthApiLoad() {
    const authBt = document.getElementById('googleDrive')
    const signOutBtn = document.getElementById('googleDriveOff');
    const pickerBtn = document.getElementById('googlePicker')
    console.log(GoogleAuth.currentUser.get())
    if (GoogleAuth.currentUser.get().Ca === null)
        console.log("u are not authorized ");
    authBt.addEventListener('click', function() {
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            GoogleAuth.grantOfflineAccess({
                prompt: 'select_account', //select_account, consent
                scope: scope
            }).then(
                function(resp) {
                    onSingIn();
                    //reloadUserAuth();
                }
            );
        } else {
            reloadUserAuth();
        }
        
    });

    signOutBtn.addEventListener('click', function() {
        console.log("singed_out");
        GoogleAuth.signOut();
        onLogOut();
    });
    pickerBtn.addEventListener('click', function() {
        googleUser = GoogleAuth.currentUser.get();
        googleUser.reloadAuthResponse().then(
        function(authResponse) {
            //signOutBtn.classList.remove("invisible");
            access_token = authResponse.access_token;
            createPicker(authResponse);
        }
    );
    });
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
                //setParent('15N3BQtVX5ASf-N7JAM7DXAyb5B3ppQly').
                setSelectFolderEnabled(true)
                    ).
            setOAuthToken(access_token).
            setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
            picker.setVisible(true);
             /*var view = new google.picker.DocsView(google.picker.ViewId.DOCS);
             view.setMode(google.picker.DocsViewMode.LIST);
              //view.setMimeTypes("image/png,image/jpeg,image/jpg");    
              var picker = new google.picker.PickerBuilder()
              //.enableFeature(google.picker.Feature.NAV_HIDDEN)
              //.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
              
              .setOAuthToken(access_token) //Optional: The auth token used in the current Drive API session.
              .addView(view)
              .addView(new google.picker.DocsUploadView())
              .setCallback(pickerCallback)
              .build();
            picker.setVisible(true);*/
        });
    }
}

async function pickerCallback(_data) {
    console.log(_data);
    if(_data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        getBook(_data[google.picker.Response.DOCUMENTS][0]);
    }
        /*var file = data[google.picker.Response.DOCUMENTS];
        console.log(file);
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        url = doc[google.picker.Document.URL];
        title = doc.name;
        id = doc.id;
        type = doc.type;
        embed = doc[google.picker.Document.EMBEDDABLE_URL ];
      }*/

   /* if (_data[google.picker.Response.DOCUMENTS]) {
        console.log("u have selected this file");
        const xhrArray = _data[google.picker.Response.DOCUMENTS].map(async doc => {

            try {
                const result = JSON.stringify(await postData(``, {token: access_token, doc: doc}));
                console.log(result);
                const resultFinal = JSON.parse(result);
                console.log(`Ответ от сервера: ${result}`);

            } catch (err) {
                console.log(`Ошибка от fetch: ${err.message}`)
            }
        });
        await Promise.all(xhrArray);
    }*/
}



async function getBook(data){
    console.log(data)
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.googleapis.com/drive/v3/files/"+data.id+'?alt=media', true);
    xhr.setRequestHeader('Authorization','Bearer '+ access_token);
    xhr.onload = function(){
        text = document.getElementById('book');
        text.innerHTML = xhr.responseText;
        text.classList.remove('invisible');
        console.log(xhr.responseText);

    }
    xhr.send();

    console.log(data)
    console.log('fine wow');
    
}


// await fetch("https://docs.google.com/picker?protocol=gadgets&origin=http%3A%2F%2Flocalhost%3A3000&multiselectEnabled=true&oauth_token=ya29.A0AfH6SMAnaIq2sm_RE5iwf5YbXzUImejGK_VIA2A_a8dca1I1asV6H6EY75jgHwBZ2LSWhrZGU0LIK39FsB7VL0lny6datBWpaPajSNZi4mcwvqrxm9Z52e8rr7kvWCCid0Yy-Vc8acCMzcHvhRx00tHB6slHHQ&developerKey=AIzaSyB7ae05ZDWxcvkjzZFPpgjmoRFQ_C89ZQg&hostId=localhost&parent=http%3A%2F%2Flocalhost%3A3000%2Ffavicon.ico&nav=((%22all%22%2Cnull%2C%7B%22includeFolders%22%3Atrue%2C%22selectFolder%22%3Atrue%7D))&rpcService=5xd6n8mbgcm9&rpctoken=xr1tobfhm75k&thirdParty=true#rpctoken=xr1tobfhm75k", {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0",
//         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
//         "Accept-Language": "en-US,en;q=0.5",
//         "Upgrade-Insecure-Requests": "1"
//     },
//     "referrer": "http://localhost:3000/",
//     "method": "GET",
//     "mode": "cors"
// });

// 2 страницы
// для авторизованных пользователей

//https://docs.google.com/picker/pvr?hl=en_US&oauth_token=ya29.A0AfH6SMA0_3KwrlqzJ1q8m4ajMxZimsJpxB2eOcLaO3DwleU8eEvEMHcy5vqiIWju8QesKgWWaHPPmAcaMzT7H6ScpRcQ2d57gvonhrJdbqahw1KesZqGUcvBj8x3YC7I6g2HRcl-SbFoWbGJZpljaHo-D56A4A&hostId=localhost&xtoken=AL7Jy1w7vg98qW2F5SSH7lq3s0D71CPTwQ:1614120487533