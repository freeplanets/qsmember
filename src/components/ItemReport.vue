<template>
	<table v-if="list.length > 0" border="0" cellpadding="0" cellspacing="0">
		<blk-item-header-1 :isLedger="isLedger" />
		<blk-item-header-2 />
		<blk-item-type
			v-for = "(item,idx) in items"
			:key="`item:${idx}`"
			:itemT="item"
		/>
		<blk-item-type v-if="list && list.length>1" :itemT="total" />
	</table>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import blkItemHeader1 from './Block/ItemTypeHeader1.vue';
import blkItemHeader2 from './Block/ItemTypeHeader2.vue';
import blkItemType from './Block/ItemType.vue';
import { ItemTotal } from './if/dbif';

@Component({
	components: {
		blkItemHeader1,
		blkItemHeader2,
		blkItemType,
	},
})
export default class ItemReport extends Vue {
	@Prop({ type: Array }) readonly list!:ItemTotal[];
	@Prop({ type: Boolean }) readonly isLedger!:boolean;
	@Prop({ type: Object }) readonly total!:ItemTotal;
	items:ItemTotal[] = [];
	@Watch('list', { deep: true, immediate: true })
	onListChange() {
		// console.log('ItemReport onListChange', this.list);
		this.items = this.list;
	}
}
</script>
<style lang="scss" scoped>
table {
	margin: 8px 0 0 8px;
}
</style>
