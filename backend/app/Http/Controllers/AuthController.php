<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Mail;
use App\Mail\LoginNotification;
use App\Services\ResendService;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->only(['email', 'password']);

            if (! $token = auth('api')->attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $loggedUser = auth('api')->user();
            if ($loggedUser->role !== 'admin') {
                try {
                    $notification = new LoginNotification(
                        $loggedUser->name,
                        $loggedUser->email,
                        $request->ip(),
                        $request->userAgent() ?? 'Unknown'
                    );
                    $resend = app(ResendService::class);
                    $resend->sendEmail(
                        'mrmhmdalshhatly@gmail.com',
                        "Dashboard Login: " . $loggedUser->name,
                        $notification->buildHtml()
                    );
                } catch (\Exception $e) {
                    \Log::error('Login notification email failed: ' . $e->getMessage());
                }
            }

            return $this->respondWithToken($token);
        } catch (\Throwable $e) {
            \Log::error('Login failed: ' . $e->getMessage() . '\n' . $e->getTraceAsString());
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ], 201);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Update user profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|between:2,100',
            'email' => 'sometimes|required|string|email|max:100|unique:users,email,'.$user->id,
            'password' => 'sometimes|nullable|string|min:6',
            'avatar' => 'sometimes|nullable|string',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        if ($request->has('name')) {
            $user->name = $request->get('name');
        }
        if ($request->has('email')) {
            $user->email = $request->get('email');
        }
        if ($request->filled('password')) {
            $user->password = Hash::make($request->get('password'));
        }
        if ($request->has('avatar')) {
            $user->avatar = $request->get('avatar');
        }
        if ($request->has('hero_image') && $user->id === 1) {
            $user->hero_image = $request->get('hero_image');
        }


        $user->save();

        return response()->json([
            'message' => 'Profile successfully updated',
            'user' => $user
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $user = auth('api')->user();
        $token = auth('api')->refresh();
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user
        ]);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user()
        ]);
    }
}
