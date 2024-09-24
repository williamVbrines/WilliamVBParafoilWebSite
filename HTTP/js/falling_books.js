const BOOK_PATH = "assets/images/books";
const BOOK_EXTENSION = ".png";
const BOOK_IMAGES_MAX = 9;//The amount of images in BOOK_PATH. Used to geneerate a path to said image.

//[[page tilte, page link], [page tilte, page link], [page tilte, page link] ]
const PAGE_DATA = [
["Home", "#"]//#TO-DO Remove Place holder
];

const BOOKS_MAX = 10;//The Maximum amout of books possible on screen

const MAX_FALL_SPEED = 100;
const MIN_FALL_SPEED = 100;
const MAX_ROT_SPEED = 30;
const MIN_ROT_SPEED = -30;
const BOTTOM_OFFSET = 200;

//[[element,index,time_start], [element,index,time_start], [element,index,time_start]] 
//indexes into PAGE_DATA
var falling_books = [];

function get_random_int(max){
  return Math.floor(Math.random() * max);
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
	return get_random_int(PAGE_DATA.length);
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
	falling_books[index][1] = get_random_page_index();
	
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
	
	//Index into PAGE_DATA index 1 is the URL
	var url = PAGE_DATA[falling_books.find(shearch)[1]][1]
	
    //Move location 
	window.location.href = url;
}

function book_mouseover(event) {
	var shearch = function (element) { return element[0] == event.srcElement }
	
	var hover_text_element = document.getElementById("hover-text_container");
	
	var x = event.clientX;
	var y = event.clientY;
	
	var title = PAGE_DATA[falling_books.find(shearch)[1]][0];
	
	hover_text_element.style.left = x + "px";
	hover_text_element.style.top = y + "px";
	hover_text_element.style.display = "block";
	hover_text_element.innerHTML = title;
}

function book_mouseout(event) {
	var hover_text_element = document.getElementById("hover-text_container");
	
	hover_text_element.style.display = "none";
}

window.addEventListener('load', function() {
	init_books(document.getElementById("falling_books_container_focus"), "falling-book", true);
});

