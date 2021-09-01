<template>
	<table class="list" v-if="list && list.length>0">
		<tr>
			<th rowspan="2">
				{{ $t('Table.Account') }}
				<q-btn
					round
					color="primary"
					size="xs"
					:icon="titleSortIcon"
					@click="sort('title')"
				/>
			</th>
			<th colspan="3">{{ $t('Report.OdrAmt') }}</th>
			<th colspan="2">{{ $t('Report.GainLose') }}</th>
			<th colspan="2">{{ $t('Label.BlackListLevel')}}</th>
		</tr>
		<tr>
			<th>{{ $t('Table.AskTable.Amount') }}</th>
			<th>{{ $t('Report.LeverAmt') }}</th>
			<th>{{ $t('Report.AvgLever') }}(%)</th>
			<th>{{ $t('Table.AskTable.Amount') }}</th>
			<th>%</th>
			<th>{{ $t('Label.BlackCurrent') }}</th>
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
	titleSortIcon = '';
	amtSortIcon = '';
	leverAmtSortIcon = '';
	leverRateSortIcon = '';
	glAmtSortIcon = '';
	glRateSortIcon = '';
	icons:DataObject = {
		Nickname: '',
		Total: '',
		LeverTotal: '',
		LeverAvgRate: '',
		GainLose: '',
		GainLoseRate: '',
		CLevel:'',
	}
	sort(key:string) {	
		this.list.sort((a:MemberGainLose, b:MemberGainLose) => {
			let ans = 0;
			let a1 = a as DataObject;
			let b1 = a as DataObject;
			if(a1[key] && b1[key]) {
				ans = 1;
			}
			return ans;
		})
	}
	resetIcon() {
		this.titleSortIcon = this.iconDefault;
		this.amtSortIcon = this.iconDefault;
		this.leverAmtSortIcon = this.iconDefault;
		this.leverRateSortIcon = this.iconDefault;
		this.glAmtSortIcon = this.iconDefault;
		this.glRateSortIcon = this.iconDefault;
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
