<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create(
    '/api/v1/auth/login',
    'POST',
    ['email' => 'student@test.com', 'password' => 'password']
);
$request->headers->set('Accept', 'application/json');

$response = $kernel->handle($request);
echo $response->getContent();
