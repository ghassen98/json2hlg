var fileContent;
function generateFile() {
	var geoJSONObject = fileContent;
	var geoObject = JSON.parse(geoJSONObject);
	var features = [];
	features = geoObject.features;
	
	if ((features[0].geometry.type) != "Polygon")
	{
		throw ("Le fichier ne contient pas des données de type Polygon.");
	}else{
		var content = "[HIGHLIGHTING]\r\n"+"zoom=10"+"\r\n";
		var len = features[0].geometry.coordinates[0].length;
		
		for (var i = 0; i < len-1; i++) {
			content += "PointLon_"+i+"="+features[0].geometry.coordinates[0][i][0]+"\r\n";
			content += "PointLat_"+i+"="+features[0].geometry.coordinates[0][i][1]+"\r\n";
		}
	
		var textFile = null,
		makeTextFile = function (text) {
			var data = new Blob([text], {type: 'text/plain'});

			// If we are replacing a previously generated file we need to
			// manually revoke the object URL to avoid memory leaks.
			if (textFile !== null) {
			  window.URL.revokeObjectURL(textFile);
			}
			textFile = window.URL.createObjectURL(data);
			return textFile;
		};
	}
	var link = document.getElementById('downloadlink');
	link.href = makeTextFile(content);
	link.style.display = 'block';
	link.style.width = "100px";
};

function onFileLoad(elementId, event) {
	fileContent = event.target.result;
	document.getElementById(elementId).innerText = event.target.result;
}

function onChooseFile(event, onLoadFileHandler) {
	if (typeof window.FileReader !== 'function')
		throw ("The file API isn't supported on this browser.");
	let input = event.target;
	if (!input)
		throw ("The browser does not properly implement the event object");
	if (!input.files)
		throw ("This browser does not support the `files` property of the file input.");
	if (!input.files[0])
		return undefined;
	let file = input.files[0];
	if(file.size > 204800){
	   alert("Fichier trop volumineux!\nSimplifiez la géometrie.");
	   input.value = "";
	   return;
	};

	let fr = new FileReader();
	fr.onload = onLoadFileHandler;
	fr.readAsText(file);
	
	var inputFileName = file.name.split('.')[0];
	inputFileName += ".hlg";
	var a = document.getElementById('downloadlink');
	a.setAttribute("download", inputFileName);
	//console.log(file.name.split('.')[1]); //extension display	
}