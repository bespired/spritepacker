<script>
	import VueAccordion from '@vue/elements/vue-accordion.vue';
	import VuePulldown  from '@vue/elements/vue-pulldown.vue';

	export default {
		components: {
			VueAccordion,
			VuePulldown,
		},
		data: function(){
			return {
				sidebar: this.$store.state.guix.panels
			}
		}
	}
</script>
<template>
	<div class="the-sidebar">
		<ul class="list">
			<li v-for="(item, index) in sidebar" :key="index">
				<vue-accordion :item="item" />
			</li>
		</ul>
	</div>
</template>