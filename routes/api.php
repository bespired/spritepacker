<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResources([
    'projects' => 'ProjectController',
]);

Route::post('project/img',    'ProjectController@img')   ->middleware('api');
Route::post('sprite/remove',  'ProjectController@remove')->middleware('api');
Route::post('sprite/upload',  'ProjectController@upload')->middleware('api');