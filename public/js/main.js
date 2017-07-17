//----------------------------------------------------------
var transport = new Transport();
//----------------------------------------------------------

var APP_DATA = {};

var REQUEST_URLS = {
   NotesCreate: '/test'
};//REQUEST_URLS



//----------------------------------------------------------
function Init(){
   
   var el = document.querySelector( '#id-log-container' );
   
   var OnClick = function( event ){
      if( el === undefined ){
         return;
      }//if
      
      el.innerHTML += '\nclick';
      
   };//OnClick
   
   el.addEventListener( 'click', OnClick );
   
}//Init

Init();


