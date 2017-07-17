var FCmp = {};

//--------------------------------------------------------
/**
 * @param callback_created
 * @param tag
 */
FCmp.InitComponent = function( callback_created, tag ){
	var proto = Object.create( HTMLElement.prototype );
	
	proto.createdCallback = callback_created;
	document.registerElement( tag, { prototype : proto } );
};//InitComponent

//------------------------------------------------------
/**
 * @param parent
 * @param template
 * @param tag
 * @returns {*}
 */
FCmp.ElementMakeRoot = function( parent, template, tag ){
	
	var root = parent.createShadowRoot();
	
	var content = document.importNode( template.content, true );
	
	if( window.ShadowDOMPolyfill ){
		WebComponents.ShadowCSS.shimStyling( content, tag );
	}//if
	
	root.appendChild( content );
	
	return root;
};//MakeRootEl

//--------------------------------------------------------
/**
 * @param element
 */
FCmp.ElementMakeEmpty = function( element ){
	while( element.hasChildNodes() ){
		element.removeChild( element.lastChild );
	}//while
};//InitComponent


//----------------------------------------------------------
/**
 * @param tag
 * @param data_item
 * @returns {*}
 */
FCmp.ElementCreate = function( tag, data_item ){
	
	var element = document.createElement( tag );
	
	if( element === null ){
		return null;
	}//if
	
	if( element._cmp === undefined ){
		return null;
	}//if
	
	element._cmp.SetData( data_item );
	element._cmp.Render();
	
	return element;
};//ElementCreate

//----------------------------------------------------------
/**
 * @param tag
 * @returns {*}
 */
FCmp.ElementCreateOnly = function( tag ){
	
	var element = document.createElement( tag );
	
	if( element === null ){
		return null;
	}//if
	
	return element;
};//ElementCreate

//----------------------------------------------------------
/**
 * @param container
 * @param data
 * @returns {*}
 */
FCmp.ElementAdd = function( container, data ){
	var element;
	
	if( data['tag'] === undefined ){
		return;
	}//if
	
	element = FCmp.ElementCreateOnly( data['tag'] );
	
	if( data['text'] !== undefined ){
		element.innerText = data['text'];
	}//if
	
	if( data['class_name'] !== undefined ){
		element.className = data['class_name'];
	}//if
	
	if( data['_data'] !== undefined ){
		element._cmp.SetData( data['_data'] );
	}//if
	
	if( data['_render'] !== undefined ){
		element._cmp.Render();
	}//if
	
	container.appendChild( element );
	
	return element;
};//ElementAdd

//----------------------------------------------------------
/**
 * @param object
 * @returns {*}
 */
FCmp.IsEmptyObject = function( object ){
	try{
		if( object.length === 0 ){
			return true;
		}//if no data
	}catch( exception ){ return true; }//try
	return false;
};