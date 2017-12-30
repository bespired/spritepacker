<script>
	export default {

        props: ['item'],

		computed: {
			selected: {
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
		<span class="left-label" >
			{{ item.label }}
		</span>
		<span class="right-entry">
			<select class="vue-pulldown" v-model="selected">
				<option v-for="option in item.options" v-bind:value="option.value">
    				{{ option.label }}
  				</option>
			</select>
		</span>
	</div>
</template>
