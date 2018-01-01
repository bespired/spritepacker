<script>
	export default {
		data: function(){
			return {
				pointing: null,
			};
		},

		methods: {

			hovering:function(rx,ry){
				if ( this.$store.state.guix.sprites.length == 0  ) return;

				let current= null;
				_.forEach(this.$store.state.guix.sprites, function(sprite){
					if ( sprite.draw !== undefined ){
						if ( rx > sprite.draw.dx && rx < sprite.draw.dx + sprite.size.wx ) {
							if ( ry > sprite.draw.dy && ry < sprite.draw.dy + sprite.size.wy ) {
								current = sprite;
							}
						}
					}
				});
				return current;
			},

			hover: function(event){
				let ax= event.clientX - this.$store.state.guix.canvas.left;
				let ay= event.clientY - this.$store.state.guix.canvas.top;

				let f = this.$store.state.guix.values.maxsize / this.$store.state.guix.canvas.width;

				let rx = ax * f;
				let ry = ay * f;

				this.pointing = this.hovering(rx, ry);
				if ( !this.pointing) return;

				this.$store.dispatch('guix_set_pointer', this.pointing);
				document.getElementById('preview').src = this.pointing.url;

			},

			leave: function(event){
				// reset preview
				// this.$store.commit('sprites_preview', this.current);
				// document.getElementById('preview').src = this.current.url;
			},

			select: function(event){

				if ( !this.pointing) return;

				// console.log('commit:', this.pointing);
				// this.$store.dispatch('guix_set_pointer', this.pointing);
				this.$store.commit('sprites_preview', this.pointing);
			},

		},

		mounted:function(){
			let vm = this;
			window.addEventListener('resize', function() {
				vm.$store.dispatch('guix_max_canvas');
				vm.$forceUpdate();
			});

			this.$store.dispatch('guix_max_canvas');

		},
    }
</script>
<template>
	<div class="the-canvas" ref="grid">
		<div class='canvas-grid canvas-size'>
				<div
					v-show="pointing"
					class="canvas-pointer pointer-pos"
				/>
				<canvas id="canvas"
					:width ="this.$store.state.guix.values.maxsize"
					:height="this.$store.state.guix.values.maxsize"
					ref= "thecanvas"
					v-on:mousemove="hover"
					v-on:mouseout ="leave"
					v-on:mouseup  ="select"
				/>

		</div>
	</div>
</template>
<!-- <template>
	<div class="the-canvas" ref="grid">
		<div class='canvas-grid'
			:style="maxparent()"
			v-if="this.$store.state.guix.values.maxsize"
		>
				<div
					v-show="pointing"
					v-bind:style="pointer()"
					class="canvas-pointer"
				/>
				<canvas id="canvas"
					:width ="this.$store.state.guix.values.maxsize"
					:height="this.$store.state.guix.values.maxsize"
					ref= "thecanvas"
					v-on:mousemove="hover"
					v-on:mouseout ="leave"
					v-on:mouseup  ="select"
				/>

		</div>
	</div>
</template> -->
