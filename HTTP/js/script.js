const book_container = document.querySelector('.falling_books_container');

const book_fare_container = document.querySelector('.falling_books_fare_container');

const question_text = document.querySelector('.question-text');
const question_mark = document.querySelector('.question-shadow');


const book_path = "assets/images/books";
const book_extension = ".png";
const num_of_book_images = 12;
const max_number_of_falling_books = 10;
const max_fall_speed = 100;
const min_fall_speed = 100;
const max_rot_speed = 30;
const min_rot_speed = -30;
let list_of_urls = [];
let falling_books = [];

const num_of_quotes = 3;
let list_of_quotes = [
	"Hello", 
	"This web site was made by William VB", 
	"The books are links to projects and portfolio pices",
	"This question mark displays quotes when clicked"
	];

const max_number_of_falling_books_fare = 10;
const max_fall_speed_books_fare = 120;
const min_fall_speed_books_fare = 120;
const max_rot_speed_books_fare = 30;
const min_rot_speed_books_fare = -30;

let falling_books_fare = [];

//Infocus Books//////////////////////////////
function init_book(book){
    book.src = getRandomBookURL();
    book.classList.add('falling-book');
	book.style.opacity = 1;
    
	book.style.left = (Math.random() * (book_container.offsetWidth - 50)) + 'px'; // Adjusted for book width

	book.style.animationTimingFunction = 'linear';
}

function init_books() {
  for (let i = 0; i < max_number_of_falling_books; i++) {
		const book = document.createElement('img');
		init_book(book);
		
		book_container.appendChild(book);
		falling_books.push(book);

		start_anim(book);
  }
}

//Animation Logic
function start_anim(book) {
	let startTime = null;
  
	const speed = Math.random() * (max_fall_speed - min_fall_speed) + min_fall_speed;
	const initialY = -200 - Math.random()*1000;
	const rotationSpeed = Math.random() * (max_rot_speed - min_rot_speed) + min_rot_speed;
	const initialRotation = Math.random() * 360; // Initial rotation angle (0 to 360 degrees)
	const bottom_offset = 200;
	//Animations/////////////////////////////////////////////////
	function anim_fall_down(timestamp) {
		if (!startTime) startTime = timestamp;
		const elapsedTime = timestamp - startTime;
		const rotation = initialRotation + (rotationSpeed * elapsedTime) / 1000;
		
		// Calculate the new top position based on speed and time elapsed
		let y_pos = initialY + (speed * elapsedTime) / 1000;

		if (y_pos - bottom_offset> book_container.offsetHeight) {

			const speed = Math.random() * (max_fall_speed - min_fall_speed) + min_fall_speed;
			const initialRotation = Math.random() * 360; // Initial rotation angle (0 to 360 degrees)
			const initialRotationSpeed = Math.random() * (max_rot_speed - min_rot_speed) + min_rot_speed;
			
			book.style.transform = `translateY(${initialY}px)`;
	
			init_book(book);
			
			startTime = timestamp;
		}

		book.style.transform = `translateY(${y_pos}px) rotate(${rotation}deg)`;// Update the rotation 

		requestAnimationFrame(anim_fall_down);// Continue the animation
	}

  requestAnimationFrame(anim_fall_down);//Start anim
}

//Link Logic

function handleBookClick() {
  if (list_of_urls.length > 0) {
    const randomIndex = Math.floor(Math.random() * list_of_urls.length);
    const url = list_of_urls[randomIndex];
    if (url) {
      window.location.href = url;
    }
  }
}


// Add an event listener for the click event
question_mark.addEventListener('click', function(event) {
	const randomIndex = Math.floor(Math.random() * list_of_quotes.length);
	const randomText = list_of_quotes[randomIndex];
  question_text.innerHTML = randomText;
});
//Fare Books///////////////////////////////////////////
function init_fare_book(book){
    book.src = getRandomBookURL();
    book.classList.add('falling-book_fare');
	book.style.opacity = 1;
    
	book.style.left = (Math.random() * (book_container.offsetWidth - 50)) + 'px'; // Adjusted for book width

	book.style.animationTimingFunction = 'linear';
}

function init_fare_books() {
  for (let i = 0; i < max_number_of_falling_books_fare; i++) {
		const book = document.createElement('img');
		init_fare_book(book);
		
		book_fare_container.appendChild(book);
		falling_books.push(book);

		start_fare_book_anim(book);
  }
}

//Animation Logic
function start_fare_book_anim(book) {
	let startTime = null;
  
	const speed = Math.random() * (max_fall_speed_books_fare - min_fall_speed_books_fare) + min_fall_speed_books_fare;
	const initialY = -200 - Math.random()*1000;
	const rotationSpeed = Math.random() * (max_rot_speed_books_fare - min_rot_speed_books_fare) + min_rot_speed_books_fare;
	const initialRotation = Math.random() * 360; // Initial rotation angle (0 to 360 degrees)
	const bottom_offset = 200;
	
	//Animations/////////////////////////////////////////////////
	function anim_fall_down(timestamp) {
		if (!startTime) startTime = timestamp;
		const elapsedTime = timestamp - startTime;
		const rotation = initialRotation + (rotationSpeed * elapsedTime) / 1000;
		
		// Calculate the new top position based on speed and time elapsed
		let y_pos = initialY + (speed * elapsedTime) / 1000;

		if (y_pos - bottom_offset> book_fare_container.offsetHeight) {

			const speed = Math.random() * (max_fall_speed_books_fare - min_fall_speed_books_fare) + min_fall_speed_books_fare;
			const initialRotation = Math.random() * 360; // Initial rotation angle (0 to 360 degrees)
			const initialRotationSpeed = Math.random() * (max_rot_speed_books_fare - min_rot_speed_books_fare) + min_rot_speed_books_fare;
			
			book.style.transform = `translateY(${initialY}px)`;
	
			init_fare_book(book);
			
			startTime = timestamp;
		}

		book.style.transform = `translateY(${y_pos}px) rotate(${rotation}deg)`;// Update the rotation 

		requestAnimationFrame(anim_fall_down);// Continue the animation
	}

  requestAnimationFrame(anim_fall_down);//Start anim
}

//Link Logic
function getRandomBookURL() {
  return `${book_path}/Book${Math.floor(Math.random() * num_of_book_images) + 1}${book_extension}`;
}


// Initialize the falling books
init_fare_books();
init_books();
