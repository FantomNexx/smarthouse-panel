//----------------------------------------------------------
var transport = new Transport();
//----------------------------------------------------------

var REQUEST_URLS = {
   Update: '/update'
};//REQUEST_URLS


var el_log_container = undefined;

//----------------------------------------------------------
function Init(){
   
   el_log_container = document.querySelector( '#id-log-container' );
   
   var OnClick = function( event ){
      if( el_log_container === undefined ){
         return;
      }//if
      
   };//OnClick
   
   el_log_container.addEventListener( 'click', OnClick );
}//Init

Init();


function GetDateStr(){
   return '[' + new Date().toISOString().slice( 11, -5 ) + ']';
}//GetDateStr

//----------------------------------------------------------
function Update(){
   
   var OnResult = function( response_data ){
      if( el_log_container === undefined ){
         return;
      }//if
      
      el_log_container.innerHTML = '';
      
      for( var i in response_data.requests_arr ){
         el_log_container.innerHTML += response_data.requests_arr[ i ];
         el_log_container.innerHTML += '<br />';
      }//for
      
   };//OnResult
   
   var request_data = {
      command: 'cmd'
   };//request_data
   
   
   transport.PostData(
      REQUEST_URLS.Update, request_data, OnResult );
}//Update

Update();