class PhaserJSON {

    static frame (sprite){
    	let f = {
			filename: sprite.name.replace('.png','').replace('.jpg',''),
			frame: {
                x: sprite.draw.dx,
                y: sprite.draw.dy,
                w: sprite.size.wx,
                h: sprite.size.wy
            },
            rotated: false,
            trimmed: true,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: sprite.size.width,
                h: sprite.size.height,
            },
            sourceSize: {
                w: sprite.size.width,
                h: sprite.size.height,
            }
        };
        return f;
    }

    static file(sprites, proj){
    	let frames = [];
    	_.forEach(sprites, function(sprite){
           	frames.push(PhaserJSON.frame(sprite));
        });

    	return {
    		"frames" : frames,
    		"meta": {
				"app"     : "texturepacker",
				"version" : "1.0",
				"image"   : "$image", // to be written by php
				"format"  : "RGBA8888",
				"size"    : {
					"w": '$w', // to be written by php
					"h": '$h'  // to be written by php
				},
				"scale"   : "1",
                "algorithm" : proj.algorithm,
			}
    	}

    }

}

export default PhaserJSON;