
var table_of_contents = {};

//Sort Thumbnails newest. And put them into their correct conatiner based on their tag.


//Get the tabel-of-contents and parse it to a JSON
async function fetch_table_of_contents() {
	//NOTE SURVER SIDE CROSS NEEDS TO BE SET UP TO TEST
	const url = "http://10.10.10.100/data/table-of-contents.json";//TODO REMOVE AFTER TESTING OR RELEACE
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const raw_json_data = await response.json();
		
		table_of_contents = raw_json_data;
		
		ready();
		
		
	} catch (error) {
		console.error(error.message);
	}
}

function ready() {
	
}

window.addEventListener('load',fetch_table_of_contents());