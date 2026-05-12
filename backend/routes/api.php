<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {

    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/refresh-token', [AuthController::class, 'refresh']);
        
        // Terproteksi JWT
        Route::middleware([\App\Http\Middleware\AuthMiddleware::class])->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/change-password', [AuthController::class, 'changePassword']);
            
            // Endpoint untuk cek user aktif
            Route::get('/me', function (Request $request) {
                return response()->json([
                    'status' => 'success',
                    'data' => auth()->user()
                ]);
            });
        });
    });

    // Public Endpoints (Semua pengguna login)
    Route::middleware([\App\Http\Middleware\AuthMiddleware::class])->group(function () {
        Route::get('/tags/public', [\App\Http\Controllers\PublicTagController::class, 'index']);
        
        // Notifications
        Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    });

    // User Management Routes (Hanya Admin)
    Route::middleware([\App\Http\Middleware\AuthMiddleware::class, \App\Http\Middleware\RoleMiddleware::class.':Admin'])->group(function () {
        Route::apiResource('users', \App\Http\Controllers\UserController::class);
        Route::apiResource('tags', \App\Http\Controllers\TagController::class);
        
        // Admin Opportunities Review
        Route::get('admin/opportunities', [\App\Http\Controllers\AdminOpportunityController::class, 'index']);
        Route::patch('admin/opportunities/{opportunity}/review', [\App\Http\Controllers\AdminOpportunityController::class, 'review']);
        
        // Admin Dashboard Stats
        Route::get('admin/dashboard/stats', [\App\Http\Controllers\AdminDashboardController::class, 'getStatistics']);
    });

    // Student Routes (Hanya Student)
    Route::middleware([\App\Http\Middleware\AuthMiddleware::class, \App\Http\Middleware\RoleMiddleware::class.':Student'])->group(function () {
        // Student Profile
        Route::get('/student/profile', [\App\Http\Controllers\StudentProfileController::class, 'show']);
        Route::put('/student/profile', [\App\Http\Controllers\StudentProfileController::class, 'update']);
        Route::post('/student/profile/cv', [\App\Http\Controllers\StudentProfileController::class, 'uploadCv']);
        
        // Portfolios
        Route::apiResource('student/portfolios', \App\Http\Controllers\PortfolioController::class);

        // Tags
        Route::get('/student/tags/available', [\App\Http\Controllers\StudentTagController::class, 'index']);
        Route::post('/student/tags', [\App\Http\Controllers\StudentTagController::class, 'sync']);

        // Projects
        Route::apiResource('student/projects', \App\Http\Controllers\ProjectController::class)->only(['index', 'store', 'show']);
        Route::post('student/projects/{project}/join', [\App\Http\Controllers\ProjectMemberController::class, 'join']);
        Route::patch('student/projects/members/{member}/review', [\App\Http\Controllers\ProjectMemberController::class, 'review']);

        // Applications
        Route::get('/student/opportunities', [\App\Http\Controllers\StudentApplicationController::class, 'availableOpportunities']);
        Route::post('/student/opportunities/{opportunity}/apply', [\App\Http\Controllers\StudentApplicationController::class, 'apply']);
        Route::get('/student/applications', [\App\Http\Controllers\StudentApplicationController::class, 'myApplications']);

        // Recommendations
        Route::get('/student/recommendations', [\App\Http\Controllers\RecommendationController::class, 'index']);
    });

    // Partner Routes (Hanya Partner)
    Route::middleware([\App\Http\Middleware\AuthMiddleware::class, \App\Http\Middleware\RoleMiddleware::class.':Partner'])->group(function () {
        Route::apiResource('partner/opportunities', \App\Http\Controllers\PartnerOpportunityController::class);
        
        // Manage Applications
        Route::get('partner/opportunities/{opportunity}/applications', [\App\Http\Controllers\PartnerApplicationController::class, 'applicantsForOpportunity']);
        Route::patch('partner/applications/{application}/review', [\App\Http\Controllers\PartnerApplicationController::class, 'review']);
    });

});
