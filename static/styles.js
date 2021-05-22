
function save_custom() {
    theme = document.getElementById("example").classList[0];
    if (theme != undefined){
        document.cookie = 'theme=' + theme;
        update_settings('theme', theme);
    }
    text = document.getElementById('text').style;
    for (var i = 0; i < text.length; i++) {
        document.cookie = text[i] + '=' + text[text[i]];
        console.log(text[i] + ' ' + text[text[i]])
        update_settings(text[i], text[text[i]])
    }
    set_settings();
}

function set_settings() {

    set = document.getElementsByClassName('book-field')[0];
    text = document.getElementById('text');
    if(getCookie('line-height')){
        text.style.lineHeight = getCookie('line-height');
        set.style.lineHeight = getCookie('line-height');
    }
    if(getCookie('font-size') ){
        set.style.fontSize = getCookie('font-size');
        text.style.fontSize = getCookie('font-size');
    }
    if(getCookie('font-family')){
        
        set.style.fontFamily = getCookie('font-family');
        text.style.fontFamily = getCookie('font-family');
    }
    if(getCookie('theme')){
        set = document.getElementById('main');
        set.classList.remove('selector_default_theme');
        set.classList.remove('selector_dark_theme');
        set.classList.remove('selector_beige_theme');
        set.classList.add(getCookie('theme'));
        example = document.getElementById('example');
        example.classList.remove('selector_default_theme');
        example.classList.remove('selector_dark_theme');
        example.classList.remove('selector_beige_theme');
        example.classList.add(getCookie('theme'));
    }
}





function get_total_pages(){
    var w = window.innerWidth;
    cur_page = document.getElementsByClassName('book-field')[0];
    total_pages = document.getElementById('total_pages');
    total_pages.innerHTML = Math.ceil(cur_page.scrollWidth / w);
}


function next_page() {
    var w = window.innerWidth;
    cur_page = document.getElementById('mainmenu');
    get_total_pages();
    change_num = document.getElementById('cur_page');
    if(Number(change_num.innerHTML) < Number(document.getElementById('total_pages').innerHTML)) {
        cur_right = cur_page.style.right.replace('px',''); 
        res = Number(cur_right) + (w);
        cur_page.style.right = res+ 'px'; 
        change_num.innerHTML = Number(change_num.innerHTML) + 1;
        procent_of_read = (change_num.innerHTML-1)/document.getElementById('total_pages').innerHTML;
        document.cookie = cur_page.id +'='+Math.floor(procent_of_read * 10000);
        update_settings(cur_page.id, Math.floor(procent_of_read * 10000))
    }
    showReadLine();
}


function prev_page() {
    var w = window.innerWidth;
    cur_page = document.getElementsByClassName('book-field')[0];
    if(cur_page.style.right !== '' && cur_page.style.right !== '0px'){
        cur_right = cur_page.style.right.replace('px',''); 
        res = Number(cur_right) - (w);
        cur_page.style.right = res + 'px';
        get_total_pages();
        change_num = document.getElementById('cur_page');
        change_num.innerHTML -= 1;
        if (change_num.innerHTML == 1) {
            document.cookie = cur_page.id +'=0'
        update_settings(cur_page.id, 0)
        }
        else {
            procent_of_read = (change_num.innerHTML -1)/document.getElementById('total_pages').innerHTML;
            document.cookie = cur_page.id +'='+Math.floor(procent_of_read * 10000);
            update_settings(cur_page.id, Math.floor(procent_of_read * 10000))
        }
    }
    showReadLine();
}


function get_cur_page(){
    var cur_page = document.getElementsByClassName('book-field')[0];
    procent_of_read = getCookie(cur_page.id);
    res = Math.round(procent_of_read / 10000 * Math.ceil(cur_page.scrollWidth / window.innerWidth))
    change_num = document.getElementById('cur_page');
    change_num.innerHTML = res + 1;
    res *= window.innerWidth;
    cur_page.style.right = res+ 'px';    
    showReadLine();
} 


function showReadLine() {
    sort_menu = document.getElementById("sort_menu");
    sort_menu.classList.add('invisible');
    read_line = document.getElementById("read_line");
    read_line.classList.remove('invisible');
    procent_of_read = getCookie(cur_page.id);
    change_num = document.getElementById('cur_page');
    read_line.style.width = Number(change_num.innerHTML-1) / (document.getElementById('total_pages').innerHTML-1) * 100  + "%";
}


function show_mode1(){
    deleteCookie('show_mode')
    var book = document.getElementsByClassName("book-wrapper");
    for (var i = 0; i < book.length; i++) {
        book[i].classList.remove('list');
    }
    var imgs = document.getElementsByClassName("img-wrapper");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].classList.remove('list-img-wrapper');
    }
}


function show_mode2(){
    document.cookie = 'show_mode=1'
    update_settings("show_mode", 1)
    var book = document.getElementsByClassName("book-wrapper");
    for (var i = 0; i < book.length; i++) {
        book[i].classList.add('list');
    }
    var imgs = document.getElementsByClassName("img-wrapper");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].classList.add('list-img-wrapper');
    }
}


//-------------------- списки ------------------




window.onload = function() {
  let lists = document.getElementsByClassName('show_drop_down');
  for(let i = 0; i < lists.length; i++) {
    lists[i].addEventListener('click', function() {
        this.classList.toggle('active-drop-down');
        if(this.classList.contains('active-drop-down')) {
            var element = this.nextElementSibling;
            var count = 1;
            while(element) {
                element.style.display = 'block';
                element.value = count;
                element.addEventListener('click', function (count) {
                    hide_drop_down(i);
                    if(i == 0) theme_selector(i, this.value); // nomer spiska
                    if(i == 1) line_height_change(i, this.value);
                    if(i == 2) font_size_change(i, this.value);
                    if(i == 3) font_family_change(i, this.value);
                    if(i == 4) sort_book_list(this.value);
                    if(i == 5) book_version_handler(i, this.value);
                    

                });
                element = element.nextElementSibling;
                count +=1;
            }
        }
        else {
            var element = this.nextElementSibling;
            while(element) {
                element.style.display = 'none';
                element = element.nextElementSibling;
            }
        }
    } );
  }
}

function hide_drop_down(list_id) {
    let lists = document.getElementsByClassName('show_drop_down')[list_id];
    lists.classList.toggle('active-drop-down');
    var element = lists.nextElementSibling;
    while(element) {
        element.style.display = 'none';
        element = element.nextElementSibling;
    }
}

function theme_selector(list_id, picked_id) {
    let example = document.getElementById('example');
    let lists = document.getElementsByClassName('drop-down')[list_id];
    if(picked_id == 1) {
        example.classList.add('selector_default_theme');
        example.classList.remove('selector_dark_theme');
        example.classList.remove('selector_beige_theme');
    }
    if(picked_id == 2) {
        example.classList.add()
        example.classList.remove('selector_default_theme');
        example.classList.add('selector_dark_theme');
        example.classList.remove('selector_beige_theme');
    }
    if(picked_id == 3) {
        example.classList.add()
        example.classList.remove('selector_default_theme');
        example.classList.remove('selector_dark_theme');
        example.classList.add('selector_beige_theme');
    }
}

function line_height_change(list_id, picked_id) {
    var text = document.getElementById('text');
    var picked_child = document.getElementsByClassName('drop-down')[list_id].children[picked_id];
    res = picked_child.innerHTML;
    text.style.lineHeight = res;
}

function font_size_change(list_id, picked_id){
    var text = document.getElementById('text');
    //console.log(document.getElementsByClassName('drop-down')[list_id]);
    var picked_child = document.getElementsByClassName('drop-down')[list_id].children[picked_id];
    res = picked_child.innerHTML;
    text.style.fontSize = res + 'px';
}

function font_family_change(list_id, picked_id) {
    var text = document.getElementById('text');
    var picked_child = document.getElementsByClassName('drop-down')[list_id].children[picked_id];
    res = picked_child.style.fontFamily;
    text.style.fontFamily = res;
}



function sort_book_list(list_value) {
    if(list_value == 1){ // по автору 
        books_list.sort(by_field('author'));
        
    }
    if(list_value == 2){  // по названию
        books_list.sort(by_field('title'));
    }
    if(list_value == 3){  // по дате добавления
         books_list.sort(by_field('time'));
    }
    show_changed_libary();
}

function by_field(field) {
  return (a, b) => a[field] > b[field] ? 1 : -1;
}

function show_changed_libary(){
    var book_wrappers = document.getElementsByClassName('book-wrapper'); 
    var libary = document.getElementById('libary');
    for(var i = 0; i < books_list.length; i++) {
        var str = book_wrappers[i].children[1].innerHTML.trim();
        if(str != books_list[i].author) {
            for (var j = 0; j < books_list.length; j++) {
                var str1 = book_wrappers[j].children[1].innerHTML.trim();
                if(str1 === String(books_list[i].author)){
                    swap_nodes(book_wrappers[i], book_wrappers[j])
                }
            }
        }
    }

}
function swap_nodes(node1, node2) {
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;
    node1.replaceWith(node2);
    parent.insertBefore(node1, afterNode2);
}


async function show_libary() { // отобразить библиотеку книг
    var id_folder = getCookie('folder_id');
    var sort_menu = document.getElementById('sort_menu');
    var show_book = document.getElementsByClassName('show_book')[0];
    show_book.classList.add('invisible');
    sort_menu.classList.remove('invisible');
    line = document.getElementById('read_line');
    line.classList.add('invisible');
    if (id_folder === 'no_folder') { //путь до папки записан в куки

        folderNotFound();
    }
    else {
        service.getFilesFromFolder();

    }

}

function active_cursor() {

    var elem = document.getElementsByClassName('book-field')[0];
    var cur_book = elem.id;
    var selector = document.getElementById('anoter_book_version');
    var children = selector.children.length;
    var list_children = selector.children;

    var node = document.getElementById('changer_dropdown');
    if (list_children[0].getAttribute("value") != cur_book) {
        for(var i = children - 1; i > 0; i--) {
            list_children[i].remove();
        }
        children = 1;
    }
    if (children === 1) {
        for(var i = 0; i < books_list.length; i++) {
            if(!books_list[i].get(cur_book)) {
                var li = document.createElement('li');
                li.innerHTML = books_list[i].title + " / " + books_list[i].author;
                li.classList = books_list[i].id;
                selector.append(li);
            }
        } 
    }
     
    list_children[0].setAttribute("value", cur_book);
}


function book_version_handler (id, value) {
    var drop_down = document.getElementsByClassName('drop-down')[id];
    var elem = document.getElementsByClassName('book-field')[0];
    var show_block = document.getElementById('book_info');
    var cur_book = elem.id;
    document.cookie = 'another_version_of:' + cur_book + '=' + drop_down.children[value].classList[0];
    show_block.classList.toggle("invisible");
    show_book_info();
}

function translate_book() {
    var translate = document.getElementById('translate_page');
    translate.classList.toggle('active');
    var book = document.getElementsByClassName('book-field')[0];
    if (translate.classList.contains('active')) {
        book.addEventListener('click', handle_click);
    }
    else {
        book.removeEventListener('click', handle_click);
    }
}


function handle_click() {
    var current_book = getCookie('cur_book');
    let target = event.target;
    var tmp = target.parentNode;
    while(tmp.tagName != 'SECTION') 
        tmp = tmp.parentNode
    console.log(books_list[get_book_by_id(current_book)].content);

    console.log(tmp )
    console.log(tmp.children[0].id)
}