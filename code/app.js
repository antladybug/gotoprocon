const puppeteer = require('puppeteer');
const cron = require('node-cron');		// タイマー管理

const tflag = 0;						// 遅延情報フラグ

// スケジューリング
cron.schedule( '* * * * *', () => {
(async () => {
		const browser = await puppeteer.launch( { headless: 'new', } );
		const page = await browser.newPage();
		await page.goto('https://transit.yahoo.co.jp/diainfo/area/4');
		
		// 各記事のタイトルを取得
		const target = '.trouble > table > tbody > tr > td > a';
		const links = await page.$$eval(target, links => {
			return links.map(link => link.textContent);
		});
		// 出力
		links.forEach( function( item ) {
			console.log( item );
			if( item == "京浜東北根岸線" ) {
				var Obniz = require("obniz");
				var obniz = new Obniz("6256-7466"); // 接続端末ID
				// 接続中
				obniz.onconnect = async function () {
					led = obniz.wired("LED", {anode: 8, cathode: 11});//長い,短いの順番
					led .on();
				}			
			}
		});
		await browser.close();
	}
	)();
} );



