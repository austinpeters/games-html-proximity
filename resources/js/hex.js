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

//Setup selectable option values
var GAMES = {};
GAMES.Proximity = {};
GAMES.Proximity.Options = {};
GAMES.Proximity.Options.landMass = ['all','most','some'];
GAMES.Proximity.Options.victoryCondition = ['most land','most soldiers'];

//Setup constants...
GAMES.Proximity.Constants = {};
GAMES.Proximity.Constants.highestValue = 20;
GAMES.Proximity.Constants.cssHexColors = "notconquered red blue";

/*
*	GAMES.Proximity.rollDice
*		This function gets a random number
*		between 1 and constant highestValue.
*/
GAMES.Proximity.rollDice = function() {
	return Math.floor(
		Math.random() *
		GAMES.Proximity.Constants.highestValue
	) + 1;
};

/*
*	GAMES.Proximity.rollRedDice
*		This function chooses the Red dice roll and
*		then displays it on screen for the user to see
*/
GAMES.Proximity.rollRedDice = function() {
	var randDiceRoll = GAMES.Proximity.rollDice();
	$('#redDiceRoll').text(randDiceRoll);
	$('#redDiceRoll').data('roll', randDiceRoll);
};

/*
*	GAMES.Proximity.updateScores
*		This function calculates the soldiers and land
*		values for both Red and Blue teams and then
*		displays them on screen.
*/
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

/*
*	GAMES.Proximity.drawBoard
*		Wipes out the contents inside of gameBoard div
*		and then recreates each hex game space alternating
*		between even and odd rows. row and column attributes
*		are applied to each individual hex/game space.
*/
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

	//If configFromHTML is true, directly take the
	//like-named options from the HTML elements and
	//set the options object variable with them.
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

/*
*	GAMES.Proximity.conquerSpace
*		Sets the specified game space / land ($space) to the
*		color of the team (team var) conquering it along with
*		setting data attributes for the space and text to showHelp
*		number of soldiers on the land space. Near by land spaces
*		that have already been conquered are discovered, and if
*		the current spaces soldiers are > than the already conquered
*		space, that conquered space goes to the new team color.
*/
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
		
		//end game...?
		if ($availableLand.length <= 1) {
			var winner;
			var victoryCondition = $('.config-options[config="victoryCondition"]').text();
			var redCount = {};
			var blueCount = {};
			redCount.land = parseInt($('#red-land').text());
			redCount.soldiers = parseInt($('#red-soldiers').text());
			blueCount.land = parseInt($('#blue-land').text());
			blueCount.soldiers = parseInt($('#blue-soldiers').text());
			
			if (victoryCondition == "most land") {
				if (redCount.land > blueCount.land) {
					winner = 'Red';
				} else if (blueCount.land > redCount.land) {
					winner = 'Blue';
				} else {
					winner = 'No one. Tie.';
				}
			} else {
				if (redCount.soldiers > blueCount.soldiers) {
					winner = 'Red';
				} else if (blueCount.soldiers > redCount.soldiers) {
					winner = 'Blue';
				} else {
					winner = 'No one. Tie.';
				}
			}
			
			$("#game-winner").text(winner);
			$('#dialog-game-end').dialog('open');
			
		//not end game...
		} else {
			GAMES.Proximity.rollRedDice();
		}
		
	});
};


/*
*	PAGELOAD:
*		1. Configure dialog boxes
*		2. Setup click action for configuration options in game setup dialog box.
*		3. Pop up game configuration dialog box.
*/
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