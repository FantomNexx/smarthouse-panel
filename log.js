var log = function(){
	var date_str = '[' + new Date().toISOString().slice( 11, -5 ) + ']';
	Array.prototype.unshift.call( arguments, date_str );
	return console.log.apply( console, arguments );
};//log

module.exports = log;