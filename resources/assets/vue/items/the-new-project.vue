<script>

	export default {
		data: function(){
			return {
				selected   : {},
				project    : null,
				newproject : '',
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
		<ul class="list">
			<li>
				<input type="text" model="newproject"/>
			</li>
		</ul>

		<footer>
		<a class='button' @click="close">Cancel</a>
		<a class='button' @click="create" :class="[newproject.length > 0 ? 'enabled' : 'disabled']">Create</a>
		</footer>
	</div>
</template>
