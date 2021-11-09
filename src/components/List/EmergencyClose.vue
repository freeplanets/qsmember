<template>
	<table v-if="list">
		<tr class="bg-green-14">
			<th>{{ $t('Table.EmergencyClose.Item') }}</th>
			<th>{{ $t('Table.EmergencyClose.sw') }}</th>
			<th>{{ $t('Table.EmergencyClose.Modifier') }}</th>
			<th>{{ $t('Table.EmergencyClose.ModifyTime') }}</th>
		</tr>
		<tr v-for="(itm,idx) in list"
			:key="idx"
		>
			<td>{{ itm.ItemID ? itm.Title : $t('Label.EmergencySwitch.Title') }}</td>
			<td>{{ StatusInfo(itm.ItemID, itm.sw, itm.Closed) }}</td>
			<td>{{ itm.Modifier }}</td>
			<td>{{ TimeString(itm.ModifyTime) }}</td>
		</tr>
	</table>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { EmergencyCloseLog } from '../if/dbif';
import DateFunc from '../Functions/MyDate';

@Component
export default class EmergencyClose extends Vue {
	@Prop({ type: Array }) readonly list!:EmergencyCloseLog[];
	TimeString(t:string) {
		return DateFunc.toLocalStringNoYear(t);
	}
	StatusInfo(itemid:number, sw:number, closed:number) {
		let sts = '';
		if (itemid) {
			console.log('Status:', itemid, sw);
			sts = String(this.$t(`Label.StopType.${closed}`));
		} else if (sw) {
			sts = String(this.$t('Label.EmergencySwitch.Shutdown'));
		} else {
			sts = String(this.$t('Label.EmergencySwitch.RaiseUp'));
		}
		return sts;
	}
}
</script>
<style lang="scss" scoped>
table {
	border-right: 1px $green-10 solid;
	border-top: 1px $green-10 solid;
	border-spacing: 0px;
	width: 100%;
}
th {
	border-bottom: 1px $green-10 solid;
	border-left: 1px $green-10 solid;
}
td {
	border-left: 1px $green-10 solid;
	border-bottom: 1px $green-10 solid;
}
.txtRight {
	padding-right: 8px;
}
</style>
