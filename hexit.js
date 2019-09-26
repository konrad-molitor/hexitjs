/*

The MIT License

Copyright (c) 2019 Ismail Valiev (Konrad Molitor), https://github.com/konrad-molitor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/



const canvas = document.createElement('canvas');
canvas.style.zIndex = 0;
canvas.style.position = 'absolute';
canvas.style.border = '0px';

const diam = 200,											// outer circle diameter
	 innerRadius = (Math.sqrt(3) * (diam / 2)) / 2,			// inner circle radius
	 innerOffset = (diam / 2) - innerRadius,				// distance between outer circle and hexagon side
	 animated = [],	
	 animatedCount = 3,										// animated hexagons count
	 targetFPS = 60;										// target frames per second
let hexagons = [],
	rgbaColor = [0, 50, 70, 1],								// color in [red, blue, green, alpha] format
	color = 'rgba(' + rgbaColor.join(',') + ')',			// css string color
	animationRequestId = null,
	animationTimeoutId = null;
	


window.onload = function(){
	const el = document.querySelector(".hexit");
	rgbaColor = parseElementBackgroundColor(el);
	el.appendChild(canvas);
	initiateDraw(canvas, el);
}

window.onresize = function() {
	const ctx = canvas.getContext('2d');
	const el = document.querySelector(".hexit");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (animationTimeoutId)  clearTimeout(animationTimeoutId);
	if (animationRequestId)  window.cancelAnimationFrame(animationRequestId);
	initiateDraw(canvas, el);
}

function parseElementBackgroundColor(el){
	elBackgroundColorString = window.getComputedStyle(el, null).getPropertyValue('background-color');
	rgbString = elBackgroundColorString.split('(')[1].trim();
	rgbFactorsString = rgbString.split(',');
	let rgbFactors = rgbFactorsString.map(item => Number.parseInt(item));
	return rgbFactors;
}


function initiateDraw(canvas, el){
	canvas.width = el.clientWidth;
	canvas.height = el.clientHeight;
	const centers = hexCenters(el.offsetLeft, el.offsetTop, el.clientWidth, el.clientHeight);
	hexagons = centers.map(
		function(center, i) {
			let corners = hexCorners(center);
			return {corners: corners, colors: rgbaColor};
		}
	)
	for (hex of hexagons) {
		drawHex(hex.corners, hex.colors);
	}
	animationRequestId = window.requestAnimationFrame(animationStep);
}

function animationStep(timestamp){
	animationTimeoutId = setTimeout(function(){
		if (animated.length < animatedCount) {
			while (animated.length < animatedCount){
				let rndIdx;
				do {
					rndIdx = Math.floor(Math.random() * hexagons.length);
				} while (animated.map(item => item.idx).includes(rndIdx)) ;
				let targetColor = [];
				for (let i = 0; i < 3; i++){
					let rndColor = Math.floor(Math.random() * 255);
					targetColor.push(rndColor);
				}
				animated.push({idx: rndIdx, ascend: true, targetColor: targetColor});
			}
		}
		animated.forEach(function(item, i){
			let hex = hexagons[item.idx];
			if (item.ascend && !compareArrays(hex.colors.slice(0, 3), item.targetColor)) {
				let rgbColors = hex.colors.slice(0,3);
				let newRGBColors = compareAndEqualize(rgbColors, item.targetColor, 1);
				let newColors = [...newRGBColors, 1];
				hexagons[item.idx].colors = newColors;
			}
			if (item.ascend && compareArrays(hex.colors.slice(0,3), item.targetColor)){
				animated[i].ascend = false;
			}
			if (!item.ascend && !compareArrays(hex.colors.slice(0,3), rgbaColor.slice(0,3))) {
				let rgbColors = hex.colors.slice(0,3);
				let oldRGBColors = rgbaColor.slice(0, 3);
				let newRGBColors = compareAndEqualize(rgbColors, oldRGBColors, 2)
				let newColors = [...newRGBColors, 1];
				hexagons[item.idx].colors = newColors;
			}
			if (!item.ascend && compareArrays(hex.colors.slice(0,3), rgbaColor.slice(0,3))) {
				animated.splice(i, 1);
			}
		})
		hexagons.forEach(function(hex){
			drawHex(hex.corners, hex.colors)
		});
		window.requestAnimationFrame(animationStep);
	}, 1000 / targetFPS)
}

function compareAndEqualize(arr1, arr2, incrementFactor){
	for (let i = 0; i < arr1.length; i++){
		if (arr1[i] !== arr2[i]) {
			if (Math.abs(arr1[i] - arr2[i]) < Math.abs(incrementFactor)) {
				arr1[i] = arr2[i];
			}
			if (arr1[i] > arr2[i]) {
				arr1[i] -= incrementFactor;
			} else if (arr1[i] < arr2[i]) {
				arr1[i] += incrementFactor;
			}
		}
	}
	return arr1;
}

function compareArrays(arr1, arr2) {
	for (let i=0; i < arr1.length; i++){
		if (arr1[i] !== arr2[i]) return false;
	}
	return true;
}

function hexCenters(elementStartX, elementStartY, elementEndX, elementEndY){
	let centers = [];
	let hasOffset = false;
	for (let y = elementStartY - (Math.sqrt(3) * (diam / 2)) - innerOffset * 2; y < elementEndY + (Math.sqrt(3) * (diam / 2)) - innerOffset * 2; y += (Math.sqrt(3) * (diam / 2)) - innerOffset * 2 ) {
		 for (let x = elementStartX - diam - innerOffset * 2; x < elementEndX + diam - innerOffset * 2; x+= diam - innerOffset * 2  ) {
			let newCenter = {};
			if (hasOffset) {
				newCenter = {x: x + diam / 2 - innerOffset, y: y}
			}
			else {
				newCenter = {x, y};
			}
			centers.push(newCenter);
			
		}
		hasOffset = !hasOffset;
	}
	return centers;
}

function hexCorners (center) {
	let corners = [];
/*	let ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillRect(center.x, center.y, 1, 1);
	ctx.strokeStyle = 'rgb(255,0,0)';
	ctx.beginPath();
	ctx.arc(center.x, center.y, diam / 2, 0, 2 * Math.PI, false);
	ctx.stroke();*/
	corners.push({x: center.x, y: center.y + diam / 2});
	corners.push({x: center.x + innerRadius, y: center.y + diam / 4});
	corners.push({x: center.x + innerRadius, y: center.y - diam / 4});
	corners.push({x: center.x, y: center.y - diam / 2});
	corners.push({x: center.x - innerRadius, y: center.y - diam / 4});
	corners.push({x: center.x - innerRadius, y: center.y + diam / 4});
	return corners;
}

function drawHex(corners, color = [0, 50, 70, 1]) {
	let ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.moveTo(corners[0].x, corners[0].y);
	for (let i = 0; i < corners.length; i++) {
		ctx.lineTo(corners[i].x, corners[i].y);
	}
	ctx.lineTo(corners[0].x, corners[0].y);
	ctx.lineTo(corners[corners.length-1].x, corners[corners.length-1].y);
	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.lineWidth = 1;
	ctx.stroke();
 	ctx.fillStyle = 'rgba(' + color.join(',') +')' ;
 	ctx.fill();	
}