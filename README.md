HTML Proximity
==============
*https://github.com/austinpeters/games-html-proximity*

## Description:
This is a HTML remake of the flash game Proximity.

## Version history
* _v0.00.01_ - **2015-03-21**: First commit.
* _v0.00.02_ - **2015-03-21**: Completed TODO item number 7.


## TODO List:
1. Add Game Setup configuration screen
2. Add LANDMASS configuration option
3. Add VICTORY CONDITION option
4. Add ON TAKEOVER options (Neighboring Territories & Enemy Territories)
5. Add player configuration options (Red, Blue, Human, Computer etc)
6. MASSIVELY improve computer opponent capabilities.
7. ~~Fix GAMES.Proximity.conquerSpace logic.~~
 ~~Nearby land should only be conquered if current space soldiers > surrounding space soldiers.~~
8. Clean up JavaScript code a little. Starting to look messy.
9. Change end game 'Game Over' alert to a nicer 'who won' dialog pop up.
10. Add 'computer thinking' notification & screen blocking?

## Code credits:
1. CSS code for generating the hexagons: http://jtauber.github.io/articles/css-hexagon.html

## Weird odd notes:
Note on surrounding hex column/row information:
```
[3-5] => {
	[2-5],[2-6],
	[3-4],[3-6],
	[4-5],[4-6]
}

[4-6] => {
	[3-5],[3-6],
	[4-5],[4-7],
	[5-5],[5-6]	
}
```
