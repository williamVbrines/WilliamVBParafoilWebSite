var quotes_list = [
	"placeholder"
	];
	
var selection_tabel = [];//What quotes can be selected from the quote list
var last_selection = NaN;//Used to prevent repeat quotes

function populate_selection_tabel () {
	selection_tabel = [];
	for(var index = 0; index < quotes_list.length; index++){
		selection_tabel.push(index);
	}
}
	
function getRandomInt(max){
  return Math.floor(Math.random() * max);
}

//Semi-Randomly picks a quote from quotes_list.
//The quote will not be the prior quote.
//The quote will not appear untill at least untill all other quotes have been seen once.
function get_semi_random_quote(){
	var index = getRandomInt(selection_tabel.length-1);
	var selection = selection_tabel.at(index);
	
	if(selection == last_selection) {//Only happen when the selection_tabel was previously populated
		selection = selection_tabel.indexOf(selection) - 1;
	}
	
	if(selection_tabel.length == 1){
		selection = selection_tabel.pop();
		populate_selection_tabel();
	}else{
		selection_tabel.splice(index,1);
	}
	
	console.log("selection: " + selection);
	
	console.log(selection_tabel);
	
	last_selection = selection;
	return quotes_list.at(selection);
}

function update_question_mark_text (event=undefined) {
	var text_element = document.getElementById("question-mark-text");
	text_element.innerHTML = get_semi_random_quote();
}

async function fetch_quotes_list_data() {
	//NOTE SURVER SIDE CROSS NEEDS TO BE SET UP TO TEST
	const url = "http://10.10.10.100/data/quotes-list.txt";//TODO REMOVE AFTER TESTING OR RELEACE
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const full_text = await response.text();
		quotes_list = full_text.split("\n");
		
		if(quotes_list.at(quotes_list.length-1) == ""){
			quotes_list.pop();
		}
		
		update_question_mark_text();
		
	} catch (error) {
		console.error(error.message);
	}
}

document.addEventListener('DOMContentLoaded', () => {
    fetch_quotes_list_data();
	
});

populate_selection_tabel();