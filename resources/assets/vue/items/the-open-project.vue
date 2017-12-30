<script>

	export default {
		data: function(){
			return {
				selected: {},
				project : null,
			}
		},
		mounted() {
        	this.$store.dispatch('guix_index_projects');
		},
		methods:{
			load: function(){
				if ( this.project !== null )
				{
					global.project = _.clone(this.project);
					this.$store.dispatch('guix_edit_panels');
					this.$store.dispatch('sprites_load_project');
					this.$store.commit('guix_close_modal');
				}
			},
			close: function(){
				this.$store.commit('guix_close_modal');
			},
			open: function (project) {
				let vm = this;
				_.each(this.$store.state.guix.projects, function(proj){
					vm.selected[proj.id] = false;
				})
				this.selected[project.id] = true;
				this.project = project;
				this.$forceUpdate();
			},
		}
    }
</script>

<template>
	<div class="modal">
		Open Project
		<ul class="list selectable">
			<li v-for="(project, index) in this.$store.state.guix.projects"
				:key="index"
				:class="[selected[project.id] ? 'selected' : '']"
				@click="open(project)"
				>
				<a>
					<i class="fa fa-file-text"></i> {{ project.name }}
				</a>
			</li>
		</ul>

		<footer>
		<a class='button' @click="close">Cancel</a>
		<a class='button' @click="load" :class="[project ? 'enabled' : 'disabled']">Load</a>
		</footer>
	</div>
</template>
