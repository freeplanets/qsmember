<template>
	<div>
		<div class="row">Risk Controller</div>
		<BCIC />
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BanCryptoItemControl from '../components/Banner/CryptoItemControl.vue';

@Component({
	components: {
		BCIC: BanCryptoItemControl,
	},
})
export default class CryptoRiskController extends Vue {
	
}
</script>
