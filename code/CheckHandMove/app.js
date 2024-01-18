let canvas;
let pageNum_All = 0;
let pageNum_Current = 1;

document.getElementById('pdfFileInput').addEventListener('change', function(event) {
	file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const pdfData = new Uint8Array(e.target.result);
			const pdfjsLib = window['pdfjs-dist/build/pdf'];
			pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

			pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdf) {
				SettingPageInfo( pdf, 0 );
			});
		};
		reader.readAsArrayBuffer(file);
	}
});

function SettingPageInfo ( pdf, type ){
	const container = document.getElementById('pdfViewer');
				pageNum_All = pdf.numPages;
				pdf.getPage(pageNum_Current).then(function(page) {
					const scale = 1.5;
					const viewport = page.getViewport({ scale: scale });
					if ( type ) {
						container.removeChild(canvas); // リフレッシュ
					}
					canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');
					canvas.height = viewport.height;
					canvas.width = viewport.width;

					const renderContext = {
						canvasContext: context,
						viewport: viewport
					};
					page.render(renderContext);
					container.appendChild(canvas);
				});
}
function ChangePage ( mode ) {
	if (file) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const pdfData = new Uint8Array(e.target.result);
			const pdfjsLib = window['pdfjs-dist/build/pdf'];
			pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
			pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdf) {
				if ( mode ) {
					// ページ遷移すすむ
					if ( pageNum_Current < pageNum_All ){
						pageNum_Current++;
					}
					else {
						pageNum_Current = 1;
					}
				}
				else {
					// ページ遷移もどる
					if ( pageNum_Current <= 1 ){
						pageNum_Current = pageNum_All;
					}
					else {
						pageNum_Current--;
					}
				}
				SettingPageInfo( pdf, 1 );
			});
		};
		reader.readAsArrayBuffer(file);
	}
}
