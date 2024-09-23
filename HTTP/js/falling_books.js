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

function init_books (book_container) {
	for (var index = 0; index < BOOKS_MAX; index++) {
		const new_book = document.createElement("img");
		init_book(new_book);
		
		book_container.appendChild(new_book);
	}
}

//Generates a path to a image of a book
function generate_random_image_path() {
  return BOOK_PATH + "/Book" + get_random_int(BOOK_IMAGES_MAX) + BOOK_EXTENSION;
}

function get_random_page_index() {
	get_random_int(PAGE_DATA.length);
}

//Infocus Books//////////////////////////////
function init_book(book){
    book.classList.add('falling-book');
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

//Animation Logic
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


function book_click() {
	//Find element clicked in falling_books 
	//Index into PAGE_DATA index 1 is the URL

    //Move location window.location.href = url;
}

function book_hover() {
	//Find element clicked in falling_books 
	//Index into PAGE_DATA index 0 is the display text
}

window.addEventListener('load', function() {
	init_books(document.getElementById("falling_books_container"));
});

