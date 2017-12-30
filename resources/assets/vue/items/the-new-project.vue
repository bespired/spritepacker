<script>

	export default {
		data: function(){
			return {
				selected: {},
				project : null,
			}
		},
		methods:{
			create: function(){
				if ( this.project !== null )
				{
					this.$store.commit('guix_close_modal');
				}
			},
			close: function(){
				this.$store.commit('guix_close_modal');
			},
		}
    }
</script>

<template>
	<div class="modal">
		New Project


		<footer>
		<a class='button' @click="close">Cancel</a>
		<a class='button' @click="create" :class="[project ? 'enabled' : 'disabled']">Create</a>
		</footer>
	</div>
</template>
