const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");




const downloadBtn = document.getElementById("download-btn");
const uploadFile = document.getElementById("upload-file");
const revertBtn = document.getElementById("revert-btn");



/*-----------------------------------Add Effects--------------------------------*/
var dictionary = {"xpro2-add":"contrast(1.3) brightness(0.8) sepia(0.3) saturate(1.5) hue-rotate(-20deg)",
					"toaster-add":"sepia(0.4) saturate(2.5) hue-rotate(-30deg) contrast(0.67)",
					"sutro-add":"brightness(0.75) contrast(1.3) sepia(0.5) hue-rotate(-25deg)",
					"mayfair-add":"saturate(1.4) contrast(1.1)",
					"kelvin-add":"sepia(0.4) saturate(2.4) brightness(1.3) contrast(1)",
					'inkwell-add':"grayscale(1) brightness(1.2) contrast(1.05)",
					"brannan-add":'sepia(0.5) contrast(1.4)',
					"amaro-add":" hue-rotate(-10deg) contrast(0.9) brightness(1.1) saturate(1.5)",
					"none":"none"} 
	// dictionary contain proprty : class of the  button , value : css effects add on canvas 

function add_effects(filterclass){
	const file = uploadFile.files[0];
	const reader = new FileReader();
	if (file){
		fileName = file.name;
		reader.readAsDataURL(file);
	}
	//Add image to a canvas
	reader.addEventListener("load",() =>{
		img = new Image();
		img.src = reader.result;
		img.addEventListener("load" , () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.filter = dictionary[filterclass];
			ctx.drawImage(img,0,0,img.width,img.height);
			add_filter_value();
		});
	},false);
};

const finding_value = (value,index) =>{
	var a='';
	var i=index;
	while (1){
		if (value[i]!==")"){
			a+=value[i]
			i+=1			
		}else{
			break
		}
	}
	return a;
}

var fil = document.querySelectorAll(".filter-btn")

fil.forEach(function(item){
	item.addEventListener("click",(event) => {
	add_effects(event.target.classList[1]);	
	});
});
revertBtn.addEventListener("click",(e) => {
	add_effects("none");		
	});

const filtersOption = {
	bright:[document.getElementById("brightness"),"brightness",11],
	contrast:[document.getElementById("contrast"),"contrast",9],
	saturation:[document.getElementById("saturation"),"saturate",9],
	grayscale:[document.getElementById("grayscale"),"grayscale",10]
};

const add_filter_value = () => {
	for (x in filtersOption){
		var a = ctx.filter;
		var index = a.search(filtersOption[x][1])
		if (index!==-1){
			index = index+filtersOption[x][2]
			var val = finding_value(a,index);
			filtersOption[x][0].value=String(parseFloat(val)*100);	
		}else{
			if(x!=="grayscale"){
				filtersOption[x][0].value="100";	
			}else{
				filtersOption[x][0].value="0";
			}	
		}	
	}
}
const repeat_func = (a) => {
	const file = uploadFile.files[0];
		const reader = new FileReader();
		if (file){
			fileName = file.name;
			reader.readAsDataURL(file);
		}
		//Add image to a canvas
		reader.addEventListener("load",() =>{
			img = new Image();
			img.src = reader.result;
			img.addEventListener("load" , () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.filter = a;
				ctx.drawImage(img,0,0,img.width,img.height);		
			});
		},false);
}

const on_filter_change = (item) => {
	var a = ctx.filter;
	var index = a.search(filtersOption[item][1]);
	if (a==="none"){
		a="";
	}
	if (index!==-1){
		var s = filtersOption[item][1]+"("+String(finding_value(a,index+filtersOption[item][2]))+")"; 
		var val = filtersOption[item][0].value;
		val = val/100;
		a = a.replace(s,filtersOption[item][1]+"("+String(val)+")");
		repeat_func(a);
	}else{
		var val = filtersOption[item][0].value;
		val = val/100;
		a+=(" "+(filtersOption[item][1]+"("+String(val)+")"));
		repeat_func(a);
	}
}

Object.keys(filtersOption).forEach(function(item){
	filtersOption[item][0].addEventListener("change",(event) => {
	on_filter_change(item);		
	});
});
/*-----------------------------Upload File--------------------------------*/
uploadFile.addEventListener("change", (event) => {
	const file = uploadFile.files[0];
	const reader = new FileReader();
	
	if (file){
		fileName = file.name;
		reader.readAsDataURL(file);
	}
	//Add image to a canvas
	reader.addEventListener("load",() =>{
		img = new Image();
		img.src = reader.result;
		img.addEventListener("load" , () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img,0,0,img.width,img.height);
		});
	},false);
});

/*------------------------------- Download Event-------------------------------*/

downloadBtn.addEventListener("click", () => {
  	// Get ext
	const fileExtension = fileName.slice(-4);

	// Init new filename
	let newFilename;

	  // Check image type
	if (fileExtension === ".jpg" || fileExtension === ".png") {
	    // new filename
		newFilename = fileName.substring(0, fileName.length - 4) + "-edited.jpg";
	}

	// Call download
	download(canvas, newFilename);
});

// Download
function download(canvas, filename) {
	// Init event
	let e;
	// Create link
	const link = document.createElement("a");

	// Set props
	link.download = filename;
	  
	// imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	link.href = canvas.toDataURL("image/jpeg", 0.8);
	console.log(canvas,link.href)
	// New mouse event
	e = new MouseEvent("click");
	// Dispatch event
	link.dispatchEvent(e);
}

