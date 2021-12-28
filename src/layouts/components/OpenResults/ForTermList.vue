<template>
	<div style='word-break: normal;'>
		<template v-if="Nums">
			{{Nums ? Nums.replace(/\,/g,', ') : ''}}
		</template>
		<template v-if="Result">
				<div class="result_contain">
					<div class="DW_game">
						<div class="DW_balltable">
							<div
								v-for="(num,fi) in Result"
								:key="`f${num.Num}x${fi}`"
								:class="`DW_ball_m6 ${Color(num.ColorWave)}`">
								<div>{{num.Num !== undefined ? num.Num : num}}</div>
								<span v-if="num.Zadic" >{{$t(`Game.MarkSix.Item.18.subtitle.${num.Zadic}`)}}</span>
							</div>
							<!--sp number-->
							<div v-if="SpNo && SpNo.Num" class="DW_Special">
								<div :class="`DW_ball_m6 ${Color(SpNo.ColorWave)}`">
									<div>{{SpNo.Num}}</div>
									<span v-if="SpNo.Zadic">{{$t(`Game.MarkSix.Item.18.subtitle.${SpNo.Zadic}`)}}</span>
								</div>
							</div>
						</div>
					</div>
			</div>
		</template>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { AnyObject, NumInfo } from 'src/layouts/data/if';

@Component
export default class ForTermList extends Vue {
	@Prop({ type: Object }) readonly game!:AnyObject;
	@Prop({ type: Array }) readonly Result!:NumInfo[];
	@Prop({ type: Object }) readonly SpNo!:NumInfo;
	@Prop({ type: String }) readonly Nums!:string;
	@Watch('Result', { immediate: true, deep: true })
	onResultChange() {
		console.log('onResultChange:', this.Result);
	}
	Color(v?:number):string {
		if (typeof v === 'number') {
			const color = ['red_ball', 'blue_ball', 'green_ball'];
			return color[v];
		}
		return 'black_ball';
	}
}
</script>
<style lang="scss" scoped>
.resultWrap {
  width: 94%;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #cdcdcd;
  margin: 0 auto 2%;
}
.DW_balltable {
  /*彩球類*/
  width: 100%;
  text-align: center;
  margin-bottom: 2%;
}
.DW_game {
  /*上下填空*/
  padding: 2% 0 2%;
}
	.DW_ball_m6 {
  margin: 0 1px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  position: relative;
  display: inline-block;
  font-size: 1.1em;
}
.DW_ball_m6 span {
  color: #6a6565;
  font-size: 0.75em; /*0.7*/
}
.DW_Special {
  margin-left: 1px;
  height: 100%;
  padding-left: 5px;
  display: inline-block;
  border-left: 1px solid #cdcdcd;
}
.red_ball {
  background-color: #c23437;
}
.blue_ball {
  background-color: #1c76b3;
}
.green_ball {
  background-color: #369c57;
}
.black_ball {
	background-color:	black;
}
</style>
