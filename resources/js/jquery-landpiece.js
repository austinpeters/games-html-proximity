(function ( $ ) {
 
    $.fn.landPiece = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
            action: "getSurroundingNotAvailable",
        }, options );
		
		var column = parseInt(this.first().attr('column'));
		var row = parseInt(this.first().attr('row'));
		var returnLand = [this];
		
		switch (options.action) {
			case "getSurroundingNotAvailable":
			
				var columnOffset = (row % 2 == 0) ? -1 : 0;
				var cssHex = 'div.hex';
				var notAvailable = '[available="false"]';
				var notUsed = '.notused';
				var topRow = '[row="' + (row - 1) + '"]';
				var middleRow = '[row="' + (row) + '"]';
				var bottomRow = '[row="' + (row + 1) + '"]';
				var middleLeft = '[column="' + (column - 1) + '"]';
				var middleRight = '[column="' + (column + 1) + '"]';
				var otherLeft = '[column="' + (column + columnOffset) + '"]';
				var otherRight = '[column="' + (column + columnOffset + 1) + '"]';
				
				var landTopLeft = $(cssHex + topRow + otherLeft + notAvailable).
					not(notUsed);
				var landTopRight = $(cssHex + topRow + otherRight + notAvailable).
					not(notUsed);
				var landLeft = $(cssHex + middleRow + middleLeft + notAvailable).
					not(notUsed);
				var landRight = $(cssHex + middleRow + middleRight + notAvailable).
					not(notUsed);
				var landBottomLeft = $(cssHex + bottomRow + otherLeft + notAvailable).
					not(notUsed);
				var landBottomRight = $(cssHex + bottomRow + otherRight + notAvailable).
					not(notUsed);
				returnLand = [
					landTopRight,
					landRight,
					landBottomRight,
					landBottomLeft,
					landLeft,
					landTopLeft
				];

				break;
		}
		
        return $(returnLand).map (function () {return this.toArray(); } );
		
    };
 
}( jQuery ));