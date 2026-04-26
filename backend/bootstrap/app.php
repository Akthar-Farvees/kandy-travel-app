<?php

use App\Http\Middleware\EnsureIsAdmin;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'is_admin' => EnsureIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $renderApiError = static function (
            Request $request,
            string $message,
            int $status,
            ?array $errors = null,
            ?string $errorCode = null
        ) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => $message,
                'errors' => $errors,
                'error_code' => $errorCode,
            ], $status);
        };

        $exceptions->render(function (ValidationException $exception, Request $request) use ($renderApiError) {
            return $renderApiError(
                $request,
                'Validation error',
                422,
                $exception->errors(),
                'VALIDATION_ERROR',
            );
        });

        $exceptions->render(function (AuthenticationException $exception, Request $request) use ($renderApiError) {
            return $renderApiError(
                $request,
                'Authentication required.',
                401,
                null,
                'AUTHENTICATION_REQUIRED',
            );
        });

        $exceptions->render(function (AuthorizationException $exception, Request $request) use ($renderApiError) {
            return $renderApiError(
                $request,
                $exception->getMessage() ?: 'You are not authorized to perform this action.',
                403,
                null,
                'FORBIDDEN',
            );
        });

        $exceptions->render(function (ModelNotFoundException $exception, Request $request) use ($renderApiError) {
            return $renderApiError(
                $request,
                'Resource not found.',
                404,
                null,
                'RESOURCE_NOT_FOUND',
            );
        });

        $exceptions->render(function (NotFoundHttpException $exception, Request $request) use ($renderApiError) {
            return $renderApiError(
                $request,
                'Resource not found.',
                404,
                null,
                'RESOURCE_NOT_FOUND',
            );
        });

        $exceptions->render(function (TooManyRequestsHttpException $exception, Request $request) use ($renderApiError) {
            return $renderApiError(
                $request,
                'Too many requests. Please try again later.',
                429,
                null,
                'RATE_LIMITED',
            );
        });

        $exceptions->render(function (\Throwable $exception, Request $request) use ($renderApiError) {
            return $renderApiError(
                $request,
                'Something went wrong while processing the request.',
                500,
                null,
                'INTERNAL_SERVER_ERROR',
            );
        });
    })
    ->create();
