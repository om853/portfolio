<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\Message;
use App\Models\PageHit;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Testimonial;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // --- Skills ---
        $skills = [
            ['name' => 'React.js', 'category' => 'Frontend', 'level' => 95],
            ['name' => 'Next.js', 'category' => 'Frontend', 'level' => 80],
            ['name' => 'JavaScript', 'category' => 'Frontend', 'level' => 92],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'level' => 78],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'level' => 95],
            ['name' => 'Framer Motion', 'category' => 'Frontend', 'level' => 85],
            ['name' => 'Laravel', 'category' => 'Backend', 'level' => 88],
            ['name' => 'PHP', 'category' => 'Backend', 'level' => 85],
            ['name' => 'RESTful APIs', 'category' => 'Backend', 'level' => 90],
            ['name' => 'MySQL', 'category' => 'Database', 'level' => 82],
            ['name' => 'MongoDB', 'category' => 'Database', 'level' => 65],
            ['name' => 'Git', 'category' => 'Tools', 'level' => 88],
            ['name' => 'Docker', 'category' => 'DevOps', 'level' => 60],
            ['name' => 'Figma', 'category' => 'Tools', 'level' => 75],
        ];
        foreach ($skills as $s) {
            Skill::create($s);
        }

        // --- Projects ---
        $projects = [
            [
                'title' => 'Nova Banking',
                'title_ar' => 'نوفا Banking',
                'type' => 'fullstack',
                'description' => 'A modern digital banking platform with real-time transaction tracking, budgeting tools, and AI-powered financial insights. Built with a focus on security, performance, and a seamless user experience across devices.',
                'description_ar' => 'منصة مصرفية رقمية حديثة مع تتبع المعاملات في الوقت الفعلي وأدوات الميزانية والرؤى المالية المدعومة بالذكاء الاصطناعي.',
                'tech_stack' => ['React.js', 'TypeScript', 'Tailwind CSS', 'Laravel', 'MySQL', 'Framer Motion'],
                'live_demo' => 'https://nova-banking-demo.vercel.app',
                'github' => 'https://github.com/om853/nova-banking',
                'is_featured' => true,
                'views' => 1250,
                'image' => '/nova-banking.png',
            ],
            [
                'title' => 'E-Commerce Dashboard',
                'title_ar' => 'لوحة تحكم التجارة الإلكترونية',
                'type' => 'fullstack',
                'description' => 'Comprehensive admin dashboard for an e-commerce platform featuring real-time sales analytics, inventory management, customer insights, and order fulfillment tracking.',
                'description_ar' => 'لوحة تحكم شاملة لمنصة تجارة إلكترونية مع تحليلات مبيعات في الوقت الفعلي وإدارة المخزون.',
                'tech_stack' => ['React.js', 'Tailwind CSS', 'Laravel', 'MySQL', 'Recharts'],
                'live_demo' => 'https://ecommerce-demo.vercel.app',
                'github' => 'https://github.com/om853/ecommerce-dashboard',
                'is_featured' => true,
                'views' => 890,
                'image' => '/ecommerce.png',
            ],
            [
                'title' => 'TaskFlow Project Manager',
                'title_ar' => 'مدير مشاريع TaskFlow',
                'type' => 'fullstack',
                'description' => 'A collaborative project management tool with Kanban boards, Gantt charts, team chat, and automated workflow triggers. Supports multi-language and RTL layouts.',
                'description_ar' => 'أداة إدارة مشاريع تعاونية مع لوحات Kanban ورسوم بيانية Gantt ومحادثات الفريق.',
                'tech_stack' => ['Next.js', 'TypeScript', 'Laravel', 'MongoDB', 'Framer Motion'],
                'live_demo' => 'https://taskflow-demo.vercel.app',
                'github' => 'https://github.com/om853/taskflow',
                'is_featured' => true,
                'views' => 720,
                'image' => '/taskflow.png',
            ],
            [
                'title' => 'WeatherWise App',
                'title_ar' => 'تطبيق WeatherWise',
                'type' => 'frontend',
                'description' => 'A beautiful weather application with 7-day forecasts, interactive maps, severe weather alerts, and location-based customization. Features smooth animations and glassmorphism design.',
                'description_ar' => 'تطبيق طقس جميل مع توقعات 7 أيام وخرائط تفاعلية وتنبيهات الطقس القاسي.',
                'tech_stack' => ['React.js', 'JavaScript', 'Tailwind CSS', 'Framer Motion'],
                'live_demo' => 'https://weatherwise-demo.vercel.app',
                'github' => 'https://github.com/om853/weatherwise',
                'is_featured' => false,
                'views' => 450,
                'image' => '/weatherwise.png',
            ],
            [
                'title' => 'API Forge - Backend Service',
                'title_ar' => 'API Forge - خدمة خلفية',
                'type' => 'backend',
                'description' => 'A scalable RESTful API service generator with built-in authentication, rate limiting, API key rotation, webhook support, and automatic documentation generation via Swagger.',
                'description_ar' => 'مولد خدمة API RESTful قابل للتوسع مع مصادقة مدمجة وتحديد معدل وتدوير مفاتيح API.',
                'tech_stack' => ['Laravel', 'PHP', 'MySQL', 'Redis'],
                'live_demo' => null,
                'github' => 'https://github.com/om853/api-forge',
                'is_featured' => false,
                'views' => 310,
                'image' => '/api-forge.png',
            ],
        ];
        foreach ($projects as $p) {
            Project::create($p);
        }

        // --- Services ---
        $services = [
            ['name' => 'Web Application Development', 'description' => 'Custom frontend and backend development with React and Laravel for fast, robust applications.', 'icon' => 'code'],
            ['name' => 'API Development & Integration', 'description' => 'Designing secure, scalable RESTful APIs and connecting third-party services smoothly.', 'icon' => 'api'],
            ['name' => 'UI/UX Interactive Design', 'description' => 'Crafting highly interactive, modern, and animated interfaces for exceptional user engagement.', 'icon' => 'design_services'],
        ];
        foreach ($services as $s) {
            Service::create($s);
        }

        // --- Testimonials ---
        $testimonials = [
            ['name' => 'Ahmed Hassan', 'position' => 'CTO, TechVista Solutions', 'message' => 'Omar delivered an exceptional full-stack application for our fintech startup. His attention to detail and deep understanding of both frontend and backend technologies made the collaboration seamless.', 'avatar' => null],
            ['name' => 'Sarah Johnson', 'position' => 'Product Manager, WebCraft Agency', 'message' => 'Working with Omar was a fantastic experience. He transformed our complex requirements into a beautiful, performant web application. The animations and UX are top-notch.', 'avatar' => null],
            ['name' => 'Mohammed Ali', 'position' => 'Founder, Digital Horizon', 'message' => 'Omar built our entire e-commerce platform from scratch. The admin dashboard he created gives us incredible insights into our business. Highly recommended for any full-stack project.', 'avatar' => null],
        ];
        foreach ($testimonials as $t) {
            Testimonial::create($t);
        }

        // --- Page Hits (30 days of realistic data) ---
        $paths = ['/', '/projects', '/about', '/skills', '/contact', '/services', '/certificates'];
        $ips = [
            '192.168.1.' . rand(10, 200),
            '10.0.0.' . rand(10, 200),
            '172.16.0.' . rand(10, 200),
            '203.0.113.' . rand(10, 200),
            '198.51.100.' . rand(10, 200),
        ];

        $now = Carbon::now();
        for ($day = 30; $day >= 0; $day--) {
            $date = $now->copy()->subDays($day);
            $isWeekend = $date->isFriday() || $date->isSaturday();
            $baseCount = $isWeekend ? rand(5, 15) : rand(12, 40);

            for ($i = 0; $i < $baseCount; $i++) {
                DB::table('page_hits')->insert([
                    'path' => $paths[array_rand($paths)],
                    'ip_address' => $ips[array_rand($ips)],
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'created_at' => $date->copy()->addHours(rand(0, 23))->addMinutes(rand(0, 59)),
                    'updated_at' => $date->copy()->addHours(rand(0, 23))->addMinutes(rand(0, 59)),
                ]);
            }
        }

        // --- Messages ---
        $messages = [
            ['name' => 'Ali Mansour', 'email' => 'ali.mansour@email.com', 'phone' => '+201001234567', 'subject' => 'Project Inquiry - Fintech Dashboard', 'message' => 'Hi Omar, I came across your portfolio and I am impressed by your work on Nova Banking. We are looking for a full-stack developer to build a similar fintech dashboard for our startup. Are you available for freelance work? Let me know your rates and availability.', 'is_read' => true, 'replied_at' => $now->copy()->subDays(2)],
            ['name' => 'Emily Roberts', 'email' => 'emily.r@agency.com', 'phone' => '+12025551234', 'subject' => 'Full-Time Opportunity', 'message' => 'Hi Omar, we are a growing tech agency in New York looking for a talented React + Laravel developer to join our team full-time. Your portfolio showcases exactly the kind of work we do. Would you be open to a conversation about this opportunity?', 'is_read' => true, 'replied_at' => null],
            ['name' => 'Karim Abdelaziz', 'email' => 'karim@startup-eg.com', 'phone' => '+201098765432', 'subject' => 'Website Redesign', 'message' => 'Salam Omar, we need to completely redesign our company website with a modern, interactive feel. We love the kinetic aesthetic you have on your own portfolio. Can you take on a project of this scale? We have a budget and timeline ready to discuss.', 'is_read' => false, 'replied_at' => null],
            ['name' => 'Dr. Nourhan Youssef', 'email' => 'nourhan.y@edu.eg', 'phone' => '+201550044332', 'subject' => 'Educational Platform', 'message' => 'I am developing an online learning platform for our university and your full-stack expertise seems like a perfect fit. The platform needs real-time attendance tracking, assignment submission, and a discussion forum. Would you be interested in building this?', 'is_read' => false, 'replied_at' => null],
        ];
        foreach ($messages as $m) {
            Message::create($m);
        }

        // --- Experiences ---
        $experiences = [
            [
                'company' => 'Tech Corp',
                'position' => 'Full Stack Developer',
                'position_ar' => 'مطور ويب متكامل',
                'description' => 'Building and maintaining scalable web applications using Laravel and React.js. Led a team of 5 developers in delivering a major fintech platform. Implemented CI/CD pipelines and automated testing.',
                'description_ar' => 'بناء وصيانة تطبيقات ويب قابلة للتوسع باستخدام Laravel و React.js. قاد فريقًا من 5 مطورين في تقديم منصة تقنية مالية رئيسية. تنفيذ خطط CI/CD والاختبار الآلي.',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'company' => 'Digital Solutions Inc',
                'position' => 'Backend Developer',
                'position_ar' => 'مطور خلفي',
                'description' => 'Designed and developed RESTful APIs handling 1M+ daily requests. Optimized database queries reducing response times by 40%. Integrated third-party services including payment gateways and SMS providers.',
                'description_ar' => 'تصميم وتطوير واجهات برمجة تطبيقات RESTful تعالج أكثر من 1M طلب يوميًا. تحسين استعلامات قاعدة البيانات مما قلل أوقات الاستجابة بنسبة 40%. دمج خدمات الطرف الثالث بما في ذلك بوابات الدفع وموفري SMS.',
                'start_date' => '2022-06-01',
                'end_date' => '2023-12-31',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'company' => 'WebCraft Agency',
                'position' => 'Frontend Developer',
                'position_ar' => 'مطور واجهات أمامية',
                'description' => 'Developed responsive React.js web applications with Tailwind CSS and Framer Motion animations. Collaborated with designers to create pixel-perfect UI implementations. Reduced page load times by 35% through code splitting and lazy loading.',
                'description_ar' => 'تطوير تطبيقات ويب تفاعلية باستخدام React.js مع Tailwind CSS ورسوم متحركة Framer Motion. التعاون مع المصممين لإنشاء تطبيقات واجهة دقيقة. تقليل أوقات تحميل الصفحة بنسبة 35% من خلال تقسيم الكود والتحميل البطيء.',
                'start_date' => '2021-01-01',
                'end_date' => '2022-05-31',
                'order' => 1,
                'is_active' => true,
            ],
        ];
        foreach ($experiences as $e) {
            Experience::create($e);
        }
    }
}
