const DEFAULT_THUMBNAIL_NAMES = {
	"art":"ArtDefault_Thumbnail_320x180",
	"bookbinding":"BookbindingDefault_Thumbnail_320x180",
	"craft":"CraftsDefault_Thumbnail_320x180",
	"code":"CodeDefault_Thumbnail_320x180",
	"design":"DesignDefault_Thumbnail_320x180",
	"game":"GamesDefault_Thumbnail_320x180",
	"default":"Default_Thumbnail_320x180"
};
const THUMBNAIL_EXTENTION = ".png";
const THUMBNAIL_FOLDER_PATH = "assets/images/thumbnails/"

function get_thumbnail(name) {
	name = DEFAULT_THUMBNAIL_NAMES[name];
	if(name === undefined){
		name = DEFAULT_THUMBNAIL_NAMES["default"];
	}
	
	return THUMBNAIL_FOLDER_PATH + name + THUMBNAIL_EXTENTION;
}

function generate_page(params, html){
	//TITLE
	var title = params.get("id");
	if(title.length > 0){
		title = title[0].toUpperCase() + title.slice(1);
	}
	document.title = title;
	document.getElementById("page-title").innerHTML = title;
	
	//Bookmark Icon
	if(params.has("bicon")){
		var thumbnail = get_thumbnail(params.get("bicon"));
		document.getElementById("bookmark-icon").src = thumbnail;
	}
	
	//Content
	document.getElementById("content").innerHTML = html;
}

async function fetch_article() {
	//NOTE SURVER SIDE CROSS NEEDS TO BE SET UP TO TEST
	const PATH = "http://10.10.10.100/data/articles/";
	const EXTENTION = ".article";
	const params = new URLSearchParams(window.location.search);
	
	if(!params.has("id")){
		return;
	}
	
	const name = params.get("id");
	var url = PATH + name + EXTENTION;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const article_data = await response.text();
		
		generate_page(params, article_data);
		
	} catch (error) {
		console.error(error.message);
	}
}

window.addEventListener('load',fetch_article);