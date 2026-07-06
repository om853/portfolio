<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\AiUsageController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\SiteContentController;
use App\Services\ApiKeyRotationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::get('fix-admin', function() {
    \App\Models\User::where('email', 'admin@omar.dev')->update(['role' => 'admin']);
    return response()->json(['message' => 'Admin role fixed']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('register/', [AuthController::class, 'register']);
    Route::post('login/', [AuthController::class, 'login']);
    Route::post('logout/', [AuthController::class, 'logout']);
    Route::post('refresh/', [AuthController::class, 'refresh']);
    Route::post('me/', [AuthController::class, 'me']);
    Route::put('profile/', [AuthController::class, 'updateProfile']);
});

// Public Routes
Route::get('config/imgbb-key', function (ApiKeyRotationService $rotation) {
    $keyModels = $rotation->getAvailableKeyModels('imgbb');

    if ($keyModels->isNotEmpty()) {
        $keyModel = $keyModels->first();
        $keyModel->incrementUsage();
        return response()->json(['key' => $keyModel->key]);
    }

    return response()->json(['key' => env('IMGBB_API_KEY')]);
});
Route::get('projects/', [ProjectController::class, 'index']);
Route::get('projects/{project}/', [ProjectController::class, 'show']);
Route::get('skills/', [SkillController::class, 'index']);
Route::get('services/', [ServiceController::class, 'index']);
Route::get('site-content/', [SiteContentController::class, 'index']);
Route::get('testimonials/', [TestimonialController::class, 'index']);
Route::post('messages/', [MessageController::class, 'store']);
Route::post('contact/', [MessageController::class, 'store']);
Route::post('track/', [AnalyticsController::class, 'track']);
Route::post('ai/chat/', [AiChatController::class, 'chat']);
Route::get('ai/providers/', [AiChatController::class, 'providers']);
Route::post('leads/submit/', [LeadController::class, 'store']);
Route::get('experiences/', [ExperienceController::class, 'index']);
Route::get('public-profile/', function () {
    $user = \App\Models\User::first();
    if (!$user) return response()->json(null);
    return response()->json([
        'name' => $user->name,
        'hero_image' => $user->hero_image,
    ]);
});



// Protected Admin Routes
Route::group(['middleware' => 'auth:api'], function() {
    Route::apiResource('projects', ProjectController::class)->except(['index', 'show']);
    Route::apiResource('skills', SkillController::class)->except(['index']);
    Route::apiResource('services', ServiceController::class)->except(['index']);
    Route::apiResource('messages', MessageController::class)->except(['store']);
    Route::apiResource('testimonials', TestimonialController::class)->except(['index']);
    Route::apiResource('leads', LeadController::class)->except(['store']);
    Route::apiResource('experiences', ExperienceController::class)->except(['index']);
    Route::get('stats/', [AnalyticsController::class, 'stats']);

    // API Key Rotation (custom routes BEFORE resource to avoid route conflicts)
    Route::get('api-keys/stats/', [ApiKeyController::class, 'stats']);
    Route::post('api-keys/test/', [ApiKeyController::class, 'testKey']);
    Route::post('api-keys/rotate/', [ApiKeyController::class, 'rotate']);
    Route::post('api-keys/reset/', [ApiKeyController::class, 'resetLimits']);
    Route::apiResource('api-keys', ApiKeyController::class);

    // Team Management
    Route::apiResource('team', TeamController::class);

    // Media Upload
    Route::post('upload/', [MediaController::class, 'upload']);

    // AI Usage Stats
    Route::get('ai/usage/', [AiUsageController::class, 'stats']);

    // Gmail Reply
    Route::post('mail/reply/', [MailController::class, 'reply']);
});
