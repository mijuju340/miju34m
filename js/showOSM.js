var map;

let makerLayers = []; //MakerGroupを格納する連想配列
let distanceLayers = []; //距離の塗りつぶしを格納する連想配列
let icons =[]; //アイコンを格納する連想配列


var categories; //カテゴリ一覧

function setMakerLayers(){
	categories.forEach(function( value ) {
		makerLayers[value] = L.layerGroup();
	});
}

function setDistanceLayers(){
	categories.forEach(function( value ) {
		distanceLayers[value] = L.layerGroup();
	});
}

function setMarkersData(){
	 var icon_w = 20;
	 var icon_h = 20;
	 var markerMenuList ="";
	 
	 categories.forEach(function( value ) {
			icons[value] = L.icon({
			       iconUrl: 'icon/'+markersData[value].icon,
			       iconSize:     [icon_w, icon_h], 
			       iconAnchor: [icon_w/2, icon_h/2],
			   });
			var c0_checked = "checked";
			var c1_checked = "checked";
			if(markersData[value].color == "#ff9393"){
				c0_checked = "";
			}else{
				c1_checked = "";
			}
					var markerMenu = '<div><input type="checkbox" id="'+value+'" checked="checked" onchange="changeCBOX(this.id)"/>\n'+
			'<img border="0" src="icon/'+markersData[value].icon+'" width="20" height="20">'+markersData[value].name+'\n'+
	/* 距離表示をする場合は，この部分のコメントアウトを外す
		    '<input id="'+value+'_menu" name="'+value+'" type="button" value="+" onclick="showDistanceMenu(this.id)">\n'+
			'<div id="'+value+'_control" style="display:none;">\n'+
			'<label> &nbsp;<input id="'+value+'_c0"  type="radio" name="'+value+'" value="non" '+c0_checked+' onchange="changeColor(this.id)"></label>\n'+
			'<label  style="background-color:#ff9393"><input id="'+value+'_c1" type="radio" name="'+value+'" value="#ff9393" '+c1_checked+'  onchange="changeColor(this.id)"></label>\n'+
			'<label  style="background-color:#93c9ff"><input id="'+value+'_c2" type="radio" name="'+value+'" value="#93c9ff" onchange="changeColor(this.id)"></label>\n'+
			'<label  style="background-color:#93ffc9"><input id="'+value+'_c3" type="radio" name="'+value+'" value="#93ffc9" onchange="changeColor(this.id)"></label>\n'+
			'<label  style="background-color:#ffff93"><input id="'+value+'_c4" type="radio" name="'+value+'" value="#ffff93" onchange="changeColor(this.id)"></label>\n'+
			'<br>&nbsp;<i>d</i>=<input type="text" id="'+value+'_distance" name="'+value+'" value="300" size="8" onchange="changeDistance(this.id)">m\n'+
			'</div>\n'+ */
			'</div>\n';
		
			markerMenuList+=markerMenu;
		});
	
	 document.getElementById('markerList').innerHTML = markerMenuList ;
}


function showMAP(mapid,lat,lon){
//	   var lat            = 38.42839; 
//	   var lon            = 141.31055;
	   
   // 位置とズームを決めてマップを描画
   map = L.map(mapid,{
       center:[lat, lon],
       zoom: 14
   });

   // OpenStreetMapを使うためのおまじない
   var tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
       attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
   });
   tileLayer.addTo(map);
   
   //GoogleMapを使う場合
//   var tileLayer = L.tileLayer(
//			'http://mt{s}.google.com/vt/lyrs=m@121&hl=ja&x={x}&y={y}&z={z}',
//			{ subdomains: [0,1,2,3] }
//		).addTo(map);
//
//   tileLayer.addTo(map);
   
   
   addMarker(map);
}

function addMarker(map){
	//初期設定
	categories = Object.keys(markersData); 
	setMakerLayers();
	setDistanceLayers();
	setMarkersData();

   // 指定した位置にマーカーを置く
   for (var d = 0; d < data.length; d++) {
		var iri = data[d]['id'];
		var v_label = data[d]['name'];
		v_lat = data[d]['lat'];
		v_long =  data[d]['lon'];
		v_text =  data[d]['text'];

		var cat =data[d]['cat'];
			
		var mapMarker = L.marker([v_lat, v_long], {icon: icons[cat]});
			   mapMarker.bindPopup('<b>'+v_label+'</b><br>'+v_text+"<br>("+v_lat +","+v_long+")"
			   );
			
			
		if(makerLayers[cat]/*.get(cat)*/ instanceof L.LayerGroup){
		mapMarker.addTo(makerLayers[cat]/*.get(cat)*/);
		}else{
			console.log("NOT:::"+ cat );
		}
		
   }//Maker作成用for文終了

   categories.forEach(function( value ) {
	     makerLayers[value].addTo(map);
	     distanceLayers[value].addTo(map);
		});   
   
}

function changeMarker(category,selected){
	if(selected){
		makerLayers[category].addTo(map);
		distanceLayers[category].addTo(map);
	}
	else{
		map.removeLayer(makerLayers[category]);
		map.removeLayer(distanceLayers[category]);
	}
			
} 

function drawDistance(category){
	var mkdata = markersData[category];
	if(mkdata == undefined){
		alert(category +  ' is undefined!');
		return;
	}
	if(mkdata.color == 'non'){
		return;
	}
	makerLayers[category].eachLayer(function (layer) {
		   	var pos = layer.getLatLng();
			var circle = L.circle([pos.lat,pos.lng], markersData[category].distance,{
			    color: markersData[category].color,
			    fillColor: markersData[category].color,
			    fillOpacity: 0.3,
			}).addTo(distanceLayers[category]);
		});	
	
}


function setDistance(category,distance){
	distanceLayers[category].clearLayers();
	markersData[category].distance = distance;
	drawDistance(category);
	}

function setDistanceColor(category,v_color){
	distanceLayers[category].clearLayers();
	markersData[category].color = v_color;
	drawDistance(category)
}
