import { AnyObject } from '../../layouts/data/if';

class Mystr {
	printf(fmt:string, ...param: any[]) {
		let idx = -1;
		const func = (substring: string, ...args: any[]) => {
			let ans = '';
			let f:any;
			idx += 1;
			if (!args) console.log('printf func args is empty');
			switch (substring) {
				case '%d':
					ans = `${parseInt(param[idx], 10)}`;
					break;
				case '%s':
					ans = `${param[idx]}`;
					break;
				default:
					f = parseInt(String(substring.split('').pop()), 10);
					if (!f) {
						ans = `${parseFloat(param[idx])}`;
					} else if (typeof (param[idx]) === 'number') {
							ans = `${param[idx].toFixed(f)}`;
					} else {
							ans = `${parseFloat(param[idx]).toFixed(f)}`;
					}
			}
			return ans;
		};
		const reg = /(%\w\.\d|%\w)/g;
		return fmt.replace(reg, func);
	}
	toJSON(str:string):AnyObject | undefined {
    let msg:AnyObject | undefined;
    try {
      msg = JSON.parse(str);
    } catch (err) {
      console.log('SettleProc JSON parse error:', str);
      console.log(err);
    }
		return msg;
	}
}
export default new Mystr();
