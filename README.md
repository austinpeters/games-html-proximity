HTML Proximity
==============
*https://github.com/austinpeters/games-html-proximity*

## Description:
This is a HTML remake of the flash game Proximity.

## Version history
* _v0.02.00_ - **2015-03-28**:
>1. Added TODO 4.
>2. Decided against adding TODO number 10.
>3. Formatted this README a little more.
>4. Basically completed TODO 11.

* _v0.01.02_ - **2015-03-25**:
>1. Added HTML tag to force IE to render with latest version.

* _v0.01.01_ - **2015-03-23**: 
>1. Completed TODO 3

* _v0.01.00_ - **2015-03-22**: 
>1. Added TODOs 11-15
>2. Completed TODO 13
>3. Half completed TODO 11
>4. Completed TODO 9
>5. Completed TODO 1
>6. Completed TODO 2

* _v0.00.02_ - **2015-03-21**: 
>1. Completed TODO item number 7.

* _v0.00.01_ - **2015-03-21**:
>1. First commit.



## TODO List:
1. ~~Add Game Setup configuration screen~~
2. ~~Add LANDMASS configuration option~~
3. ~~Add VICTORY CONDITION option~~
4. ~~Add ON TAKEOVER options (Neighboring Territories & Enemy Territories)~~
5. Add player configuration options (Red, Blue, Human, Computer etc)
6. Add computer difficulty options. Currently computer 'AI' is random picking.
7. ~~Fix GAMES.Proximity.conquerSpace logic.~~
 ~~Nearby land should only be conquered if current space soldiers > surrounding space soldiers.~~
8. Clean up JavaScript code a little. Starting to look messy.
9. ~~Change end game 'Game Over' alert to a nicer 'who won' dialog pop up.~~
10. ~~Add 'computer thinking' notification & screen blocking?~~
11. ~~Clean up the inline styles & abusive br tags.~~
12. Add code commenting.
13. ~~Clean up the use of !important css declarations.~~
14. Massively improve disgusting styling/theme issues. Dialog boxes look terrible.
15. Add twitter bootstap to make this more responsive for mobile devices?

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
