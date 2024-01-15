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
				const container = document.getElementById('pdfViewer');
				// ページ情報(S)
				pageNum_All = pdf.numPages;
				pdf.getPage(pageNum_Current).then(function(page) {
					const scale = 1.5;
					const viewport = page.getViewport({ scale: scale });

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
			});
		};
		reader.readAsArrayBuffer(file);
	}
});
function ChangePage () {
	if (file) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const pdfData = new Uint8Array(e.target.result);
			const pdfjsLib = window['pdfjs-dist/build/pdf'];
			pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
			pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdf) {
				const container = document.getElementById('pdfViewer');
				if ( pageNum_Current < pageNum_All ){
					pageNum_Current++;
				}
				else {
					pageNum_Current = 1;
				}
				// ページ情報(S)
				pdf.getPage(pageNum_Current).then(function(page) {
					const scale = 1.5;
					const viewport = page.getViewport({ scale: scale });
					container.removeChild(canvas); // リフレッシュ
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
				// ページ情報(E)
			});
		};
		reader.readAsArrayBuffer(file);
	}
}
