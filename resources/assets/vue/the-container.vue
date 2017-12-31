<script>
	import TheSidebar from '@vue/items/the-sidebar.vue';
	import TheCanvas  from '@vue/items/the-canvas.vue';
	import TheSprites from '@vue/items/the-sprites.vue';

	import TheModals  from '@vue/items/the-modals.vue';

	export default {
		data: function(){
			return {
				update: 0,
			}
		},

		components: {
			TheModals,
            TheSidebar, TheCanvas , TheSprites,
        },

        methods:{
        },

        mounted() {
            console.log('Sprite Packer 1.0');
            this.$store.dispatch('guix_init_panels');

			if ( global.project.id > 0 ){
				this.$store.dispatch('sprites_load_project');
				this.$store.dispatch('guix_edit_panels');
			}
        }
    }
</script>


<template>
	<div class="the-container">
		<div class="the-content" :key="this.$store.state.guix.update" >
			<the-sidebar/>
			<the-canvas />
			<the-sprites/>
		</div>
		<the-modals/>
	</div>
</template>