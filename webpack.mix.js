let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
		resolve: {
			alias: {
				'@js'    : path.resolve(__dirname, 'resources/assets/js/'),
				'@vue'   : path.resolve(__dirname, 'resources/assets/vue/'),
				'@store' : path.resolve(__dirname, 'resources/assets/vue/store/modules'),
			}
		}
});

mix.js('resources/components/primer/src/js/primer.js', 'public/js/vendor.js')
	 .sass('resources/components/primer/src/sass/primer.scss', 'public/css/primer.css')
	 .combine([
				'public/css/primer.css',
				'resources/components/font-awesome/css/font-awesome.min.css'
		], 'public/css/vendor.css');

mix.js('resources/assets/js/app.js', 'public/js')
	 .sass('resources/assets/sass/app.scss', 'public/css');
