<template>
    <div>{{propA}}</div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class TestComp extends Vue {
    @Prop(Number) readonly propA?:number;
}
// export default Vue.extend({
    
// })
</script>
