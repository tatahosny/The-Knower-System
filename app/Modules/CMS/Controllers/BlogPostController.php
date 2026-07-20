<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\BlogPost;

class BlogPostController extends Controller
{
    public function index() { return response()->json(["data" => BlogPost::latest()->get()]); }
    public function store(Request $request) { return response()->json(["data" => BlogPost::create($request->all())]); }
    public function show(BlogPost $model) { return response()->json(["data" => $model]); }
    public function update(Request $request, BlogPost $model) { $model->update($request->all()); return response()->json(["data" => $model]); }
    public function destroy(BlogPost $model) { $model->delete(); return response()->json(["message" => "Deleted"]); }
}
