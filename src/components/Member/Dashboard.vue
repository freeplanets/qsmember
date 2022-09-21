<template>
	<div id='drag-drop-basic'>
		<div
			v-for="(game,idx) in games" :key="idx"
			:id="`container${idx}`" data-role="drag-drop-container"
		>
			<div :id="`drag-source${game.value}`" class="drag-source" draggable="true">
				<img :src="icon[`${game.value}`]" :id="`drag-source${game.value}-image`"  draggable="true" />
				<h5>{{ $t(`GameTitle.${game.value}`)}}</h5>
			</div>
		</div>
	</div>
</template>
<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LStore from '../../layouts/data/LayoutStoreModule';
import Api from '../class/Api/Func';
import { HasID, Msg, SelectOptions } from '../../layouts/data/if';
import { dragEnd, dragLeave, dragStart, dragOver, dropped, cancelDefault } from './Listener';

@Component
export default class Dashboard extends Vue {
	@Prop({ type: Number }) readonly Save!:number;
	@Watch('Save')
	onSaveChange() {
		console.log('onSaveChange:', this.Save);
		if (this.Save) {
			this.saveOrder();
		}
	}
	store = getModule(LStore);
	ax = new Api(this.store);
	games:SelectOptions[] = [];
	icon = {
        1: require('../../assets/img/六合彩.png'),
        2: require('../../assets/img/none.png'),
        3: require('../../assets/img/福彩3d.png'),
        4: require('../../assets/img/七星彩.png'),
        5: require('../../assets/img/廣西快樂10.png'),
        6: require('../../assets/img/上海時時彩.png'),
        7: require('../../assets/img/none.png'),
        8: require('../../assets/img/天津時時彩.png'),
        9: require('../../assets/img/icon5d.png'),
        10: require('../../assets/img/icon506.png'),
        11: require('../../assets/img/新疆時時彩.png'),
        12: require('../../assets/img/廣東快樂10.png'),
        13: require('../../assets/img/天津快樂10.png'),
        14: require('../../assets/img/幸運農場.png'),
        15: require('../../assets/img/山東11選5.png'),
        16: require('../../assets/img/重慶11選5.png'),
        17: require('../../assets/img/江西11選5.png'),
        18: require('../../assets/img/廣東11選5.png'),
        19: require('../../assets/img/重慶時時彩.png'),
        20: require('../../assets/img/北京賽車.png'),
        21: require('../../assets/img/江蘇骰寶.png'),
        22: require('../../assets/img/北京快樂8.png'),
        23: require('../../assets/img/lottos_icon01.png'),
        24: require('../../assets/img/lottos_icon02.png'),
        25: require('../../assets/img/lottos_icon03.png'),
        26: require('../../assets/img/lottos_icon04.png'),
        27: require('../../assets/img/lottos_icon05.png'),
        28: require('../../assets/img/lottos_icon06.png'),
        29: require('../../assets/img/lottos_icon07.png'),
        30: require('../../assets/img/twbg.png'),
        31: require('../../assets/img/ico1.png'),
        32: require('../../assets/img/ico2.png'),
        33: require('../../assets/img/ico3.png'),
        34: require('../../assets/img/ico4.png'),
        35: require('../../assets/img/ico5.png'),
        36: require('../../assets/img/twbg.png'),
				39: require('../../assets/img/twbg.png'),
				40: require('../../assets/img/twbg.png'),
      };
	async getGames() {
		const ans:SelectOptions[] | undefined = await this.store.ax.getGames(false, true);
		if (ans) {
			this.games = ans;
		}
	}
	async saveOrder() {
		const dragSources = document.querySelectorAll('[draggable="true"]');
		const orders:HasID[] = [];
		dragSources.forEach((dragSource, idx) => {
			orders.push({
				id: parseInt(dragSource.id.replace('drag-source', ''), 10),
				MbrIfOrder: idx,
			});
		});
		if (orders.length > 0) {
			const ans:Msg = await this.ax.saveGameOrder(orders);
			console.log('saveOrder:', ans);
			const title = `${this.$t('Label.Save')}`;
			const message = String(this.$t(`Error.${ans.ErrNo}`));
			this.$q.dialog({ title, message });
		}
		this.$emit('EndSave', 0);
	}
	ddInit() {
		const dragSources = document.querySelectorAll('[draggable="true"]');
		dragSources.forEach((dragSource) => {
			// console.log('dragSource', dragSource.id);
			dragSource.addEventListener('dragstart', dragStart);
			dragSource.addEventListener('dragend', dragEnd);
		});

		// Allow multiple dropped targets
		const dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]');
		dropTargets.forEach((dropTarget) => {
			// console.log('dropTarget', dropTarget.id);
			dropTarget.addEventListener('drop', dropped);
			dropTarget.addEventListener('dragenter', cancelDefault);
			dropTarget.addEventListener('dragover', dragOver);
			dropTarget.addEventListener('dragleave', dragLeave);
		});
	}
	async mounted() {
		await this.getGames();
		console.log('mounted done');
	}
	updated() {
		console.log('updated');
		this.ddInit();
	}
}
</script>
<style scoped>

#drag-drop-basic {
	border: 1px solid black;
	width: 300px;
	height: 750px;
}
.drag-source {
	float: left;
	margin: 5px 5px 5px 5px;
	width: 88px;
	height: 82px;
  display: block;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.3);
  padding: 1em 0;
  background-color: #fff;
  text-decoration: none;
  cursor: pointer;
}
img {
  height: 45px;
  margin-bottom: 10px;
  padding: 0;
  vertical-align: middle;
  display: inline-block;
	transition: all .5s;
  text-decoration: none;
  cursor: pointer;
  color: #333;
}
h5 {
  margin: 0;
  padding: 0;
  font-weight: 300;
  font-size: 12px;
  line-height: 1;
  color: black;
}
</style>
