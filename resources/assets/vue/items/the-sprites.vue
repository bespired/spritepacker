<script>
	export default {
		data: function(){
			return {
				current : null,
			}
		},

		created: function () {
    		window.addEventListener('keyup',   this.nextsprite)
    		window.addEventListener('keydown', this.noscroll)

			let vm = this;
			this.$nextTick(function () {
				let rpanel= document.getElementsByClassName('the-right')[0];
				rpanel.ondragover  = function (event) {
					vm.$store.commit('guix_dropzone', true);
					event.preventDefault();
				};
				rpanel.ondragleave = function (event) {
					vm.$store.commit('guix_dropzone', false);
					event.preventDefault();
				};
				rpanel.ondrop      = function (event) {
					vm.$store.commit('guix_dropzone', false);
					vm.$store.commit('guix_sprites_upload', event.dataTransfer.files);
					event.preventDefault();
				};
			});

  		},

		beforeDestroy: function () {
    		window.removeEventListener('keyup', this.nextsprite)
    		window.removeEventListener('keydown', this.noscroll)
  		},

		methods: {

			preview(event){
				this.current = event;
				this.$store.commit('sprites_preview', this.current);
				document.getElementById('preview').src = this.current.url;
			},

			remove(){
				this.$store.commit('sprites_remove', this.current);
				this.$store.commit('guix_create_sheet');
			},

			noscroll(event){
				if([32, 37, 38, 39, 40].indexOf(event.which) > -1) {
        			event.preventDefault();
    			}
			},

			nextsprite(event){
				if ( event.which == 38) this.next(-1);
				if ( event.which == 40) this.next( 1);
				event.preventDefault();
			},

			next(dir){
				let next = 0;
				let slen = this.$store.state.guix.sprites.length;
				for(var idx= 0; idx < slen; idx++){
					let sprite = this.$store.state.guix.sprites[idx];
					if ( sprite.name == this.current.name ){
						next = idx + dir;
						if ( next < 0 ) next = 0;
						if ( next > slen-1) next = slen-1;
						idx = slen;
					}
				}
				this.current = this.$store.state.guix.sprites[next];
				if (this.current !== undefined){
					this.$store.commit('sprites_preview', this.current);
					document.getElementById('preview').src = this.current.url;

				}
			},
		}
    }
</script>
<template>
	<div class="the-right" ref="spritelist">
		<div class="list the-sprites" >
			<div v-if="this.$store.state.guix.sprites.length == 0">
				No Images
			</div>
			<ul class="list" >
				<li v-for="(item, index) in this.$store.state.guix.sprites"
					:key="index"
					:class="{ 'selected': item.selected }"
					@click="preview(item)"
					>
					<i class="box"/> {{ item.name }}
				</li>
			</ul>
		</div>
		<div class="sprite-tools">
			<a class="button"
				v-if="current"
				@click="remove()"
					>Delete Selected</a>
		</div>
		<div class="the-preview" >
			<img id="preview"/>
		</div>
		<div class="the-dropzone" v-show="this.$store.state.guix.dropzone">
			Drop your sprite here
		</div>
	</div>
</template>
