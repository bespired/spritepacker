Build with
* laravel 5.5 as server
* vuejs 2 as frontend
* webpack for ES2015

# SPRITEPACKER

[![SPRITEPACKER](https://github.com/bespired/spritepacker/blob/master/public/projects/spritepacker.png?raw=true)](https://github.com/bespired/spritepacker)


If you only need the app then clone the project

```sh
$ git clone https://github.com/bespired/spritepacker.git spritepacker
```

install laravel

```sh
$ cd spritepacker
$ composer install
```

run server

```sh
$ php artisan serve
```


open a browser on http://localhost:8000/ and you are ready to go.
spritepacker uses no database, all data is stored in the project folder.

spritesheets are made in public/projects



### Development
For development on spritepacker
install the node modules

```sh
$ cd spritepacker
$ npm install
```

and run watch in another terminal aside from your backend server
```sh
$ npm run watch
```

