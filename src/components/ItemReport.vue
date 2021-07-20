<template>
	<table>
		<blk-item-header-1 />
		<blk-item-header-2 />
	</table>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import blkItemHeader1 from './Block/ItemTypeHeader1.vue';
import blkItemHeader2 from './Block/ItemTypeHeader2.vue';

@Component({
	components: {
		blkItemHeader1,
		blkItemHeader2
	}
})
export default class ItemReport extends Vue {
	
}
</script>