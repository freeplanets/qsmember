import TxtManager from './Manager';
import TxtLotto from './Lotto';
import TxtCrypto from './CryptoCur';

export interface BaseStructure {
	[key:string]: string | string[];
}

export interface TextStructure {
	[key:string] : string | string[] | BaseStructure;
}

export default {
	Manager: TxtManager,
	Lotto: TxtLotto,
	Crypto: TxtCrypto,
};
