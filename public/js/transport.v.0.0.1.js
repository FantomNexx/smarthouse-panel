var STATUS_CODE = {
   OK         : 200,
   BAD_REQUEST: 400,
   NOT_FOUND  : 404
};//STATUS_CODE

function Transport(){
   
   var header = 'Content-Type';
   var header_value = 'application/json; charset=UTF-8';
   
   
   //-------------------------------------------------------
   /**
    * @param url
    * @param callback
    * @returns {boolean}
    * */
   this.GetData = function( url, callback ){
      
      var http_request = new XMLHttpRequest();
      
      if( !http_request ){
         var msg = 'Request failed, cannot create an XMLHttpRequest instance';
         console.log( msg );
         return false;
      }//if
      
      http_request.onreadystatechange = function(){
         OnStateChanged( http_request, callback );
      };//onreadystatechange
      
      http_request.open( 'GET', url );
      http_request.setRequestHeader( header, header_value );
      http_request.send();
      
      return true;
   };//GetData
   //-------------------------------------------------------
   this.PostData = function( url, data, callback ){
      
      var http_request = new XMLHttpRequest();
      
      http_request.onreadystatechange = function(){
         OnStateChanged( http_request, callback );
      };//onreadystatechange
      
      http_request.open( 'POST', url, true );
      http_request.setRequestHeader( header, header_value );
      http_request.send( JSON.stringify( data ) );
   };
   //-------------------------------------------------------
   function OnStateChanged( request, callback ){
      
      if( request.readyState !== XMLHttpRequest.DONE ){
         return;
      }//if
      
      if( request.status === STATUS_CODE.OK ){
         
         var response_data;
         try{
            response_data = JSON.parse( request.responseText );
         }catch( exception ){
            response_data = {};
         }//try
         
         callback( response_data );
         return;
      }//if
      
      console.log( 'There was a problem with the request.' );
   }//OnStateChanged
   //-------------------------------------------------------
   
   
}//class