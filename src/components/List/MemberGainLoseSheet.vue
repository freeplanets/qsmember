<template>
	<table class="list" v-if="list && list.length>0">
		<tr>
			<th rowspan="2">{{ $t('Table.Account') }}</th>
			<th colspan="3">{{ $t('Report.OdrAmt') }}</th>
			<th colspan="2">{{ $t('Report.GainLose') }}</th>
			<th colspan="2">{{ $t('Label.BlackListLevel')}}</th>
		</tr>
		<tr>
			<th>{{ $t('Table.AskTable.Amount') }}</th>
			<th>{{ $t('Report.OdrAmt') }}</th>
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
import { MemberCLevel } from '../if/dbif';

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
