<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CMS\Models\MarketingPlan;
use App\Modules\CMS\Models\Testimonial;
use App\Modules\CMS\Models\Faq;
use App\Modules\CMS\Models\BlogPost;
use App\Modules\CMS\Models\TeamMember;
use App\Modules\CMS\Models\Service;
use App\Modules\Projects\Models\Project;
use App\Modules\HR\Models\JobPosting;

class PublicApiController extends Controller
{
    public function portfolio()
    {
        return response()->json([
            'projects' => Project::where('is_public', true)->get()
        ]);
    }

    public function pricing()
    {
        return response()->json([
            'plans' => MarketingPlan::all(),
        ]);
    }

    public function testimonials()
    {
        return response()->json([
            'testimonials' => Testimonial::where('is_published', true)->get()
        ]);
    }

    public function faqs()
    {
        return response()->json([
            'faqs' => Faq::orderBy('sort_order')->get()
        ]);
    }

    public function blog()
    {
        return response()->json([
            'posts' => BlogPost::where('is_published', true)->orderBy('published_at', 'desc')->get()
        ]);
    }

    public function team()
    {
        return response()->json([
            'team' => TeamMember::where('is_published', true)->orderBy('sort_order')->get()
        ]);
    }

    public function services()
    {
        return response()->json([
            'services' => Service::where('is_published', true)->orderBy('sort_order')->get()
        ]);
    }

    public function careers()
    {
        // Assuming JobPosting exists or we can just return empty array if not.
        if (class_exists(JobPosting::class)) {
            return response()->json([
                'jobs' => JobPosting::where('status', 'open')->get()
            ]);
        }
        return response()->json(['jobs' => []]);
    }
}
