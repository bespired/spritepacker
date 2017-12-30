class MaxRect {

    static sort(sprites, canvas){

       _.forEach(sprites, function(sprite){
          	sprite.opp = sprite.size.wx * sprite.size.wy;
        });

        let sorted = _.orderBy(sprites, ['opp'],['desc']);

        let dx = 0;
        let dy = 0;
        let pdy= [];
        let dir = 1;

        for(let i=0; i < canvas.width; i++) { pdy[i] = 0; }

        _.forEach(sorted, function(sprite){

            if ( dir == 1 ){
                if ( dx + sprite.size.wx > canvas.width ){
                    for(let i=dx; i < canvas.width; i++) { pdy[i] = pdy[dx-1]; }
                    dx  = canvas.width - sprite.size.wx - 1;
                    dir = -1;
                }

            }else{
                let ox= dx;
                dx -= sprite.size.wx;
                if ( dx < 1 ){

                    for(let i=0; i < ox; i++) { pdy[i] = pdy[ox+1]; }
                    dx  = 0;
                    dir = 1;
                }
            }

            dy = pdy[dx];

            sprite.draw.dx = dx;
            sprite.draw.dy = dy;

            for(let i=dx; i < dx+sprite.size.wx; i++) { pdy[i] = 1 + dy + sprite.size.wy; }

            if (dir == 1){
                dx += sprite.size.wx;
            }

        });

    }
}

export default MaxRect;