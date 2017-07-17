//----------------------------------------------------------
//ENTRY
{
   OnAppStarted();
   
   process.title = 'T:K-V-STORAGE';
   process.name = 'N:K-V-STORAGE';
   process.on( 'exit', OnAppEnded );
   
   //-------------------------------------------------------
   function OnAppStarted(){
      process.stdout.write( '\u001b[2J\u001b[0;0H' );
      console.log( '[app.js] OnAppStarted()' );
   }//OnAppStarted
   //-------------------------------------------------------
   function OnAppEnded(){
      console.log( '\n' );
      console.log( '[app.js] OnAppEnded()' );
      console.log( '\n' );
   }//OnAppEnded
   //-------------------------------------------------------
}//ENTRY


//----------------------------------------------------------
//EXTERNALS
{
   var http = require( 'http' );
   var path = require( 'path' );
   var fs = require( 'fs' );
   var App = require( 'actions-on-google' ).ApiAiApp;
   
   //log with a timestamp
   var log = require( './log.js' );
   
   //log with a timestamp
   var IsEmpty = require( './is-empty.js' );
}//EXTERNALS


//----------------------------------------------------------
//INITIALIZATIONS

//----------------------------------------------------------
//constants
{
   var LOG_TAG = '[app.js]:';
   
   var FILE_TYPE_REGEXP = {
      CSS       : /.css$/,
      JAVASCRIPT: /.js$/,
      HTML      : /.html$/
   };//FILE_TYPE_REGEXP
   
   
   var STATUS_CODE = {
      OK         : 200,
      BAD_REQUEST: 400,
      NOT_FOUND  : 404
   };//STATUS_CODE
   
   var CONTENT_TYPES = {
      HTML      : { 'Content-Type': 'text/html' },
      CSS       : { 'Content-Type': 'text/css' },
      JAVASCRIPT: { 'Content-Type': 'application/javascript' },
      TEXT      : { 'Content-Type': 'text/plain' },
      JSON      : { 'Content-Type': 'application/json' }
   };//CONTENT_TYPES
}//constants
//----------------------------------------------------------

var server_data = [];

//----------------------------------------------------------
//init request handlers
//----------------------------------------------------------
function GetRequestHandlers(){
   var request_handlers = {};
   
   //request_handlers[ '/update' ] = Update;
   //request_handlers[ '/api' ] = OnAPI;
   
   return request_handlers;
}//GetRequestHandlers
//----------------------------------------------------------
var request_handlers = GetRequestHandlers();
//----------------------------------------------------------


//----------------------------------------------------------
//start web server
//var port = (process.env.PORT || 5000);
//http.createServer( OnRequest ).listen( port );
//----------------------------------------------------------
function OnRequest( request, response ){
   
   log( LOG_TAG, request.url );
   
   var request_params = {
      request_obj       : request,
      response_obj      : response,
      callback_on_result: Respond_Result
   };//params
   
   if( request_handlers[ request.url ] === undefined ){
      //if the request has no handler
      ProcessWebpageFiles( request, response );
      return;
   }//if
   
   if( request.url === '/api' ){
      log( LOG_TAG, '[1]' );
      OnAPI( request, response );
      return;
   }//if
   
   var RequestHandler = request_handlers[ request.url ];
   Request_GetData( request_params, RequestHandler );
}//WebServer
//----------------------------------------------------------
function ProcessWebpageFiles( request, response ){
   
   var file_path = '';
   var file_encoding = 'UTF-8';
   
   if( request.url === '/' ){
      file_path = './public/demo.html';
      fs.readFile( file_path, file_encoding, function( error, data ){
         OnFileRead( error, data, CONTENT_TYPES.HTML, response );
      } );
      return;
   }//if root
   
   file_path = path.join( './public', request.url );
   
   for( var ftype in FILE_TYPE_REGEXP ){
      if( !FILE_TYPE_REGEXP.hasOwnProperty( ftype ) ){
         continue;
      }//if
      
      if( request.url.match( FILE_TYPE_REGEXP[ ftype ] ) ){
         fs.readFile( file_path, file_encoding, function( error, data ){
            OnFileRead( error, data, CONTENT_TYPES[ ftype ], response );
         } );
         return;
      }//if match
   }//for
   
   Respond_WrongRequest( request, response );
}//ProcessWebpageFiles
//----------------------------------------------------------
function OnFileRead( error, data, type, response ){
   
   if( error !== null ){
      response.writeHead(
         STATUS_CODE.BAD_REQUEST, CONTENT_TYPES.TEXT );
      response.end( data );
      return;
   }//if
   
   response.writeHead( STATUS_CODE.OK, type );
   response.end( data );
}//OnFileRead
//----------------------------------------------------------


//----------------------------------------------------------
function Respond_WrongRequest( request, response ){
   
   var status_code = STATUS_CODE.NOT_FOUND;
   var content_type = CONTENT_TYPES.TEXT;
   var response_msg = '404 Wrong request';
   
   response.writeHead( status_code, content_type );
   response.end( response_msg );
}//Respond_WrongRequest
//----------------------------------------------------------
function Respond_Result( request_params ){
   
   var status_code = STATUS_CODE.OK;
   var content_type = CONTENT_TYPES.JSON;
   var response_msg = JSON.stringify( request_params.response_data );
   
   request_params.response_obj.writeHead( status_code, content_type );
   request_params.response_obj.end( response_msg );
}//Respond_Result
//----------------------------------------------------------
function Request_GetData( request_params, callback ){
   
   var request_data_json = '';
   
   var OnDataGoing = function( data_chunk ){
      request_data_json += data_chunk;
   };//OnDataGoing
   
   var OnDataReceived = function(){
      
      try{
         request_params.request_data = JSON.parse( request_data_json );
      }catch( exception ){
         request_params.request_data = {};
      }//try
      
      callback( request_params );
   };//OnDataGoing
   
   request_params.request_obj.on( 'data', OnDataGoing );
   request_params.request_obj.on( 'end', OnDataReceived );
}//ReceiveRequest
//----------------------------------------------------------


//----------------------------------------------------------
function Update( request_params ){
   
   request_params.response_data = {
      requests_arr: server_data
   };
   request_params.callback_on_result( request_params );
}//Test
//----------------------------------------------------------
function Save( request_params ){
   
   var saved_data = {
      url         : request_params.request_obj.url,
      request_data: request_params.request_data
   };
   
   var date_str = '[' + new Date().toISOString().slice( 11, -5 ) + ']';
   
   var value = date_str + JSON.stringify( saved_data );
   
   
   if( server_data.length > 10 ){
      server_data = [];
   }//if
   
   server_data.push( value );
   
   request_params.response_data = value;
   
   request_params.callback_on_result( request_params );
   
}//Save
//----------------------------------------------------------

//function OnAPI( request, response ){
exports.GActionWithApiAI = function( request, response ){
   
   log( LOG_TAG, '[3]' );
   const app = new App( { request, response } );
   
   log( LOG_TAG, '[4]' );
   
   var TellFact = function( app ){
      var fact = 'DEFAULT_FACT';
      
      var fact_category = app.getArgument( 'facts-category' );
      if( fact_category === 'history' ){
         fact = 'fact_history';//getRandomHistoryFact();
      }else if( fact_category === 'other' ){
         fact = 'fact_other';//getRandomOtherFact();
      }//else
      
      var is_screen_available = app.hasSurfaceCapability(
         app.SurfaceCapabilities.SCREEN_OUTPUT
      );
      
      if( is_screen_available ){
         app.ask( '[screen available]:' + fact );
      }else{
         app.ask( '[screen NOT available]:' + fact );
      }//else
      
   };//TellFact
   
   //const action_map = new Map();
   //action_map.set( 'tell_fact', TellFact );
   
   //app.handleRequest( action_map );
   
   app.ask( 'Hey' );
   
};//OnAPI
//----------------------------------------------------------