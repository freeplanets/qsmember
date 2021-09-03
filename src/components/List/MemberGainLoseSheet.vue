<template>
	<table class="list" v-if="list && list.length>0">
		<tr>
			<th rowspan="2">
				{{ $t('Table.Account') }}
				<q-btn
					round
					color="primary"
					size="xs"
					:icon="icons.Nickname"
					@click="sort('Nickname')"
				/>
			</th>
			<th colspan="3">{{ $t('Report.OdrAmt') }}</th>
			<th colspan="2">{{ $t('Report.GainLose') }}</th>
			<th colspan="2">{{ $t('Label.BlackListLevel')}}</th>
		</tr>
		<tr>
			<th>
				{{ $t('Table.AskTable.Amount') }}
				<q-btn
					round
					color="primary"
					size="xs"
					:icon="icons.Total"
					@click="sort('Total')"
				/>
			</th>
			<th>
				{{ $t('Report.LeverAmt') }}
				<q-btn
					round
					color="primary"
					size="xs"
					:icon="icons.LeverTotal"
					@click="sort('LeverTotal')"
				/>
			</th>
			<th>
				{{ $t('Report.AvgLever') }}(%)
				<q-btn
					round
					color="primary"
					size="xs"
					:icon="icons.LeverAvgRate"
					@click="sort('LeverAvgRate')"
				/>
			</th>
			<th>
				{{ $t('Table.AskTable.Amount') }}
				<q-btn
					round
					color="primary"
					size="xs"
					:icon="icons.GainLose"
					@click="sort('GainLose')"
				/>
			</th>
			<th>
				%
				<q-btn
					round
					color="primary"
					size="xs"
					:icon="icons.GainLoseRate"
					@click="sort('GainLoseRate')"
				/>
			</th>
			<th>
				{{ $t('Label.BlackCurrent') }}
				<q-btn
					round
					color="primary"
					size="xs"
					:icon="icons.CLevel"
					@click="sort('CLevel')"
				/>
			</th>
			<th>{{ $t('Button.Edit') }}</th>
		</tr>
		<member-gain-lose-line
			v-for="(itm,idx) in list"
			:key="idx"
			:mgl="itm"
			@setCLevel="setCLevel"
		/>
	</table>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import MemberGainLose from '../class/GainLose/Member';
import MemberGainLoseLine from './MemberGainLoseLine.vue';
import { DataObject, MemberCLevel } from '../if/dbif';

interface SortIcon extends DataObject {
		Nickname: string;
		Total: string;
		LeverTotal: string;
		LeverAvgRate: string;
		GainLose: string;
		GainLoseRate: string;
		CLevel: string;
}

@Component({
	components: {
		MemberGainLoseLine,
	},
})
export default class MemberGainLoseSheet extends Vue {
	@Prop({ type: Array }) readonly list!: MemberGainLose[];
	setCLevel(v:MemberCLevel) {
		console.log('MemberGainLoseSheet setClevel', v);
		this.$emit('setCLevel', v);
	}
	iconUp = 'expand_less';
	iconDown = 'expand_more';
	iconDefault = 'unfold_more';
	icons:SortIcon = {
		Nickname: '',
		Total: '',
		LeverTotal: '',
		LeverAvgRate: '',
		GainLose: '',
		GainLoseRate: '',
		CLevel: '',
	}
	sort(key:string) {
		// console.log('sort:', key);
		let sortD = 1;
		if (this.icons[key] === this.iconDown) {
			sortD = -1;
		}
		this.resetIcon();
		this.icons[key] = sortD === 1 ? this.iconDown : this.iconUp;
		this.list.sort((a:MemberGainLose, b:MemberGainLose) => {
			let ans = 0;
			const a1 = a as DataObject;
			const b1 = b as DataObject;
			if (a1[key] > b1[key]) {
				ans = 1 * sortD;
			} else {
				ans = -1 * sortD;
			}
			return ans;
		});
		// console.log(this.list);
	}
	resetIcon() {
		Object.keys(this.icons).map((key) => {
			this.icons[key] = this.iconDefault;
		});
	}
	mounted() {
		this.resetIcon();
	}
}
</script>
<style lang="scss" scoped>
table {
    border: 0;
    border-spacing: 0;
    border-collapse: collapse;
}
.list {
	border-top: 1px solid $indigo-10;
	border-right: 1px solid $indigo-10;
}
.list th {
	border-left: 1px solid $indigo-3;
	border-bottom: 1px solid $indigo-3;
}
.list td {
	border-left: 1px solid $indigo-10;
	border-bottom: 1px solid $indigo-10;
}
.list div {
	margin: 2px 2px 2px 2px;
}
.list th {
	background-color: $cyan-10;
	color: white;
}
</style>
