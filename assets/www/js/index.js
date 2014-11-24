var url = 'http://www.hkcalling.com.hk/mobile/index.php';
var urlImage = 'http://www.hkcalling.com.hk/pictures/';
var pictureSource;
var destinationType;
var scrollOn = true;
var replace = true;
var idPictures = {addItemPicture1:"", addItemPicture2:"", addItemPicture3:"" };

document.addEventListener("deviceready",onDeviceReady,false);

var cat = "All categories";
var loc = 0;
var first = 1;
var keyword = '';
var items;
var currentDiv;

function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType; 
}

function displayLoading(){
	$.mobile.loading( "show", {
        text: 'Loading',
        textVisible: true,
        theme: 'b',
        textonly: false,
        html: ''
	});
}

function undisplayLoading(){
	$.mobile.loading( "hide" );
}

function loadResults(){
	displayLoading();
	$.ajax(
		   {
				   url: url,
				   type: 'GET',					   
				   data: { "cat":cat, "loc":loc, "p":first, "q":keyword, "action":"getAll"},
				   cache: false, 
				   context: document.body,
				   success: function(httpRequest, textStatus, errorThrown) {  
						if (httpRequest == 0) { 
							 alert("An error occured.");
						} 
						else {
							//alert(httpRequest);
							items = JSON.parse(httpRequest); //eval('('+httpRequest+')');
							var htmlGetAll= '<ul data-role="listview" data-inset="true">';
							for(var i=0; i<items.length; i++){
								var img = "img/notFound.png";
								if(items[i].picture!='') img = urlImage+items[i].picture;
								var classLi = (i%2==0) ? 'class="pair"' : 'class="impair"';
								htmlGetAll += '<li '+classLi+'><a class="singleItem" href="#" id="'+items[i].id+'"><img src="'+img+'"><h2>'+items[i].title+'</h2><p>'+items[i].category+'</p><p>'+items[i].location+'</p><p><strong>'+items[i].price+'HK$</strong></p><span class="ui-li-count">'+items[i].views+'</span></a></li>';
							}
							//<p class="ui-li-aside">'+items[i].updated_at+'</p>
							
							htmlGetAll += '</ul>';
							if(items.length==0){
								scrollon=false;
								if(first == 1)  $("#resultsGetAll").html("No results").trigger('create');
							}
							if (replace) $("#resultsGetAll").html(htmlGetAll).trigger('create');
							else $("#resultsGetAll").append(htmlGetAll).trigger('create');
							replace = false;
							first++;
						}
						undisplayLoading();
				   },
				   error: function(httpRequest, textStatus, errorThrown) {	
						undisplayLoading();
						alert('Something got wrong. Please try later');
				   }    
		   }
	);	

	
}

function loadItem(id){
	displayLoading();
	$.ajax(
		   {
				   url: url,
				   type: 'GET',					   
				   data: { "id":id, "action":"getOne"},
				   cache: false, 
				   context: document.body,
				   success: function(httpRequest, textStatus, errorThrown) {  
						if (httpRequest == 0) { 
							 alert("An error occured.");
						} 
						else {
							//alert(httpRequest);
							$(".ui-popup-container").remove();
							item = JSON.parse(httpRequest); 
							var htmlGetOne= '';
							if(item.pictures!=''){
								var widthPicture = item.pictures.length;
								for(var i=0; i<item.pictures.length; i++){
									htmlGetOne += '<a href="#popup'+i+'" data-rel="popup" data-position-to="window" data-transition="fade"><div class="picture-small" style="background:url(\''+urlImage+'small-'+item.pictures[i]+'\') no-repeat scroll center center #dee9f9"></div></a>'+
													'<div data-role="popup" id="popup'+i+'" data-overlay-theme="b" data-theme="b" data-corners="false">'+
														'<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a><img class="popphoto" src="'+urlImage+item.pictures[i]+'" style="max-height:1000px;" >'+
													'</div>';
								}								
							}
							htmlGetOne += '<div class="ui-corner-all custom-corners"><h2>'+item.title+'</h2><div class="ui-body ui-body-a"><p>'+item.description+'</p></div></div>';
							htmlGetOne += '<div class="ui-corner-all custom-corners"><div class="ui-body ui-body-a"><table data-role="table" id="infos-table-custom" data-mode="table" class="infos-list ui-responsive table-stroke table-stripe">'+
												 '<thead>'+
												   '<tr>'+
													 '<th data-priority="1"></th>'+
													 '<th data-priority="2"></th>'+
												   '</tr>'+
												 '</thead>'+
												  '<tbody>'+
													'<tr>'+
													  '<th>Price :</th>'+
													  '<td>'+item.price+' HK$</td>'+
													'</tr>'+
													'<tr>'+
													  '<th>Category :</th>'+
													  '<td>'+item.category+'</td>'+
													'</tr>'+
													'<tr>'+
													  '<th>District :</th>'+
													  '<td>'+item.location+'</td>'+
													'</tr>'+
													'<tr>'+
													  '<th>Views :</th>'+
													  '<td>'+item.views+'</td>'+
													'</tr>'+
													'<tr>'+
													  '<th>Date :</th>'+
													  '<td>'+item.updated_at+'</td>'+
													'</tr>'+
												  '</tbody>'+
												'</table></div></div>';
							htmlGetOne += '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-a"><h1>CONTACT THE SELLER</h1></div><div class="ui-body ui-body-a">';
							htmlGetOne += '<p><a href="#popupMessage" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-mail ui-btn-icon-left ui-btn-a" data-transition="pop">Send a message</a>'+
												'<div data-role="popup" id="popupMessage" data-theme="a" class="ui-corner-all">'+
													'<form onSubmit="return false;">'+
														'<div style="padding:10px 20px;">'+
															'<h3>Send message</h3>'+
															'<p id="alertSend"></p>'+
															'<label for="name" class="ui-hidden-accessible">Your name:</label>'+
															'<input name="name" id="nameSend" value="" placeholder="name" data-theme="a" type="text">'+
															'<label for="email" class="ui-hidden-accessible">Your Email:</label>'+
															'<input name="email" id="emailSend" value="" placeholder="email" data-theme="a" type="email">'+
															'<label for="phone" class="ui-hidden-accessible">Your Phone (optionnal):</label>'+
															'<input name="phone" pattern="+[0-9]*" id="phoneSend" value="" placeholder="phone" type="text">'+
															'<label for="message" class="ui-hidden-accessible">Your Message:</label>'+
															'<textarea name="message" id="messageSend" value="" placeholder="message" data-theme="a" type="textarea"></textarea>'+
															'<input type="hidden" name="idSend" id="idSend" value="'+item.id+'">'+
															'<button type="submit" id="sendMessage" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Send</button>'+
														'</div>'+
													'</form>'+
													'</div></p>';
							if(item.phone!=''){
								htmlGetOne += '<p><a href="tel:'+item.phone+'" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-phone ui-btn-icon-left ui-btn-a">Call '+item.phone+'</a></p>';
							}
							htmlGetOne += '</div></div>';
							$("#resultsGetOne").html(htmlGetOne).trigger('create');
						}	
				   },
				   error: function(httpRequest, textStatus, errorThrown) {							
						alert('Something got wrong. Please try later');
				   }    
		   }
	);	

	undisplayLoading();
}

function createAddForm(){
	var htmlAddForm = '<form id="AddItemForm" method="post" enctype="multipart/form-data" onSubmit="return false;">'+
							'<p id="alertAddItem"></p>'+
							'<div class="ui-field-contain">'+
								'<label for="name" class="labelAdd"><strong>Your Name :</strong></label>'+
								'<input data-clear-btn="true" name="name" id="addItemName" value="" type="text">'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="email" class="labelAdd"><strong>Your Email :</strong></label>'+
								'<input data-clear-btn="true" name="email" id="addItemEmail" value="" type="email">'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="phone" class="labelAdd"><strong>Your Phone number :</strong></label>'+
								'<input data-clear-btn="true" name="phone" id="addItemPhone" value="" type="tel">'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="showPhone" class="labelAdd"><strong>Show Your Phone number :</strong></label>'+
								'<select name="showPhone" id="addItemShowPhone" data-role="slider">'+
									'<option value="1">No</option>'+
									'<option value="0">Yes</option>'+
								'</select>'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="select-cat" class="labelAdd"><strong>Item\'s Category :</strong></label>'+
								'<select name="select-cat" id="addItemCat" data-native-menu="true">'+
									'<option value="0">Choose your Category</option>'+
									'<option value="1">Cars</option>'+
									'<option value="2">Motorcycles</option>'+
									'<option value="3">Boats</option>'+
									'<option value="4">Car equipment</option>'+
									'<option value="5">Motorcycle equipment</option>'+
									'<option value="6">Boat equipment</option>'+
									'<option value="7">Sales</option>'+
									'<option value="8">Rentals</option>'+
									'<option value="9">Flatshares</option>'+
									'<option value="10">Offices and Shops</option>'+
									'<option value="11">Computers</option>'+
									'<option value="12">Computer accessories</option>'+
									'<option value="13">Video games</option>'+
									'<option value="14">Image and Sound</option>'+
									'<option value="15">Phone</option>'+
									'<option value="16">Phone accessories</option>'+
									'<option value="17">Furniture</option>'+
									'<option value="18">Household appliances</option>'+
									'<option value="19">Tableware</option>'+
									'<option value="20">Decoration</option>'+
									'<option value="21">Housing</option>'+
									'<option value="22">Linen</option>'+
									'<option value="23">Clothing</option>'+
									'<option value="24">Shoes</option>'+
									'<option value="25">Accessories and Luggage</option>'+
									'<option value="26">Watches and Jewelry</option>'+
									'<option value="27">Baby equipment</option>'+
									'<option value="28">Baby clothing</option>'+
									'<option value="29">DVD and Movies</option>'+
									'<option value="30">CD and Music</option>'+
									'<option value="31">Tickets</option>'+
									'<option value="32">Books</option>'+
									'<option value="33">Pets</option>'+
									'<option value="34">Bikes</option>'+
									'<option value="35">Sports and Hobbies</option>'+
									'<option value="36">Musical instruments</option>'+
									'<option value="37">Collection</option>'+
									'<option value="38">Games and Toys</option>'+
									'<option value="39">Wines and Fine food</option>'+
									'<option value="40">Transportation</option>'+
									'<option value="41">Handling</option>'+
									'<option value="42">Construction carcass work</option>'+
									'<option value="43">Tools and Materials</option>'+
									'<option value="44">Industrial equipment</option>'+
									'<option value="45">Catering and Hospitality</option>'+
									'<option value="46">Office supplies</option>'+
									'<option value="47">Shops and Markets</option>'+
									'<option value="48">Medical equipment</option>'+
									'<option value="49">Job offers</option>'+
									'<option value="50">Private lessons</option>'+
									'<option value="51">Internships</option>'+
									'<option value="52">Investment</option>'+
									'<option value="53">Business opportunities</option>'+
									'<option value="54">Moving and Removal</option>'+
									'<option value="55">Repairs</option>'+
									'<option value="56">Mobile unlock</option>'+
									'<option value="57">Housekeepers and Maids</option>'+
									'<option value="58">Unclassable</option>'+
									'<option value="59">Events</option>'+
									'<option value="60">Wanted</option>						'+
								'</select>'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="select-loc" class="labelAdd"><strong>District :</strong></label>'+
								'<select name="select-loc" id="addItemLoc" data-native-menu="true">'+
									'<option value="0">Choose your location</option>'+
									'<option value="1">Central and Western</option>'+
									'<option value="2">Wan Chai</option>'+
									'<option value="3">Eastern</option>'+
									'<option value="4">Southern</option>'+
									'<option value="5">Yau Tsim Mong</option>'+
									'<option value="6">Sham Shui Po</option>'+
									'<option value="7">Kowloon City</option>'+
									'<option value="8">Wong Tai Sin</option>'+
									'<option value="9">Kwun Tong</option>'+
									'<option value="10">Kwai Tsing</option>'+
									'<option value="11">Tsuen Wan</option>'+
									'<option value="12">Tuen Mun</option>'+
									'<option value="13">Yuen Long</option>'+
									'<option value="14">North</option>'+
									'<option value="15">Tai Po</option>'+
									'<option value="16">Sha Tin</option>'+
									'<option value="17">Sai Kung</option>'+
									'<option value="18">Islands</option>'+
								'</select>'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="title" class="labelAdd"><strong>Item\'s name :</strong></label>'+
								'<input data-clear-btn="true" name="title" id="addItemTitle" value="" type="text">'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="description" class="labelAdd"><strong>Item\'s description :</strong></label>'+
								'<textarea name="description" id="addItemTitleDescription"></textarea>'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="price" class="labelAdd"><strong>Price in HK$ :</strong></label>'+
								'<input data-clear-btn="true" name="price" id="addItemPrice" value="" type="number">'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="picture1" class="labelAdd"><strong>Main Picture :</strong>'+
								'</label>'+
								'<img  style="display:none;width:60px;height:60px;" src="" id="addItemPicture1" />'+
								'<div class="ui-field-contain">'+
									'<a href="#" data-icon="camera" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-camera ui-btn-icon-notext" onClick="getPhoto(pictureSource.CAMERA,\'addItemPicture1\');"></a>'+						
									'<a href="#" data-icon="bars" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-bars ui-btn-icon-notext" onClick="getPhoto(pictureSource.PHOTOLIBRARY, \'addItemPicture1\');"></a>'+						
									'<a href="#" data-icon="delete" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-delete ui-btn-icon-notext" onClick="removePhoto(\'addItemPicture1\');"></a>'+						
								'</div>'+								
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="picture2" class="labelAdd"><strong>2nd Picture :</strong>'+
								'</label>'+
								'<img  style="display:none;width:60px;height:60px;" src="" id="addItemPicture2" />'+
								'<div class="ui-field-contain">'+
									'<a href="#" data-icon="camera" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-camera ui-btn-icon-notext" onClick="getPhoto(pictureSource.CAMERA, \'addItemPicture2\');"></a>'+							
									'<a href="#" data-icon="bars" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-bars ui-btn-icon-notext" onClick="getPhoto(pictureSource.PHOTOLIBRARY, \'addItemPicture2\');"></a>'+	
									'<a href="#" data-icon="delete" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-delete ui-btn-icon-notext" onClick="removePhoto(\'addItemPicture2\');"></a>'+										
								'</div>'+
							'</div>'+
							'<div class="ui-field-contain">'+
								'<label for="picture3" class="labelAdd"><strong>3rd Picture :</strong>'+
								'</label>'+
								'<img  style="display:none;width:60px;height:60px;" src="" id="addItemPicture3" />'+
								'<div class="ui-field-contain">'+
									'<a href="#" data-icon="camera" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-camera ui-btn-icon-notext" onClick="getPhoto(pictureSource.CAMERA, \'addItemPicture2\');"></a>'+						
									'<a href="#" data-icon="bars" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-bars ui-btn-icon-notext" onClick="getPhoto(pictureSource.PHOTOLIBRARY, \'addItemPicture2\');"></a>'+
									'<a href="#" data-icon="delete" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-delete ui-btn-icon-notext" onClick="removePhoto(\'addItemPicture3\');"></a>'+	
								'</div>'+
							'</div>'+
							'<button type="submit" id="addItem" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-btn-icon-left ui-icon-plus">Submit</button>'+
							'<h2 id="successAddItem"></h2>'+							
						'</form>';
	$("#resultsAddForm").html(htmlAddForm).trigger('create');
}

$(document).on('click', '#sendMessage', function() {
	var alertMessage = '';
	var idItem = $('#idSend').val();
	var name = $('#nameSend').val();
	if(name=='') alertMessage+='The name must be filled.<br>';
	var email = $('#emailSend').val();
	if(email=='') alertMessage+='The email must be filled.<br>';
	var phone = $('#phoneSend').val();
	var message = $('#messageSend').val();
	if(message=='') alertMessage+='The message must be filled.<br>';
	if(alertMessage!=''){
		$("#alertSend").html(alertMessage).trigger('create');
		$("#popupMessage").popup( "open" );
	}
	else{
		$.ajax(
		   {
				   url: url,
				   type: 'GET',					   
				   data: { "idItem":idItem, "name":name, "email":email, "phone":phone, "message":message, "action":"sendMessage"},
				   cache: false, 
				   context: document.body,
				   success: function(httpRequest, textStatus, errorThrown) {  
						//alert(httpRequest);
						if (httpRequest == 'messageSent') { 
							var htmlPopup = 'Message sent!';
							$("#alertSend").html(htmlPopup).trigger('create');
							
							$("input").addClass('ui-disabled');
							$("input").prop("disabled", true);
							$("textarea").addClass('ui-disabled');
							$("textarea").prop("disabled", true);
							$("#sendMessage").addClass('ui-disabled');
							$("#sendMessage").prop("disabled", true);
							
							$("#popupMessageSent").popup( "open" );						} 
						else {
							alert("An error occured.");
						}	
				   },
				   error: function(httpRequest, textStatus, errorThrown) {							
						alert('Something got wrong. Please try later');
				   }    
		   }
		);
	}
	
	return false;
});

function validTypePicture(name){
	var type = name.split('.').pop();
	if(type=='bmp')return true;
	if(type=='gif')return true;
	if(type=='png')return true;
	if(type=='jpeg')return true;
	if(type=='jpg')return true;
	if(type=='x-ms-bmp')return true;
	return false;
}

function removePhoto(idDiv){
	currentDiv = idDiv;
	$('#'+currentDiv).attr('src', '');
	idPictures[currentDiv] = '';
	$('#'+currentDiv).hide();
}

function getPhoto(source, idDiv) {
	currentDiv = idDiv;
	var quali = 25;
	if(source == pictureSource.CAMERA){
		navigator.camera.getPicture(onCapturePhotoURISuccess, onFail, { quality: quali, 
			destinationType: destinationType.FILE_URI,
			correctOrientation: true,
			saveToPhotoAlbum: true
			});
	}
	else{
		// Retrieve image file location from specified source
		navigator.camera.getPicture(onCapturePhotoURISuccess, onFail, { quality: quali, 
			destinationType: destinationType.FILE_URI,
			sourceType: source
			});
	}
}

//Called if something bad happens.
function onFail(message) {
	if(message!= "Camera cancelled." && message!= "Selection cancelled."){
		alert('Failed because: ' + message);
	}
}

function onCapturePhotoURISuccess(imageURI){
	var path = imageURI.replace("file://localhost",'');
	$('#'+currentDiv).attr('src', path);
	$('#'+currentDiv).show();
	uploadPhoto(imageURI);
}

function uploadPhoto(imageURI) {
  var imagefile = imageURI; 
  if(typeof imagefile != 'undefined'){
	  displayLoading();
	  var ft = new FileTransfer();                     
	  var options = new FileUploadOptions();                      
	  options.fileKey= 'picture';                      
	  options.fileName=imagefile.substr(imagefile.lastIndexOf('/')+1);
	  options.mimeType="image/jpeg";  
	  var params = new Object();
	  params.ok = '';                       
	  options.params = params;
	  options.chunkedMode = false;                       
	  ft.upload(imagefile, url+"?action=addPicture", win, fail, options);  
	}
 }
 
function win (r) {
	if( r.response != 'addPictureError'){
		idPictures[currentDiv] = r.response;
	}
	undisplayLoading();
}

function fail (error) {
	undisplayLoading();
}

$(document).on('click', '#addItem', function() {
	var alertMessage = '';

	if($('#addItemName').val()=='') alertMessage+='Your name must be filled.<br>';
	if($('#addItemEmail').val()=='') alertMessage+='Your email must be filled.<br>';
	if($('#addItemPhone').val()=='') alertMessage+='Your phone must be filled.<br>';

	if($('#addItemCat').val()==0) alertMessage+='Please choose a category.<br>';
	if( $('#addItemLoc').val()==0) alertMessage+='Please choose a location.<br>';
	
	if($('#addItemTitle').val()=='') alertMessage+='Please choose a title.<br>';
	if($('#addItemPrice').val()=='') alertMessage+='Please choose a price<br>';	
	if($('#addItemTitleDescription').val()=='') alertMessage+='Please type a description<br>';

	if($('#addItemPicture1').attr('src')!='' && !validTypePicture($('#addItemPicture1').attr('src'))) alertMessage+='Your main picture is not accepted.<br>';
	if($('#addItemPicture2').attr('src')!='' && !validTypePicture($('#addItemPicture2').attr('src'))) alertMessage+='Your 2n picture is not accepted.<br>';
	if($('#addItemPicture3').attr('src')!='' && !validTypePicture($('#addItemPicture3').attr('src'))) alertMessage+='Your 3rd picture is not accepted.<br>';

	if(alertMessage!=''){
		$("#alertAddItem").html(alertMessage).trigger('create');
		$("#alertAddItem").scrollTop();
	}
	else{
		$('#addItem').hide();
		displayLoading();
		$("#alertAddItem").html('').trigger('create');

		var formData = new FormData($('#AddItemForm')[0]);
		if(idPictures['addItemPicture1'] != '')	formData.append('idPicture1', idPictures['addItemPicture1']);
		if(idPictures['addItemPicture2'] != '')	formData.append('idPicture2', idPictures['addItemPicture2']);
		if(idPictures['addItemPicture3'] != '')	formData.append('idPicture3', idPictures['addItemPicture3']);
		$.ajax(
		   {
				   url: url+"?action=addItem",
				   type: 'POST',					   
				   data: formData, 
				   cache: false, 
				   contentType: false,
				   processData: false,
				   async: false,
				   success: function(httpRequest, textStatus, errorThrown) {  
						//alert(httpRequest);
						if (httpRequest == 'addItemError') { 
							alert("An error occured.");							
						} 
						// The object has been created, it returns the item id
						else {
							var htmlItem = 'Congratulations, your item bas been created. It\'s id is '+httpRequest+'. Please wait for our team to validate your ad.';
							$("#successAddItem").html(htmlItem).trigger('create');
							
							$("input").addClass('ui-disabled');
							$("input").prop("disabled", true);
							$("textarea").addClass('ui-disabled');
							$("textarea").prop("disabled", true);
							$("#addItem").addClass('ui-disabled');
							$("#addItem").prop("disabled", true);
						}	
						undisplayLoading();
				   },
				   error: function(httpRequest, textStatus, errorThrown) {	
						undisplayLoading();
						alert('Something got wrong. Please try later');
				   }    
		   }
		);
	}
	return false;
});

$(document).scroll(function(){ // On surveille l'évènement scroll
	if(scrollOn){
		if($(window).scrollTop() + window.innerHeight == $(document).height()) 	loadResults();
	}
});


$(document).on('change', '#select-categories', function() {
	cat = $(this).val();
	replace = true;
	first = 1;
	loadResults();
});

$(document).on('change', '#select-locations', function() {
	loc = $(this).val();
	replace = true;
	first = 1;
	loadResults();
});

$(document).on('click', '#addButton', function() {
	$.mobile.changePage("#addItemPage");
	createAddForm();
	scrollOn = false;
});

$(document).on('click', '#searchButton', function() {
	$.mobile.changePage("#homePage");
	scrollOn = true;
});

$(document).on('click', '.singleItem', function() {
	$.mobile.changePage("#singleItemPage");
	var id = $(this).attr('id');
	loadItem(id);
	scrollOn = false;	
});

$(document).on("pagecreate",function(event){
  $(window).on("orientationchange",function(event){
    $.mobile.changePage("#homePage");
	loadResults();
	scrollOn = true;
  });                     
});

