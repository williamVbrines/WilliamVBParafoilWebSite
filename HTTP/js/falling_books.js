const BOOK_PATH = "assets/images/books";
const BOOK_EXTENSION = ".png";
const BOOK_IMAGES_MAX = 9;//The amount of images in BOOK_PATH. Used to geneerate a path to said image.

//[[page tilte, page link], [page tilte, page link], [page tilte, page link] ]
var page_data_list = [
["Home", "#"]//#TO-DO Remove Place holder
];

var page_data_list_selection = [];
var last_page_data_list_selection = 0;

const BOOKS_MAX = 10;//The Maximum amout of books possible on screen

const MAX_FALL_SPEED = 100;
const MIN_FALL_SPEED = 100;
const MAX_ROT_SPEED = 30;
const MIN_ROT_SPEED = -30;
const BOTTOM_OFFSET = 200;

//[[element,index,time_start], [element,index,time_start], [element,index,time_start]] 
//indexes into page_data_list
var falling_books = [];

function get_random_int(max, min=0){
  return Math.floor(Math.random() * (max - min)) + min;
}

//Semi-Randomly picks a page_data index from page_data_list.
//The index will not be the prior index.
//The index will not appear untill at least untill all other indexes have been seen once.
function get_semi_random_index(){
	var index = getRandomInt(page_data_list_selection.length-1);
	var selection = page_data_list_selection.at(index);
	
	if(selection == last_page_data_list_selection) {//Only happen when the page_data_list_selection was previously populated
		selection = page_data_list_selection.indexOf(selection) - 1;
	}
	
	if(page_data_list_selection.length == 1){
		selection = page_data_list_selection.pop();
		populate_page_data_list_selection();
	}else{
		page_data_list_selection.splice(index,1);
	}
	
	last_page_data_list_selection = selection;
	return selection;
}

function populate_page_data_list_selection () {
	page_data_list_selection = [];
	for(var index = 0; index < page_data_list.length; index++){
		page_data_list_selection.push(index);
	}
}

function init_books (book_container, book_class, has_event) {
	for (var index = 0; index < BOOKS_MAX; index++) {
		const new_book = document.createElement("img");
		init_book(new_book, book_class);
		new_book.id = "book_index_" + index;
		
		if(has_event == true){
			new_book.addEventListener("mouseover", book_mouseover);
			new_book.addEventListener("mouseout", book_mouseout);
			new_book.addEventListener("click", book_click);
		}
		
		book_container.appendChild(new_book);
	}
}

//Generates a path to a image of a book
function generate_random_image_path() {
  return BOOK_PATH + "/Book" + get_random_int(BOOK_IMAGES_MAX) + BOOK_EXTENSION;
}

function get_random_page_index() {
	return get_random_int(page_data_list.length);
}


function init_book(book, book_class){
    book.classList.add(book_class);
	book.style.opacity = 1;
	book.style.animationTimingFunction = 'linear';
	
	falling_books.push([book,undefined,undefined,undefined,undefined,undefined,undefined]);//The page data index is set to NaN for it will get set in randomize_book
	randomize_book(falling_books.length-1);//Push will always push to the back of the array
	start_anim(falling_books.length-1);
}

function reset_book(index){
	var book = falling_books[index][0];
	book.style.opacity = 1;
}


//Called at the end of the animation cicle to make the illussion that there are different books falling
function randomize_book(index){
	var book = falling_books[index][0];
	
	//Randomize Image
	book.src = generate_random_image_path();
	//Randomize Horizontal Pos
	book.style.left = (Math.random() * (window.innerWidth - 50)) + "px";
	//Randomize link to page data
	falling_books[index][1] = get_semi_random_index();
	
	
	falling_books[index][3] = -200 - Math.random()*1000;//Y
	falling_books[index][4] = Math.random() * 360;//Rotation 
	falling_books[index][5] = Math.random() * (MAX_FALL_SPEED - MIN_FALL_SPEED) + MIN_FALL_SPEED;//SpeedY
	falling_books[index][6] = Math.random() * (MAX_ROT_SPEED - MIN_ROT_SPEED) + MIN_ROT_SPEED;//RotSpeed
	
}

//The animatin shuild resembel a falling object slowly rotating from the top of the sceen to the bottom.
function start_anim(index) {
	//Animations/////////////////////////////////////////////////
	function anim_fall_down(timestamp) {
		if (falling_books[index][2] === undefined){ //First Frame
			falling_books[index][2] = timestamp;
		}
		
		const delta_time = timestamp - falling_books[index][2];
		falling_books[index][2] = timestamp;
		
		//Update Rotation
		falling_books[index][4] += (falling_books[index][6] * delta_time) / 1000;
		
		//Update Y
		falling_books[index][3] += (falling_books[index][5] * delta_time) / 1000;

		if (falling_books[index][3] - BOTTOM_OFFSET > window.innerHeight) {//Last Frame Reset
			reset_book(index);
			randomize_book(index);
			anim_fall_down(timestamp);
		}
		
		// Update the transform 
		falling_books[index][0].style.transform = "translateY("+falling_books[index][3]+"px) rotate("+falling_books[index][4]+"deg)";

		requestAnimationFrame(anim_fall_down);// Continue the animation
	}

  requestAnimationFrame(anim_fall_down);//Start anim
}

//BOCK EVENTS
function book_click(event) {
	var shearch = function (element) { return element[0] == event.srcElement }//Find element clicked in falling_books 
	
	var page_index = falling_books.find(shearch)[1];
	
	if(page_index == -1){
		return;
	}
	
	//Index into page_data_list index 1 is the URL
	var url = page_data_list[page_index][1]
	
    //Move location 
	window.location.href = url;
}

function book_mouseover(event) {
	var shearch = function (element) { return element[0] == event.srcElement }
	
	var hover_text_element = document.getElementById("hover-text_container");
	
	var x = event.clientX;
	var y = event.clientY;
	
	
	var page_index = falling_books.find(shearch)[1];
	
	if(page_index == -1){
		return;
	}
	
	var title = page_data_list[page_index][0];
	
	hover_text_element.style.left = x + "px";
	hover_text_element.style.top = y + "px";
	hover_text_element.style.display = "block";
	hover_text_element.innerHTML = title;
}

function book_mouseout(event) {
	var hover_text_element = document.getElementById("hover-text_container");
	
	hover_text_element.style.display = "none";
}

function process_raw_page_data(raw) {
	var lines = raw.split("\n");
	
	var delimiter = lines[0];
	
	lines.splice(0,1);
	
	var out = [];//An array of D2 arrays [0] title [1] relitive url
	
	for(var index = lines.length-1; index >= 0; index--){
		//REMOVE COMMENTS and empty lines
		if(lines[index].startsWith("//") == true || lines[index] == "" || lines[index] == " "){
			if(lines.length == 0){
				lines = [];
			}
			else{
				lines.splice(index,1);
			}
			
		}else{
			out.push( lines[index].split("*") );
		}
		
	}
	
	return out;
	
}

async function fetch_page_data_list() {
	//NOTE SURVER SIDE CROSS NEEDS TO BE SET UP TO TEST
	const url = "http://10.10.10.100/data/page-data-list.txt";//TODO REMOVE AFTER TESTING OR RELEACE
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const raw_text_data = await response.text();
		
		
		page_data_list = process_raw_page_data(raw_text_data);
		
		
		ready();
		
		
	} catch (error) {
		console.error(error.message);
	}
}

window.addEventListener('load', function() {
	fetch_page_data_list();
	
});

function ready() { //Done loading and fetching resources 
	
	populate_page_data_list_selection();
	
	console.log(page_data_list);
	init_books(document.getElementById("falling_books_container_focus"), "falling-book", true);
	init_books(document.getElementById("falling_books_container_far"), "falling-book-far", false);
}
