class MaxWidth {

    static sort(sprites, canvas){

       _.forEach(sprites, function(sprite){
            sprite.opp = sprite.size.wx;
        });

        let sorted = _.orderBy(sprites, ['opp'],['desc']);

        let dx = 0;
        let dy = 0;
        let pdy= [];

        for(let i=0; i < canvas.width; i++) { pdy[i] = 0; }

        _.forEach(sorted, function(sprite){
            if ( dx + sprite.size.wx > canvas.width ){
                for(let i=dx; i < canvas.width; i++) { pdy[i] = pdy[dx-1]; }
                dx  = 0;
            }
            dy = pdy[dx];

            sprite.draw.dx = dx;
            sprite.draw.dy = dy;

            for(let i=dx; i < dx+sprite.size.wx; i++) { pdy[i] = 1 + dy + sprite.size.wy; }

            dx += sprite.size.wx;

        });

    }
}

export default MaxWidth;