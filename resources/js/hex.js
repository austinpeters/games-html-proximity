/*
*
* I don't like prototyping Array...
* but I like how much cleaner it can
* make code feel later on.
*
*/
Array.prototype.next = function() {
	if (this.current >= (this.length - 1)) {
		this.current = 0;
	} else {
		++this.current;
	}
	return this[this.current];
};
Array.prototype.current = 0;

var GAMES = {};
GAMES.Proximity = {};
GAMES.Proximity.Options = {};
GAMES.Proximity.Options.landMass = ['all','most','some'];
GAMES.Proximity.Options.victoryCondition = ['most land','most soldiers'];

GAMES.Proximity.Constants = {};
GAMES.Proximity.Constants.highestValue = 20;
GAMES.Proximity.Constants.cssHexColors = "notconquered red blue";

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
	$('#red-land').text($redLand.length);
	$redLand.each(function() {
		redSoldiers += $(this).data('soldiers');
	});
	$('#red-soldiers').text(redSoldiers);
	
	
	// Update blue scores	
	$('#blue-land').text($blueLand.length);
	$blueLand.each(function() {
		blueSoldiers += $(this).data('soldiers');
	});
	$('#blue-soldiers').text(blueSoldiers);
	
};

GAMES.Proximity.drawBoard = function() {
	var $gameBoard = $('#gameBoard');
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

GAMES.Proximity.setupGame = function(options) {

	if (options.configFromHTML) {
		$('.config-options').each(function() {
			var $this = $(this);
			options[$this.attr('config')] = $this.text();
		});
	}

	GAMES.Proximity.drawBoard();
	//reset scores.
	$('#blue-soldiers').data('count', 0);
	$('#blue-land').data('count', 0);
	$('#red-soldiers').data('count', 0);
	$('#red-land').data('count', 0);
	
	var landMass = {};
	landMass['all'] = 1;
	landMass['most'] = 8;
	landMass['some'] = 16;

	//reset each hexagon land piece.
	$('#gameBoard .hex').each(function() {
		var $this = $(this);
		$this.
			removeClass(GAMES.Proximity.Constants.cssHexColors).
			data("soldiers", 0).
			text("");
		
		var randNumber = GAMES.Proximity.rollDice();
		
		//randomize available spaces on the board.
		if (randNumber >= landMass[options.landMass]) {
			$this.attr('available', "true");
			$this.addClass('notconquered');
		} else {
			$this.addClass('notgamespace');
			$this.attr('available', "false");
		}
	});
	
	GAMES.Proximity.rollRedDice();
	GAMES.Proximity.updateScores();
};

GAMES.Proximity.conquerSpace = function($space, team, armySize) {
	$space.
		removeClass(GAMES.Proximity.Constants.cssHexColors).
		addClass(team).
		text(armySize).
		data("soldiers", armySize).
		attr("available", "false");
	var $nearbyLand = $space.landPiece({
		action: 'getSurroundingNotAvailable'
	});
	$nearbyLand.each(function() {
		$this = $(this);
		if ($this.data("soldiers") && 
			$this.data("soldiers") < $space.data("soldiers"))
		{
				$this.
					removeClass(GAMES.Proximity.Constants.cssHexColors).
					addClass(team);
		}
	});
	
};

GAMES.Proximity.registerLandClicks = function() {
	$('.hex').click(function() {
		var $this = $(this);
		
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
		
		//end game...
		if ($availableLand.length <= 1) {
			//TODO: Update this once victory condition is configurable.
			var winner = (
				$('#gameBoard div.hex.red').length >= 
				$('#gameBoard div.hex.blue').length
			) ? 'Red' : 'Blue';
			$("#game-winner").text(winner);
			$('#dialog-game-end').dialog('open');
			
		} else {
			GAMES.Proximity.rollRedDice();
		}
		
	});
};


$(document).ready(function() {

	$('#dialog-game-end').dialog({
		modal: true,
		closeText: "Play!",
		autoOpen: false,
		close: function() {
			$('#dialog-game-config').dialog('open');
		}
	});

	$('.config-options').on('click', function() {
		var $this = $(this);
		$this.text(
			GAMES.
			Proximity.
			Options[
				$this.attr('config')
			].next()
		);
	});

	$('#dialog-game-config').dialog({
		modal: true,
		closeText: "Play!",
		close: function() {
			GAMES.Proximity.setupGame({
				'configFromHTML': true
			});
			GAMES.Proximity.registerLandClicks();
		}
	});
	
});