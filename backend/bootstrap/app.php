<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle JWT auth exceptions → return 401
        $exceptions->render(function (TokenExpiredException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Token has expired'], 401);
            }
        });
        $exceptions->render(function (TokenInvalidException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Token is invalid'], 401);
            }
        });
        $exceptions->render(function (TokenBlacklistedException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Token is blacklisted'], 401);
            }
        });
        $exceptions->render(function (JWTException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Token not provided or invalid'], 401);
            }
        });
        // Handle generic auth exception → return 401
        $exceptions->render(function (AuthenticationException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
        });
        // Add CORS headers to all error responses
        $exceptions->respond(function ($response) {
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            return $response;
        });
        // Generic fallback for API routes
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                $msg = $e->getMessage();
                if (empty($msg) && $status === 500) {
                    $msg = 'Internal server error';
                }
                return response()->json(['error' => $msg], $status);
            }
        });
    })->create();
