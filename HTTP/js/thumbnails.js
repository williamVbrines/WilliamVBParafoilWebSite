const DEFAULT_THUMBNAIL_NAMES = {
	"art":"ArtDefault_Thumbnail_320x180",
	"bookbinding":"BookbindingDefault_Thumbnail_320x180",
	"craft":"CraftsDefault_Thumbnail_320x180",
	"code":"CodeDefault_Thumbnail_320x180",
	"design":"DesignDefault_Thumbnail_320x180",
	"game":"GamesDefault_Thumbnail_320x180",
	"default":"Default_Thumbnail_320x180"
};
const EXTENTION = ".png";
const THUMBNAIL_FOLDER_PATH = "assets/images/thumbnails/"

var table_of_contents = {};

//Sort Thumbnails newest. And put them into their correct conatiner based on their tag.

function create_thumbnail(thumbnail_unique_key, thumbnail_data, thumbnail_parent) {
	const thumbnail = document.createElement("img");
	
	thumbnail.classList.add("thumbnail");
	
	thumbnail.src = THUMBNAIL_FOLDER_PATH + thumbnail_data["thumbnail"] + EXTENTION
	thumbnail.id = thumbnail_parent.id + "_" + thumbnail_unique_key;
	
	thumbnail.alt = "thubnail for " + thumbnail_data["title"];
	
	thumbnail.addEventListener("error", thumbnail_on_error);
	thumbnail.addEventListener("click", thumbnail_on_clicked);
	
	thumbnail_parent.appendChild(thumbnail);
}

function thumbnail_on_clicked(event) {
	var key = event.target.id;
	var index = key.lastIndexOf("_");
	var url = "#"
	if(index != -1){
		key = key.substr(index+1);
	}
	
	var data = table_of_contents[key];
	
	if(data != undefined){
		url = data["url"];
	}
	
	console.log(url);
	
	window.location.href = url;
}

function thumbnail_on_error (event) {
	var key = event.target.id;
	var index = key.lastIndexOf("_");
	
	if(index != -1){
		key = key.substr(index+1);
	}
	
	var data = table_of_contents[key];
	var default_thumbnail = DEFAULT_THUMBNAIL_NAMES["default"];
	
	for(var key in DEFAULT_THUMBNAIL_NAMES){
		if(data["tags"].includes(key)){
			default_thumbnail = DEFAULT_THUMBNAIL_NAMES[key];
			break;
		}
	}
	
	event.target.src = THUMBNAIL_FOLDER_PATH + default_thumbnail + EXTENTION;
}

//group_element is an element
//tags is an array of included thumbnails in the section.
//max is a int of the maximum nuber of thubnails in the group
function populate_thumbnail_group(group_element, tags, max){
	group_element.innerHTML = "";
	
	var selection = [];
	
	//Narrow selection baseed off of tags
	for(var key in table_of_contents){
		var data = table_of_contents[key];
		console.log(data["tags"]);
		
		for(var tag_index in tags){
			if(data["tags"].includes(tags[tag_index])){
				selection.push([key,data]);
				break;
			}
		}
	}
	
	//Sort selection based off of date
	selection.sort(function(a, b){return b[1]["date"]-a[1]["date"]})
	
	console.log(selection);
	
	
	for(var index = 0; index < Math.min(max, selection.length); index++){
		create_thumbnail(selection[index][0], selection[index][1], group_element); 
	}
	
}

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
	//TODO REMOVE example from tags list bellow 
	populate_thumbnail_group(document.getElementById("games-and-code-thumbnail-container"), ["code","games","example"], 3);
	populate_thumbnail_group(document.getElementById("art-and-design-thumbnail-container"), ["art","design"], 3);
	populate_thumbnail_group(document.getElementById("bookbinding-and-crafts-thumbnail-container"), ["bookbinding","craft"], 3);
}

window.addEventListener('load',fetch_table_of_contents());