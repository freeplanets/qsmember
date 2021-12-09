export interface NumInfo {
	Num:number;
	ColorWave: number;
	Zodiac: number;
	[key:string]:number;
}

export interface Result {
	getReguler():NumInfo[];
	getSP():NumInfo | undefined;
}
