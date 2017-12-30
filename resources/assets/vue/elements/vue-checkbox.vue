<script>

	export default {

		props: ['item'],

		data: function(){
			return {
				checkbox_slug: 'checkbox-' + _.slugify(this.item.label)
			};
		},

		computed: {
			checked: {
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
			<label class="switch">
				<input type="checkbox" v-model="checked">
				<span class="slider right-value"></span>
			</label>
		</span>
	</div>
</template>
