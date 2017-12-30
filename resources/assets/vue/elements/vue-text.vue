<script>

	export default {

		props: ['item'],

		computed: {
			data: {
				get () {
					return this.$store.state.guix.values[this.item.store];
				},
				set (value) {
					this.$store.commit('guix_update_value', { 'item' : this.item, value });
				}
			}
		}
	}
</script>

<template>
	<div>
		<span class="label left-label">
			{{ item.label }}
		</span>
		<span class="right-entry">
				<input type="text" v-model="data">
		</span>
	</div>
</template>
