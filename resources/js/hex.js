var GAMES = {};
GAMES.Proximity = {};
GAMES.Proximity.Constants = {};
GAMES.Proximity.Constants.highestValue = 20;

GAMES.Proximity.rollDice = function() {
	return Math.floor(
		Math.random() *
		GAMES.Proximity.Constants.highestValue
	) + 1;
};

GAMES.Proximity.rollRedDice = function() {
	var randDiceRoll = GAMES.Proximity.rollDice();
	$('#redDiceRoll').text(randDiceRoll);
	$('#redDiceRoll').data('roll', randDiceRoll);
};

GAMES.Proximity.updateScores = function() {

	var $redLand = $('#gameBoard div.hex.red');
	var redSoldiers = 0;
	var $blueLand = $('#gameBoard div.hex.blue');
	var blueSoldiers = 0;

	// Update red scores	
	$('#red_land').text($redLand.length);
	$redLand.each(function() {
		redSoldiers += $(this).data('soldiers');
	});
	$('#red_soldiers').text(redSoldiers);
	
	
	// Update blue scores	
	$('#blue_land').text($blueLand.length);
	$blueLand.each(function() {
		blueSoldiers += $(this).data('soldiers');
	});
	$('#blue_soldiers').text(blueSoldiers);
	
};

GAMES.Proximity.drawBoard = function() {
	var $gameBoard = $('#gameBoard');
	//if the board hasn't already been drawn...draw it.
	if ($('#gameBoard .hex-row').length < 10) {
		$gameBoard.empty();
		var hexRowCss = [
			'hex-row',
			'hex-row even'
		]
		//draw the container rows...
		for (var row = 1; row <= 10; row++) {
			var $newRow = $('<div></div>').
				addClass(hexRowCss[row % 2]).
				attr('row', row.toString());
			$gameBoard.append($newRow);
			//draw the individual land pieces for the row.
			for (var column = 1; column <= 12; column++) {
				var $newLand = $('<div></div>').
					addClass('hex').
					attr('row', row.toString()).
					attr('column', column.toString());
				$gameBoard.
					find('div.hex-row[row=' + row.toString() + ']').
					append($newLand);
			}
		}
	}
}

GAMES.Proximity.setupGame = function(options) {

	GAMES.Proximity.drawBoard();
	//reset scores.
	$('#blue_soldiers').data('count', 0);
	$('#blue_land').data('count', 0);
	$('#red_soldiers').data('count', 0);
	$('#red_land').data('count', 0);
	
	var landMass = {};
	landMass['all'] = 1;
	landMass['most'] = 8;
	landMass['some'] = 16;

	//reset each hexagon land piece.
	$('#gameBoard .hex').each(function() {
		var $this = $(this);
		$this.removeClass('blue red');
		$this.data("", 0);
		
		var randNumber = GAMES.Proximity.rollDice();
		
		//randomize available spaces on the board.
		if (randNumber >= landMass[options.landMass]) {
			$this.attr('available', "true");
		} else {
			$this.addClass('notused');
			$this.attr('available', "false");
		}
	});
	
	GAMES.Proximity.rollRedDice();
	GAMES.Proximity.updateScores();
};

GAMES.Proximity.conquerSpace = function($space, team, armySize) {
	$space.addClass(team);
	$space.text(armySize);
	$space.data("soldiers", armySize);
	$space.attr("available", "false");
	var $nearbyLand = $space.landPiece({
		action: 'getSurroundingNotAvailable'
	});
	$nearbyLand.each(function() {
		$this = $(this);
		if ($this.data("soldiers") && 
			$this.data("soldiers") < $space.data("soldiers"))
		{
				$this.removeClass('red').
					removeClass('blue').
					addClass(team);
		}
	});
	
};

GAMES.Proximity.registerLandClicks = function() {
	$('.hex').click(function() {
		$this = $(this);
		
		//don't let them click on spaces they're not supposed to...
		if ($this.attr('available') == "false") {
			return false;
		}
		
		var redRoll = $('#redDiceRoll').data('roll');
		GAMES.Proximity.conquerSpace($this, 'red', redRoll);
		
		//search for all open/available land
		var $availableLand = $('.hex[available=true]');
		//if there is available land spaces to choose...
		if ($availableLand.length > 0) {
			var randDiceRoll = GAMES.Proximity.rollDice();
			var randHex = Math.floor(Math.random() * $availableLand.length);
			var $newBlue = $($availableLand.get(randHex));
			GAMES.Proximity.conquerSpace($newBlue, 'blue', randDiceRoll);
		}
		
		GAMES.Proximity.updateScores();
		
		if ($availableLand.length <= 1) {
			alert('Game over!');
		} else {
			GAMES.Proximity.rollRedDice();
		}
		
	});
};


$(document).ready(function() {

	GAMES.Proximity.setupGame({
		'landMass': 'most'
	});
	GAMES.Proximity.registerLandClicks();
	
});