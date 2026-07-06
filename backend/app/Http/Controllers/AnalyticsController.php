<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\PageHit;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function stats()
    {
        $now = Carbon::now();
        $weekStart = $now->copy()->startOfWeek();
        $lastWeekStart = $weekStart->copy()->subWeek();
        $lastWeekEnd = $weekStart->copy()->subSecond();

        // Page views this week vs last week
        $thisWeekViews = PageHit::where('created_at', '>=', $weekStart)->count();
        $lastWeekViews = PageHit::whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])->count();

        // Unique visitors this week vs last week
        $thisWeekVisitors = PageHit::where('created_at', '>=', $weekStart)->distinct('ip_address')->count('ip_address');
        $lastWeekVisitors = PageHit::whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])->distinct('ip_address')->count('ip_address');

        // View change percentage
        $viewChange = $lastWeekViews > 0 ? round((($thisWeekViews - $lastWeekViews) / $lastWeekViews) * 100) : ($thisWeekViews > 0 ? 100 : 0);
        $visitorChange = $lastWeekVisitors > 0 ? round((($thisWeekVisitors - $lastWeekVisitors) / $lastWeekVisitors) * 100) : ($thisWeekVisitors > 0 ? 100 : 0);

        // Most engaging project
        $topProject = Project::orderByDesc('views')->first();

        // Skills breakdown
        $skillsByCategory = Skill::select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();

        // Message stats
        $totalMessages = Message::count();
        $repliedMessages = Message::whereNotNull('replied_at')->count();
        $responseRate = $totalMessages > 0 ? round(($repliedMessages / $totalMessages) * 100) : 0;

        // Tech stack frequency across projects
        $techUsage = [];
        $projects = Project::whereNotNull('tech_stack')->get();
        foreach ($projects as $project) {
            $stack = $project->tech_stack;
            if (is_array($stack)) {
                foreach ($stack as $tech) {
                    $tech = trim($tech);
                    $techUsage[$tech] = ($techUsage[$tech] ?? 0) + 1;
                }
            }
        }
        arsort($techUsage);
        $topTechs = array_slice($techUsage, 0, 5);

        // Top pages
        $topPages = PageHit::select('path', DB::raw('count(*) as count'))
            ->groupBy('path')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Total message threads (conversations by email)
        $uniqueSenders = Message::distinct('email')->count('email');

        // All-time project views
        $totalProjectViews = Project::sum('views');

        // Compute AI insights
        $insights = [];

        // Performance insight
        if ($thisWeekViews > 0 && $lastWeekViews == 0) {
            $insights[] = [
                'type' => 'performance',
                'title' => 'Performance Trend',
                'message' => "Your portfolio is gaining traction with {$thisWeekViews} page views this week. " . ($topProject ? "\"{$topProject->title}\" is your most viewed project with {$topProject->views} views." : ''),
                'trend' => 'up',
                'change' => $viewChange,
            ];
        } elseif ($viewChange > 0) {
            $insights[] = [
                'type' => 'performance',
                'title' => 'Performance Trend',
                'message' => "Page views are up {$viewChange}% this week compared to last week. " . ($topProject ? "\"{$topProject->title}\" remains your most engaging project with {$topProject->views} views." : ''),
                'trend' => 'up',
                'change' => $viewChange,
            ];
        } elseif ($viewChange < 0) {
            $insights[] = [
                'type' => 'performance',
                'title' => 'Performance Trend',
                'message' => "Page views dropped {$viewChange}% this week. Consider refreshing your projects or sharing on social media to boost engagement.",
                'trend' => 'down',
                'change' => abs($viewChange),
            ];
        } else {
            $insights[] = [
                'type' => 'performance',
                'title' => 'Performance Trend',
                'message' => "Page views are steady this week with {$thisWeekViews} views. " . ($topProject ? "\"{$topProject->title}\" leads with {$topProject->views} views." : ''),
                'trend' => 'neutral',
                'change' => 0,
            ];
        }

        // Skills insight
        $backendSkills = Skill::where('category', 'Backend')->count();
        $frontendSkills = Skill::where('category', 'Frontend')->count();
        $backendProjects = 0;
        foreach ($projects as $project) {
            $stack = $project->tech_stack;
            if (is_array($stack)) {
                foreach ($stack as $tech) {
                    $t = strtolower(trim($tech));
                    if (in_array($t, ['laravel', 'php', 'mysql', 'mongodb', 'node.js', 'node', 'python', 'api', 'rest'])) {
                        $backendProjects++;
                        break;
                    }
                }
            }
        }

        if ($backendSkills > $backendProjects) {
            $insights[] = [
                'type' => 'skills',
                'title' => 'Skill Optimization',
                'message' => "You have {$backendSkills} backend skills but only {$backendProjects} project" . ($backendProjects !== 1 ? 's' : '') . " highlighting them. Consider adding more backend-focused case studies to showcase your full-stack expertise.",
                'trend' => 'neutral',
                'change' => null,
            ];
        } else {
            $insights[] = [
                'type' => 'skills',
                'title' => 'Skill Optimization',
                'message' => "Your {$frontendSkills} frontend and {$backendSkills} backend skills are well-represented across your projects. Great balance!",
                'trend' => 'up',
                'change' => null,
            ];
        }

        // Visitor insight
        if ($visitorChange > 0) {
            $insights[] = [
                'type' => 'visitors',
                'title' => 'Audience Growth',
                'message' => "New visitor traffic grew {$visitorChange}% this week. Your reach is expanding — keep up the great work!",
                'trend' => 'up',
                'change' => $visitorChange,
            ];
        } elseif ($totalMessages > 0) {
            $insights[] = [
                'type' => 'visitors',
                'title' => 'Engagement Rate',
                'message' => "You've received {$totalMessages} message" . ($totalMessages !== 1 ? 's' : '') . " total with a {$responseRate}% response rate" . ($repliedMessages > 0 ? " ({$repliedMessages} replied)" : '') . ".",
                'trend' => 'neutral',
                'change' => null,
            ];
        }

        // Tech stack insight
        if (!empty($topTechs)) {
            $topTech = array_key_first($topTechs);
            $insights[] = [
                'type' => 'tech',
                'title' => 'Tech Stack Trend',
                'message' => "\"{$topTech}\" is your most-used technology, appearing in {$topTechs[$topTech]} project" . ($topTechs[$topTech] !== 1 ? 's' : '') . ". " . (count($topTechs) > 1 ? "Followed by " . implode(', ', array_map(function ($t, $c) { return "\"{$t}\" ({$c})"; }, array_keys(array_slice($topTechs, 1, 3)), array_slice($topTechs, 1, 3))) . '.' : ''),
                'trend' => 'up',
                'change' => null,
            ];
        }

        // Hits by date (last 30 days for chart)
        $hitsByDate = PageHit::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', $now->copy()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Hits by day of week (for a secondary chart)
        $hitsByDayOfWeek = PageHit::select(DB::raw('DAYNAME(created_at) as day'), DB::raw('count(*) as count'))
            ->groupBy('day')
            ->orderByRaw("FIELD(DAYNAME(created_at), 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
            ->get();

        return response()->json([
            'total_projects' => Project::count(),
            'total_skills' => Skill::count(),
            'total_messages' => $totalMessages,
            'unread_messages' => Message::where('is_read', false)->count(),
            'total_visitors' => PageHit::distinct('ip_address')->count('ip_address'),
            'total_page_views' => PageHit::count(),
            'total_project_views' => $totalProjectViews,
            'unique_senders' => $uniqueSenders,
            'response_rate' => $responseRate,
            'this_week_views' => $thisWeekViews,
            'last_week_views' => $lastWeekViews,
            'this_week_visitors' => $thisWeekVisitors,
            'last_week_visitors' => $lastWeekVisitors,
            'view_change' => $viewChange,
            'visitor_change' => $visitorChange,
            'top_project' => $topProject ? [
                'id' => $topProject->id,
                'title' => $topProject->title,
                'views' => $topProject->views,
            ] : null,
            'top_techs' => $topTechs,
            'top_pages' => $topPages,
            'skills_by_category' => $skillsByCategory,
            'insights' => $insights,
            'hits_by_date' => $hitsByDate,
            'hits_by_day_of_week' => $hitsByDayOfWeek,
        ]);
    }

    public function track(Request $request)
    {
        $validated = $request->validate([
            'path' => 'required|string',
        ]);

        PageHit::create([
            'path' => $validated['path'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['message' => 'Tracked'], 201);
    }
}
