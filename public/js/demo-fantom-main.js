//----------------------------------------------------------
var access_token = '76e0809f76014e8eab3d74fcb862be24';
var base_url = 'https://api.api.ai/v1/query?v=20150910';
//----------------------------------------------------------

var symbol_degree = '&deg;';

var STATUS_CODE = {
   OK         : 200,
   BAD_REQUEST: 400,
   NOT_FOUND  : 404
};//STATUS_CODE

var CONTROL_STATES = {
   ON : 'ON',
   OFF: 'OFF'
};//CONTROL_STATES

var current_states = {
   lights : {
      state: CONTROL_STATES.OFF
   },
   cooling: {
      state: CONTROL_STATES.ON,
      value: 20
   },
   heating: {
      state: CONTROL_STATES.OFF,
      value: 28
   }
};//current_states

var status_lines = {
   listening     : 'Listening...',
   standing_by   : 'Waiting for command',
   processing_cmd: 'Processing command...'
};//status_lines

var voice_recognition = undefined;

//----------------------------------------------------------
//PAGE ELEMENTS
{
   var el_status = undefined;
   var id_el_status = '#id-status';
   
   var el_input = undefined;
   var id_el_input = '#id-input';
   
   var el_input_voice = undefined;
   var id_el_input_voice = '#id-input-voice';
   
   var el_container_logs = undefined;
   var id_el_container_logs = '#id-container-logs';
   
   
   var el_block_lights = undefined;
   var id_el_block_lights = '#id-block-lights';
   var el_block_cooling = undefined;
   var id_el_block_cooling = '#id-block-cooling';
   var el_block_heating = undefined;
   var id_el_block_heating = '#id-block-heating';
   
   
   var el_block_lights_state = undefined;
   var id_el_block_lights_state = '#id-block-lights-state';
   
   var el_block_cooling_state = undefined;
   var id_el_block_cooling_state = '#id-block-cooling-state';
   var el_block_cooling_value = undefined;
   var id_el_block_cooling_value = '#id-block-cooling-value';
   
   var el_block_heating_state = undefined;
   var id_el_block_heating_state = '#id-block-heating-state';
   var el_block_heating_value = undefined;
   var id_el_block_heating_value = '#id-block-heating-value';
}

//----------------------------------------------------------
function Init(){
   
   el_status = document.querySelector( id_el_status );
   el_input = document.querySelector( id_el_input );
   el_input_voice = document.querySelector( id_el_input_voice );
   
   el_container_logs = document.querySelector( id_el_container_logs );
   
   el_block_lights = document.querySelector( id_el_block_lights );
   el_block_cooling = document.querySelector( id_el_block_cooling );
   el_block_heating = document.querySelector( id_el_block_heating );
   
   el_block_lights_state = document.querySelector( id_el_block_lights_state );
   el_block_cooling_state = document.querySelector( id_el_block_cooling_state );
   el_block_cooling_value = document.querySelector( id_el_block_cooling_value );
   el_block_heating_state = document.querySelector( id_el_block_heating_state );
   el_block_heating_value = document.querySelector( id_el_block_heating_value );
   
   InitInput();
   InitStatus();
   InitInputVoice();
   InitControlEvents();
   
}//Init

Init();


//----------------------------------------------------------
function InitInput(){
   
   var OnKeyUp = function( event ){
      
      if( event.which !== 13 ){
         return;
      }//if
      
      event.preventDefault();
      
      var cmd = el_input.value;
      
      el_input.value = '';
      
      SetStatus( status_lines.processing_cmd + ' ' + '<' + cmd + '>' );
      
      CommandSend( cmd );
   };//OnKeyUp
   
   el_input.addEventListener( 'keyup', OnKeyUp );
}//InitInput
//----------------------------------------------------------
function InitStatus(){
   el_status.innerText = status_lines.standing_by;
}//InitStatus
//----------------------------------------------------------
function InitInputVoice(){
   
   var OnInputVoiceClick = function( event ){
      if( el_input_voice === undefined ){
         return;
      }//if
      
      StartRecognition();
   };//OnInputVoiceClick
   
   el_input_voice.addEventListener( 'click', OnInputVoiceClick );
}//InitInputVoice
//----------------------------------------------------------
function InitControlEvents(){
   
   var OnClick_ControlLights = function( event ){
      ToggleLights();
   };//OnClick_ControlLights
   
   var OnClick_ControlCooling = function( event ){
      ToggleCooling();
   };//OnClick_ControlCooling
   
   var OnClick_ControlHeating = function( event ){
      ToggleHeating();
   };//OnClick_ControlHeating
   
   el_block_lights.addEventListener( 'click', OnClick_ControlLights );
   el_block_cooling.addEventListener( 'click', OnClick_ControlCooling );
   el_block_heating.addEventListener( 'click', OnClick_ControlHeating );
   
}//InitControlEvents
//----------------------------------------------------------

//----------------------------------------------------------
function SetInput( text ){
   el_input.value = text;
}//SetInput
//----------------------------------------------------------
function SetStatus( msg ){
   el_status.innerText = msg;
}//SetStatus
//----------------------------------------------------------



//----------------------------------------------------------
function StartRecognition(){
   
   voice_recognition = new webkitSpeechRecognition();
   voice_recognition.continuous = false;
   voice_recognition.interimResults = false;
   
   voice_recognition.onstart = function( event ){
      SetStatus( status_lines.listening );
      //UpdateRec();
   };//onstart
   
   voice_recognition.onresult = function( event ){
      
      if( voice_recognition ){
         voice_recognition.onend = null;
      }//if
      
      var text = '';
      for( var i = event.resultIndex; i < event.results.length; ++i ){
         text += event.results[ i ][ 0 ].transcript;
      }//for
      SetInput( text );
      StopRecognition();
   };//onresult
   
   voice_recognition.onend = function(){
      StopRecognition();
   };//onend
   
   voice_recognition.lang = 'en-US';
   voice_recognition.start();
}//StartRecognition
//----------------------------------------------------------
function StopRecognition(){
   
   if( voice_recognition ){
      voice_recognition.stop();
      voice_recognition = null;
      
      SetStatus( status_lines.standing_by );
   }//if
   //UpdateRec();
}//StopRecognition
//----------------------------------------------------------
function SwitchRecognition(){
   if( voice_recognition ){
      StopRecognition();
   }else{
      StartRecognition();
   }//if
}//SwitchRecognition
//----------------------------------------------------------



//----------------------------------------------------------
function ToggleLights(){
   if( current_states.lights.state === CONTROL_STATES.ON ){
      DisableLights();
   }else{
      EnableLights();
   }//if
}//ToggleLights
//----------------------------------------------------------
function EnableLights(){
   current_states.lights.state = CONTROL_STATES.ON;
   el_block_lights_state.innerText = CONTROL_STATES.ON;
}//EnableLights
//----------------------------------------------------------
function DisableLights(){
   current_states.lights.state = CONTROL_STATES.OFF;
   el_block_lights_state.innerText = CONTROL_STATES.OFF;
}//DisableLights
//----------------------------------------------------------


//----------------------------------------------------------
function ToggleCooling(){
   if( current_states.cooling.state === CONTROL_STATES.ON ){
      DisableCooling();
   }else{
      EnableCooling();
   }//if
}//ToggleCooling
//----------------------------------------------------------
function EnableCooling(){
   current_states.cooling.state = CONTROL_STATES.ON;
   el_block_cooling_state.innerText = CONTROL_STATES.ON;
   el_block_cooling_value.innerHTML =
      current_states.cooling.value + symbol_degree;
}//EnableCooling
//----------------------------------------------------------
function DisableCooling(){
   current_states.cooling.state = CONTROL_STATES.OFF;
   el_block_cooling_state.innerText = CONTROL_STATES.OFF;
   el_block_cooling_value.innerText = '-';
}//DisableCooling
//----------------------------------------------------------


//----------------------------------------------------------
function ToggleHeating(){
   if( current_states.cooling.state === CONTROL_STATES.ON ){
      EnableHeating();
   }else{
      DisableHeating();
   }//if
}//ToggleHeating
//----------------------------------------------------------
function EnableHeating(){
   current_states.heating.state = CONTROL_STATES.ON;
   el_block_heating_state.innerText = CONTROL_STATES.ON;
   el_block_heating_value.innerHTML =
      current_states.heating.value + symbol_degree;
}//EnableHeating
//----------------------------------------------------------
function DisableHeating(){
   current_states.heating.state = CONTROL_STATES.OFF;
   el_block_heating_state.innerText = CONTROL_STATES.OFF;
   el_block_heating_value.innerText = '-';
}//DisableHeating
//----------------------------------------------------------


//----------------------------------------------------------
function CommandSend( cmd ){
   
   var msg = ' [Command send]: ' + cmd;
   SendToLog( msg );
   
   var data = {
      query    : cmd,
      lang     : 'en',
      sessionId: 'fantom-console-session'
   };//data
   
   transport.PostData( data, ProcessResponse );
   
}//CommandSend
//----------------------------------------------------------


//----------------------------------------------------------
function ProcessResponse( response ){
   
   var msg = ' [Server response]: ';
   
   if( response.result.speech ){
      msg += response.result.speech;
      SendToLog( msg );
   }else{
      msg += response.result.fulfillment.speech;
   }//else
   
   SendToLog( msg );
   
   var data = response.result.data;
   
   switch( data.action_name ){
      case 'lights_actions':
         ProcessActionLights( data );
         break;
   }//switch
   
}//ProcessResponse
//----------------------------------------------------------
function ProcessActionLights( data ){
   if( data.new_state === 'disable' ){
      EnableLights();
   }else if( data.new_state === 'enable' ){
      DisableLights();
   }//elseif
}//ProcessActionLights
//----------------------------------------------------------


//----------------------------------------------------------
function SendToLog( msg ){
   var line = GetDate() + msg;
   console.log( line );
   el_container_logs.innerHTML += line + '<br />';
}//SendToLog
//----------------------------------------------------------


//----------------------------------------------------------
function TransportWeb(){
   
   //-------------------------------------------------------
   this.PostData = function( data, callback ){
      
      var http_request = new XMLHttpRequest();
      
      http_request.onreadystatechange = function(){
         OnStateChanged( http_request, callback );
      };//onreadystatechange
      
      http_request.open( 'POST', base_url, true );
      http_request.setRequestHeader( 'Content-Type', 'application/json; charset=UTF-8' );
      http_request.setRequestHeader( 'Authorization', 'Bearer ' + access_token );
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
      
      callback( response_data );
   }//OnStateChanged
   //-------------------------------------------------------
   
}//class
//----------------------------------------------------------
var transport = new TransportWeb();
//----------------------------------------------------------


//----------------------------------------------------------
/** @return string */
function GetDate(){
   return ('[' + new Date().toISOString().slice( 11, -5 ) + ']');
}//GetDate
//----------------------------------------------------------

var a = {
   'id'       : '55fea1a0-3f1c-4e64-9e60-6f5801beef6d',
   'timestamp': '2017-07-19T14:15:29.898Z',
   'lang'     : 'en',
   'result'   : {
      'source'          : 'agent',
      'resolvedQuery'   : 'enable lights',
      'speech'          : '',
      'action'          : 'lights_actions',
      'actionIncomplete': false,
      'parameters'      : {
         'disable': '',
         'enable' : 'enable',
         'Light'  : []
      },
      'contexts'        : [],
      'metadata'        : {
         'intentId'                 : 'ca56d734-1267-4fca-a3ee-d60c2ddd38cb',
         'webhookUsed'              : 'true',
         'webhookForSlotFillingUsed': 'false',
         'intentName'               : 'Lights'
      },
      'fulfillment'     : {
         'speech'  : 'Action on lights accepted',
         'messages': [ {
            'type'  : 0,
            'speech': 'Action on lights accepted'
         } ]
      },
      'score'           : 1
   },
   'status'   : { 'code': 200, 'errorType': 'success' },
   'sessionId': 'eb30c4c2-76ae-48bf-a1c4-be2eb51c05ba'
};