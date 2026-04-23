<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'welcome';
});

Route::get('/home', function(){
    return 'home';
});

Route::get('/about', function(){
    return 'about us';
});