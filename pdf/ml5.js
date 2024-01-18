let handpose;
let video;
let predictions = [];
let GoSignFLG = false;

function setup() {
	createCanvas( 640, 480 );
	video = createCapture( VIDEO );
	video.size( width, height );
	handpose = ml5.handpose( video, modelReady );
	handpose.on( "predict", results => {
		predictions = results;
	} );
	video.hide();
}
function modelReady() {
	console.log( "Model ready!" );
}
function draw() {
	image( video, 0, 0, width, height );
	drawKeypoints();
}
function drawKeypoints() {
	for ( let i = 0; i < predictions.length; i++ ) {
		let x4 = 0;
		let y4 = 0;
		let x8 = 0;
		let y8 = 0;

		const prediction = predictions[ i ];
		for (let j = 0; j < prediction.landmarks.length; j++ ) {
			// 親指の先端
			if ( j == 4 ){
				const keypoint = prediction.landmarks[ j ];
				fill( 0, 255, 0 );
				noStroke(30);
				ellipse( keypoint[0], keypoint[1], 10, 10 );
				x4 = Math.floor( keypoint[0] );
				y4 = Math.floor( keypoint[1] );
				console.log( "4:" + "x:" + x4 + "       y:" + y4 );
			}
			// 人差し指の先端
			else if ( j == 8 ){
				const keypoint = prediction.landmarks[ j ];
				fill( 0, 0, 255 );
				noStroke(30);
				ellipse( keypoint[0], keypoint[1], 10, 10 );
				x8 = Math.floor( keypoint[0] );
				y8 = Math.floor( keypoint[1] );
				console.log( "8:" + "x:" + x8 + "       y:" + y8 );
			}
			else {
				const keypoint = prediction.landmarks[ j ];
				fill( 255, 255, 0 );
				noStroke(30);
				ellipse( keypoint[0], keypoint[1], 10, 10 );
			}
			if ( x4 - x8 ){
				//console.log( "deff is " + ( x4 - x8 ) );
				if ( ( y4 - y8 ) < 5 ) {
					resultX = CheckArea( y4, y8, 1 );
					if ( resultX ) {
						console.log( "Check" );
						GoSignFLG = true;
					}
				}
			}
		}
	}
}

function CheckArea ( four, eight, pos ) {
	if ( pos ) {
		// ****************
		// Y座標の有効範囲
		// ****************
		if ( 200 < four  && 200 < eight ){
			return true;
		}
	}
	return false;
}

window.addEventListener( 'DOMContentLoaded', function() {
	setInterval ( () => {
		console.log( "…" );
		// ************************
		// 2秒周期でサインチェック
		// ************************
		if ( GoSignFLG ) {
			ChangePage( 1 );
			GoSignFLG = false;
		}
	}, 2000) ;
});
