# games-html-proximity

### Description:
An HTML remake of the flash game Proximity


### TODO List:
* Add Game Setup configuration screen
* Add LANDMASS configuration option
* Add VICTORY CONDITION option
* Add ON TAKEOVER options (Neighboring Territories & Enemy Territories)
* Add player configuration options (Red, Blue, Human, Computer etc)
* MASSIVELY improve computer opponent capabilities.
* Clean up JavaScript code a little. Starting to look messy.
* Change end game 'Game Over' alert to a nicer 'who won' dialog pop up.
* Add 'computer thinking' notification & screen blocking?


### Weird odd notes:
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
