<template>
	<div>
		<item-report />
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ItemReport from '../components/ItemReport.vue';

@Component({
	components: {
		ItemReport,
	},
})
export default class CryptoItemReport extends Vue{
	
}
</script>