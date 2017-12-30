<script>
	export default {
		data: function(){
			return {
				bgimage : `background-image: url(${this.$store.state.guix.image})`,
				pointing: null,
			};
		},

		methods: {
			maxparent: function(){
				let left = document.getElementsByClassName('the-sidebar')[0];
				let right= document.getElementsByClassName('the-right')[0];
				let scale = 1;
				if ( left && right ){
					let lwidth= parseInt(getComputedStyle(left , null).getPropertyValue("width"));
					let rwidth= parseInt(getComputedStyle(right, null).getPropertyValue("width"));

					let w= window.innerWidth - lwidth - rwidth;
					scale = w / this.$store.state.guix.values.maxsize;
					if ( scale > 1 ) scale = 1;

					let thecanvas = document.getElementById('canvas');
					let rect = thecanvas.getBoundingClientRect();
					this.$store.commit('guix_canvas', rect);

				}
				return {
					transform: `scale(${scale})`
				}
			},

			pointer: function () {
				if ( !this.pointing) return {};

				let style = {
					'position'      : 'absolute',
					'border'        : '4px solid green',
					'left'          : `${this.pointing.draw.dx+2}px`,
    				'top'           : `${this.pointing.draw.dy+2}px`,
    				'width'         : `${this.pointing.size.wx}px`,
    				'height'        : `${this.pointing.size.wy}px`,
    				'pointerEvents' : 'none',
    				'cursor'        : 'pointer',
    			};
				return style;
			},

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

				document.getElementById('preview').src = this.pointing.url;

			},

			leave: function(event){
				// reset preview
				// this.$store.commit('sprites_preview', this.current);
				// document.getElementById('preview').src = this.current.url;
			},

			select: function(event){

				if ( !this.pointing) return;

				console.log('commit:', this.pointing);
				this.$store.commit('sprites_preview', this.pointing);
			},

		},

		mounted:function(){
			let vm = this;
			window.addEventListener('resize', function() {
				vm.$forceUpdate();
			});
		}

    }
</script>

<template>
	<div class="the-canvas" ref="grid">
		<div class='canvas-grid'
			:style="maxparent()"
			v-if="this.$store.state.guix.values.maxsize">
				<canvas id="canvas"
					:width ="this.$store.state.guix.values.maxsize"
					:height="this.$store.state.guix.values.maxsize"
					ref= "thecanvas"
					v-on:mousemove="hover"
					v-on:mouseout ="leave"
					v-on:mouseup  ="select"
				/>
			<div
				v-show="pointing"
				v-bind:style="pointer()"
			/>
		</div>

	</div>
</template>
