var accessToken = '76e0809f76014e8eab3d74fcb862be24';
var baseUrl = 'https://api.api.ai/v1/query?v=20150910';

var el_speech_input;
var el_btn_rec;
var el_response;
var el_textarea_response;

var recognition;

var messageRecording = 'Recording...';
var messageInternalError = 'Oh no, there has been an internal server error';
var messageSorry = 'I\'m sorry, I don\'t have the answer to that yet.';

function Init(){
   
   el_speech_input = document.querySelector( '#speech' );
   el_btn_rec = document.querySelector( '#rec' );
   el_response = document.querySelector( '#spokenResponse' );
   el_textarea_response = document.querySelector( '#response' );
   
   var OnKeyUp = function( event ){
      if( event.which === 13 ){
         event.preventDefault();
         Send();
      }//if
   };//OnKeyUp
   
   el_speech_input.addEventListener( 'keyup', OnKeyUp );
   el_btn_rec.addEventListener( 'click', SwitchRecognition );
}//Init

Init();


function StartRecognition(){
   
   recognition = new webkitSpeechRecognition();
   recognition.continuous = false;
   recognition.interimResults = false;
   
   recognition.onstart = function( event ){
      respond( messageRecording );
      UpdateRec();
   };
   
   recognition.onresult = function( event ){
      
      if( recognition ){
         recognition.onend = null;
      }
      
      var text = '';
      for( var i = event.resultIndex; i < event.results.length; ++i ){
         text += event.results[ i ][ 0 ].transcript;
      }
      SetInput( text );
      StopRecognition();
   };
   
   recognition.onend = function(){
      StopRecognition();
   };
   
   recognition.lang = 'en-US';
   recognition.start();
}

function StopRecognition(){
   if( recognition ){
      recognition.stop();
      recognition = null;
   
      el_response.classList.remove('is-active');
   }
   UpdateRec();
}

function SwitchRecognition(){
   if( recognition ){
      StopRecognition();
   }else{
      StartRecognition();
   }
}

function SetInput( text ){
   el_speech_input.value = text;
}

function UpdateRec(){
   el_btn_rec.innerHTML = ( recognition ? 'Stop' : 'Speak' );
}

function Send(){
   var text = el_speech_input.value;
   
   var data = {
      query    : text,
      lang     : 'en',
      sessionId: 'yaydevdiner'
   };
   
   transport.PostData( data, prepareResponse );
}

function prepareResponse( val ){
   if( val.result.speech ){
      respond( val.result.speech );
   }else{
      respond( val.result.fulfillment.speech );
   }
}

function respond( val ){
   if( val == '' ){
      val = messageSorry;
   }
   if( val !== messageRecording ){
      var msg = new SpeechSynthesisUtterance();
      msg.voiceURI = 'native';
      msg.text = val;
      msg.lang = 'en-US';
      window.speechSynthesis.speak( msg );
   }
   
   $( '#spokenResponse' ).addClass( 'is-active' ).find( '.spoken-response__text' ).html( val );
}
//----------------------------------------------------------
var STATUS_CODE = {
   OK         : 200,
   BAD_REQUEST: 400,
   NOT_FOUND  : 404
};//STATUS_CODE
//----------------------------------------------------------
function TransportWeb(){
   
   
   var header = 'Content-Type';
   var header_value = 'application/json; charset=UTF-8';
   
   //-------------------------------------------------------
   this.PostData = function( data, callback ){
      
      var http_request = new XMLHttpRequest();
      
      http_request.onreadystatechange = function(){
         OnStateChanged( http_request, callback );
      };//onreadystatechange
      
      http_request.open( 'POST', baseUrl, true );
      http_request.setRequestHeader( header, header_value );
      http_request.setRequestHeader( 'Authorization', 'Bearer ' + accessToken );
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
      
      respond( messageInternalError );
   }//OnStateChanged
   //-------------------------------------------------------
   
}//class
//----------------------------------------------------------
var transport = new TransportWeb();
//----------------------------------------------------------