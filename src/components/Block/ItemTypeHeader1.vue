<template>
	<tr>
		<th rowspan="2">{{ $t('Label.WebSite') }}</th>
		<th rowspan="2">{{ $t('Label.RecordCount') }}</th>
		<th rowspan="2">{{ $t('Report.OdrAmt') }}</th>
		<th rowspan="2">{{ $t('Report.LeverAmt') }}</th>
		<th rowspan="2">{{ $t('Report.AvgLever') }}</th>
		<th colspan="5">{{ $t('Select.Crypto.ItemTypeLong.1') }}</th>
		<th colspan="5">{{ $t('Select.Crypto.ItemTypeLong.0') }}</th>
		<th rowspan="2">{{ $t('Table.AskTable.Fee') }}</th>
		<th rowspan="2">{{ $t('Report.TotalGainLose') }}</th>
	</tr>
</template>
<style lang="scss" scoped>
th {
	border: 1px solid black;
}
</style>
