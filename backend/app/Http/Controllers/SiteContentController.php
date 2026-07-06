<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Models\Project;
use App\Models\Service;

class SiteContentController extends Controller
{
    public function index()
    {
        $experiences = Experience::query()
            ->where('is_active', true)
            ->orderByDesc('order')
            ->orderByDesc('start_date')
            ->get()
            ->map(function (Experience $experience) {
                return [
                    'id' => $experience->id,
                    'year' => $experience->end_date
                        ? $experience->start_date->format('Y') . ' - ' . $experience->end_date->format('Y')
                        : $experience->start_date->format('Y') . ' - Present',
                    'company' => $experience->company,
                    'role' => $experience->position,
                    'role_ar' => $experience->position_ar,
                    'description' => $experience->description,
                    'description_ar' => $experience->description_ar,
                    'icon' => $experience->icon,
                    'order' => $experience->order,
                ];
            });

        $services = Service::query()
            ->orderBy('id')
            ->get()
            ->map(function (Service $service) {
                return [
                    'id' => $service->id,
                    'title' => $service->name,
                    'description' => $service->description,
                    'icon' => $service->icon,
                ];
            });

        $stats = [
            [
                'label' => 'Projects Built',
                'label_ar' => 'مشاريع مكتملة',
                'target' => Project::count(),
                'suffix' => '+',
            ],
            [
                'label' => 'Services',
                'label_ar' => 'الخدمات',
                'target' => Service::count(),
                'suffix' => '+',
            ],
            [
                'label' => 'Years Experience',
                'label_ar' => 'سنوات خبرة',
                'target' => 2,
                'suffix' => '+',
            ],
            [
                'label' => 'Client Satisfaction',
                'label_ar' => 'رضا العملاء',
                'target' => 100,
                'suffix' => '%',
            ],
        ];

        $certificates = [
            [
                'title' => 'Laravel Certification',
                'title_ar' => 'شهادة Laravel',
                'issuer' => 'Laravel',
                'issuer_ar' => 'Laravel',
                'date' => '2024',
                'icon' => 'school',
            ],
            [
                'title' => 'React Development',
                'title_ar' => 'تطوير React',
                'issuer' => 'Frontend Academy',
                'issuer_ar' => 'أكاديمية الواجهات',
                'date' => '2025',
                'icon' => 'code',
            ],
            [
                'title' => 'Full Stack Portfolio',
                'title_ar' => 'حافظة Full Stack',
                'issuer' => 'Independent Study',
                'issuer_ar' => 'دراسة مستقلة',
                'date' => '2026',
                'icon' => 'workspace_premium',
            ],
        ];

        return response()->json([
            'experiences' => $experiences,
            'services' => $services,
            'stats' => $stats,
            'certificates' => $certificates,
        ]);
    }
}
