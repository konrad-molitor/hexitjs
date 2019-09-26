# HexIt.js
Simple script for creating animated hexagon background.
Tested in Google Chrome and Mozilla Firefox only.

## Demo
[Codepen](https://codepen.io/konrad-molitor/pen/KKPYzop)

## Installation

1. Download and place hexit.js file in desired location
2. Add following script tag to your document
    <script src="/path/to/hexit.js"></script>
3. Add "hexit" style to the desired element
    <div style="hexit">
4. Add background color property to your desired element to choose hexagons color.
5. Add Z-index property with value above 0 (zero) to all elements that needs to be above background

## How it works
Script creates canvas element with Z-Index 0, and absolute position. Size of the canvas being inherited from parent element.

## Requirements
Browser with ES6/HTML5 support.

## Dependencies
Written in pure JS. Has no dependecies.

## Adjusting parameters
* You can adjust size of hexagons by changing "diam" parameter in the hexit.js file.
* You can change desired FPS by changing targetFPS parameter (Note: This will cause all animation to slow down)
* Hexagon color can be changed by adding background color property to the target element.

## TODO
* Fix strange animation behiavor when window being resized
* Provide more convinient way to change parameters
* Code refactor

## PR Policy
PRs are welcome.

## Contacts
molitor.konrad on gmail

## License
This software comes under the terms of MIT License. 
Copyright (C) 2019 Ismail Valiev (Konrad Molitor)