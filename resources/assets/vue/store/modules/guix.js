import FitRect     from "../plugins/FitRect";
import MaxRect     from "../plugins/MaxRect";
import MaxHeight   from "../plugins/MaxHeight";
import MaxWidth    from "../plugins/MaxWidth";
import HeightWidth from "../plugins/HeightWidth";

import PhaserJSON  from "../plugins/PhaserJSON";


const state = {

    panels : [],
    values : {
        autosize    :  true,
        maxsize     :  768,
        algorithm   : 'max-height',
        dataformat  : 'phaser-json',
        projectname : 'no name',
    },
    sprites : [],
    projects: [],
    image   : '',
    modal   : '',
    update  : 0,
    spriteUpdate  : 0,

    loaded  : 0,
    toload  : 0,

    canvas  : {},
    dropzone: false,

    classes:{
        canvas : '',
        pointer: ''
    }

};

const mutations = {

    classes_pointer(state, style)
    {
        state.classes.pointer = style;
        document.getElementById('pointer-pos').innerHTML = `.pointer-pos{ ${style} }`;
    },

    classes_canvas(state, style)
    {
        state.classes.canvas = style;
        document.getElementById('canvas-size').innerHTML= `.canvas-size{ ${style} }`;
    },

    guix_update_value(state, payload) {
        state.values[payload.item.store] = payload.value;
    },

    add_panel(state, panel) {
        panel.accordion_slug = 'accordion-' + _.slugify(panel.label);
        state.panels.push(panel);
        state.update++;
    },

    clear_panels(state) {
        state.panels = [];
    },

    project_index(state, data) {
        state.projects = data;
    },

    projectname(state, data) {
        state.values.projectname = data;
    },

    guix_open_modal(state, modal) {
        state.modal = modal;
    },

    guix_close_modal(state) {
        state.modal = '';
    },

    guix_canvas(state, rect){
        state.canvas = rect;
    },

    guix_dropzone(state, set){
        state.dropzone = set;
    },

    image_loaded(state, sprite) {

        sprite.loaded = true;
        sprite.load   = true;

        function imgtrim(sprite){
            let cnvs = document.createElement('canvas');
            cnvs.width  = sprite.size[0];
            cnvs.height = sprite.size[1];

            let ctxs = cnvs.getContext("2d");
            ctxs.drawImage(sprite.img, 0, 0);
            let pixels = ctxs.getImageData(0, 0, cnvs.width, cnvs.height);
            let left   =  1 + cnvs.width;
            let right  = -1;
            let top    =  1 + cnvs.height;
            let bottom = -1;

            for( let y=0; y < cnvs.height; y++){
                for( let x=0; x < cnvs.width; x++){
                    let pidx = 4 * ( x + y * cnvs.width );
                    if (pixels.data[pidx+3] !== 0) {
                        if ( y < top    ) top    = y-1;
                        if ( x < left   ) left   = x-1;
                        if ( y > bottom ) bottom = y+1;
                        if ( x > right  ) right  = x+1;
                    }
                }
            }
            delete cnvs.ctxs;

            if ( right == -1 ) return [0,0,0,0];

            // if ( left > 0 ) left--;
            // if ( top  > 0 ) top--;
            if ( right  < cnvs.width ) right++;
            if ( bottom < cnvs.height) bottom++;

            return [left,top, right-left, bottom-top];

        }

        let d = imgtrim(sprite);
        sprite.size.width  = sprite.size[0];
        sprite.size.height = sprite.size[1];

        sprite.size.sx  = d[0];
        sprite.size.sy  = d[1];
        sprite.size.wx  = d[2];
        sprite.size.wy  = d[3];
        sprite.draw = {};

        state.loaded++;

        if ( state.loaded == state.toload ) {
            this.commit('guix_create_sheet');
            this.dispatch('guix_max_canvas');
        }

    },

    image_error(state, sprite) {
        console.error('cannot load image: ', sprite);
        sprite.loaded = false;
        sprite.load   = true;
    },

    meta_loaded(state, settings) {
        if ( settings === undefined ) return;

        if( settings.size !== undefined )      state.values.maxsize   = settings.size.w;
        if( settings.algorithm !== undefined ) state.values.algorithm = settings.algorithm;
    },

    sprites_loaded(state, sprites) {
        _.forEach(sprites, function(sprite){
            sprite.img = new Image();
        });
        state.sprites = sprites;
        state.toload  = sprites.length;
        state.loaded  = 0;
    },

    sprites_image(state, image) {
        state.image = image;
        state.update++;
    },

    sprites_remove(state, selected){
        let remove = [];
        _.forEach(state.sprites, function (sprite) {
            if (sprite.name == selected.name)
                remove.push(sprite);
        });
        if ( remove.length == 0 ) return;

        let sprites= state.sprites;
        for(let idx= sprites.length-1; idx >= 0; idx--){
            for(let rem= remove.length-1; rem >= 0; rem--){
                if (sprites[idx].name == remove[rem].name)
                {
                    sprites.splice(idx, 1);
                }
            }
        }
        state.sprites = sprites;
        axios.post('/api/sprite/remove', {
                project  : global.project,
                remove   : remove,
            })
            .then(function (response) {
                // console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            });

    },

    sprite_add(state, sprite){
        state.sprites.push(sprite);
        state.sprites = _.sortBy(state.sprites, 'name');
    },

    guix_sprites_upload(state, dropped){

        var reader = [];

        // reader.onloadend = function (event) {
        //     var image = document.getElementById('preview');
        //     image.src = event.target.result;
        // };

        var formData = new FormData();
        var vm = this;

        formData.append('project', JSON.stringify(global.project));

        for (var i = 0; i < dropped.length; i++) {
            console.log(dropped[i]);
            formData.append('file[]', dropped[i]);
        }

        axios.post('/api/sprite/upload', formData)
            .then(function (response) {
                location.reload();
                // console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            });


    },


    sprites_preview(state, selected){
        _.forEach(state.sprites, function (sprite) {
            sprite.selected = false;
        });
        _.forEach(state.sprites, function (sprite) {
            if (sprite.name == selected.name)
                sprite.selected = true;
        });
        state.sprites.splice(0,0);
    },

    guix_close_project(state){
        location.href = '/';
    },

    guix_create_sheet(state){
        let canvas = document.getElementById('canvas');
        let cx  = state.values.maxsize;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let dx  = 0;
        let dy  = 0;
        let ny  = 0;

        let sprites = _.clone(state.sprites);

        switch(state.values.algorithm){
            case 'fit-rect':
                FitRect.sort(sprites, canvas);
                break;
            case 'max-rect':
                MaxRect.sort(sprites, canvas);
                break;
            case 'max-height':
                MaxHeight.sort(sprites, canvas);
                break;
            case 'max-width':
                MaxWidth.sort(sprites, canvas);
                break;
            case 'height-width':
                HeightWidth.sort(sprites, canvas);
        }

        _.forEach(sprites, function(sprite){
            ctx.drawImage(sprite.img,
                sprite.size.sx, sprite.size.sy, sprite.size.wx, sprite.size.wy,
                sprite.draw.dx, sprite.draw.dy, sprite.size.wx, sprite.size.wy);
        });

        axios.post('/api/project/img', {
                project  : global.project,
                file     : PhaserJSON.file(sprites, state.values),
                imgBase64: canvas.toDataURL()
            })
            .then(function (response) {
                // console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            });

    },
};

const actions= {

    guix_index_projects(context){
        axios.get('/api/projects')
            .then(response => {
                context.commit('project_index', response.data);
            })
            .catch(e => {
                this.errors.push(e);
            });
    },

    sprites_load_project(context) {

        axios.get(`/api/projects/${project.folder}`)
            .then(response => {

                // meta ?
                context.commit('meta_loaded', response.data.settings);
                context.dispatch('guix_max_canvas');

                // let JS add an IMG to this data.
                context.commit('sprites_loaded', response.data.sprites);

                let sprites= state.sprites;

                _.forEach(response.data.sprites, function(sprite){
                    sprite.img.onload = function() {
                        context.commit('image_loaded', sprite);
                    };
                    sprite.img.onerror = function() {
                        context.commit('image_error', sprite);
                    };
                    sprite.img.src = sprite.url;
                });

                history.replaceState({}, "project", "/project/" + response.data.folder );

            })
            .catch(e => {
                console.error(e);
            });
    },

    guix_init_panels(context) {

        context.commit('clear_panels');
        context.commit('add_panel', {
            label  : 'Project',
            open   : true,
            panel  : [
                { 'label' : 'Open',     'type' : 'action', 'commit' : 'guix_open_modal' , 'with' : 'open' },
                { 'label' : 'Create',   'type' : 'action', 'commit' : 'guix_open_modal' , 'with' : 'new'  },
            ]
        });

    },

    guix_edit_panels(context) {

        context.commit('clear_panels');

        context.commit('projectname', project.name);

        context.commit('add_panel', {
            label  : 'Project',
            open   : true,
            panel  : [
                { 'label' : 'Project',  'type' : 'text',   'store'  : 'projectname' },
                { 'label' : 'Save',     'type' : 'action', 'commit' : 'guix_save_project'  },
                { 'label' : 'Close',    'type' : 'action', 'commit' : 'guix_close_project' },
            ]
        });

        context.commit('add_panel', {
            label  : 'Geometry',
            open   : true,
            panel  : [
                { 'label' : 'Autosize', 'type' : 'checkbox', 'store' : 'autosize' },
                { 'label' : 'Max size', 'type' : 'pulldown', 'store' : 'maxsize', 'options' : guix_maxsizes }
            ]
        });

        context.commit('add_panel', {
            label  : 'Layout',
            open   : true,
            panel  : [
                { 'label' : 'Algorithm', 'type' : 'pulldown', 'store' : 'algorithm', 'options' : guix_algorithms }
            ]
        });

        context.commit('add_panel', {
            label  : 'Output',
            open   : true,
            panel  : [
                { 'label' : 'Data format',  'type' : 'pulldown', 'store'  : 'dataformat', 'options' : guix_dataformats },
                { 'label' : 'Create Sheet', 'type' : 'action',   'commit' : 'guix_create_sheet'  }
            ]
        });

    },


    guix_max_canvas(context) {

        let left   = document.getElementsByClassName('the-sidebar')[0];
        let right  = document.getElementsByClassName('the-right')[0];
        let scale  = 1;
        let margin = 0;
        if ( left && right ){
            let lwidth= 2+ parseInt(getComputedStyle(left , null).getPropertyValue("width"));
            let rwidth= 2+ parseInt(getComputedStyle(right, null).getPropertyValue("width"));

            let w = window.innerWidth - lwidth - rwidth;
            scale = w / context.state.values.maxsize;
            if ( scale > 1 ) {
                scale = 1;
                margin = ( w - context.state.values.maxsize ) / 2;
            }

            // console.log(scale, w, lwidth, rwidth, window.innerWidth, context.state.values.maxsize);

            let thecanvas = document.getElementById('canvas');
            let rect      = thecanvas.getBoundingClientRect();
            context.commit('guix_canvas', rect);
        }

        context.commit('classes_canvas', `transform: scale(${scale}); margin-left: ${margin}px`);
    },


    guix_set_pointer(context, sprite) {
        // if (!this.sprite) return {};

        let style = {
            'left'          : `${sprite.draw.dx+2}px`,
            'top'           : `${sprite.draw.dy+2}px`,
            'width'         : `${sprite.size.wx}px`,
            'height'        : `${sprite.size.wy}px`,
        };

        let str_style = `left:${style.left};top:${style.top};width:${style.width};height:${style.height}`;
        context.commit('classes_pointer', str_style);
    }


};

const guix_maxsizes = [
    { 'label' : '256x256'  , 'value' : '256' },
    { 'label' : '512x512'  , 'value' : '512' },
    { 'label' : '768x768'  , 'value' : '768' },
    { 'label' : '1024x1024', 'value' : '1024' },
];

const guix_algorithms = [
    { 'label' : 'Fit Rect' ,          'value' : 'fit-rect'     },
    { 'label' : 'Max Rect' ,          'value' : 'max-rect'     },
    { 'label' : 'Max Height' ,        'value' : 'max-height'   },
    { 'label' : 'Max Width' ,         'value' : 'max-width'    },
    { 'label' : 'Height over Width' , 'value' : 'height-width' },
];

const guix_dataformats = [
    { 'label' : 'Phaser JSON', 'value' : 'phaser-json' },
];



export default {
    state,
    mutations,
    actions,
};

