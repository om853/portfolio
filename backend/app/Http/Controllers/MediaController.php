<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $file = $request->file('image');
        $name = Str::random(20) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('uploads', $name, 'public');

        return response()->json([
            'url' => url(Storage::url($path)),
        ]);
    }
}
