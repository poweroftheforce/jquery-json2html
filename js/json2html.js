(function($) {
	/*
		jQuery plugin: json2HTML( obj )
		this method I created to try and
		dynamically create HTML from a json
		type structure.  Using json, you create, setup and append
		elements to whatever $( [MATCHED_ELEMENTS] )
		EXAMPLE:
			You always start with an array.
			var html = [];
			// var html = [{}]; inside the array are objects {}
			// These objects have properties that tell the plugin what to do.
			// you can think of these properties as you would with jQuery plugin options.
			nodeName - This is simply "createElement" - nodeName: 'div'
			append - Has to be an array - [] (with objects inside, yay!!) [{}] - this is what makes it possible to have mutliple versions of some element.
			html, css, attr, or any other jQuery method can be used in between nodeName AND append
				EXAMPLE STRUCTURE:
					// create an array with one div that has "Hello World" as it's innerHTML
					var html = [ { nodeName: 'div', html: 'Hello World' } ];
					$('body').json2HTML(html);
					// let's say you wanted 2 div as siblings
					var html = [
						{ nodeName: 'div', html: 'Hello World' },
						{ nodeName: 'div', html: 'Hello World, I am div #2...it's as simple as adding a comma and another set of curly brackets with nodeName: and html: properties!' }
					];
					$('body').json2HTML(html);
	*/
	$.fn.json2HTML = function( obj ) {
		var defaults = {};
		var options = $.extend( defaults, options );
		return this.each(function( i ) {
			var previousElement = this;
			function json2HTML( obj ) {
				for ( var i=0; i<obj.length; i++ ) {
					for ( var prop in obj[ i ] ) {
						switch ( prop ) {
							case 'eval': {
								eval( obj[ i ][ prop ] );
								break;
							}
							case 'node': {
								var node = document.createElement( obj[ i ][ prop ] );
								$( previousElement ).append( node );
								break;
							}
							case 'append': {
								previousElement = node;
								json2HTML( obj[ i ][ prop ] );
								break;
							}
							case 'data': {
								var data = obj[ i ][ prop ];
								for ( prop in data ) {
									$( node ).data( prop, data[ prop ] );
								}
								break;
							}
							case 'id': {
								$( node ).attr( 'id', obj[ i ][ prop ] );
								break;
							}
							case 'if': {
								eval( obj[ i ][ prop ] );
								break;
							}
							case 'href': {
								$( node ).attr( 'href', obj[ i ][ prop ] );
								break;
							}
							case 'return': {
								return eval( obj[ i ][ prop ] );
								break;
							}
							case 'addClass':
							case 'html':
							case 'attr':
							case 'css': {
								eval( '$(node).' + prop + '(obj[i][prop]);' );
								break;
							}
							/* default - click, mouseover, my_plugin */
							default: {
								eval( '$(node).' + prop + '(' + obj[ i ][ prop ] + ');' );
								break;
							}
						}
					}

				}
				if ( node ) {
					previousElement = node.parentNode.parentNode;
				}
			}
			json2HTML(obj);
		});
	};
})(jQuery);
