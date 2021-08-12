class Nums {
	isMaxTwoDigitlAfterPoint(v:number|string):boolean {
		if (typeof v !== 'string') v = String(v);
		const reg = /^[0-9]+(.[0-9]{0,2})?$/;
		return reg.test(v);
	}
	isGreen(v:number):boolean {
		return v > 0;
	}
	isRed(v:number):boolean {
		return v < 0;
	}
}
export default new Nums();
