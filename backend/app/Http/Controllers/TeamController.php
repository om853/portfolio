<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TeamController extends Controller
{
    public function index()
    {
        return response()->json(
            User::where('role', '!=', 'admin')->get()
        );
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $authResponse = $this->authorizeAdmin();
        if ($authResponse !== true) {
            return $authResponse;
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in(['admin', 'team'])],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'role' => $request->input('role'),
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $authResponse = $this->authorizeAdmin();
        if ($authResponse !== true) {
            return $authResponse;
        }

        if ($user->id === 1) {
            return response()->json(['message' => 'The owner cannot be modified by other admins'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['sometimes', 'required', Rule::in(['admin', 'team'])],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'email', 'role']);
        if ($request->filled('name')) $data['name'] = $request->input('name');
        if ($request->filled('email')) $data['email'] = $request->input('email');
        if ($request->filled('role')) $data['role'] = $request->input('role');

        $user->update($data);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $authResponse = $this->authorizeAdmin();
        if ($authResponse !== true) {
            return $authResponse;
        }

        if ($user->id === 1) {
            return response()->json(['message' => 'Cannot delete the owner'], 403);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    private function authorizeAdmin()
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Access denied: Admin privileges required'], 403);
        }

        return true;
    }
}
