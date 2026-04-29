<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DiscoverItem;

class DiscoverItemSeeder extends Seeder
{
    public function run()
    {
        DiscoverItem::truncate();

        DiscoverItem::create([
            'title' => '21-Day Elite Shred',
            'type' => 'Programs',
            'duration' => '3 Weeks',
            'icon' => 'flame.fill',
            'color' => '#f43f5e',
            'route' => '/active-program',
            'is_featured' => true,
            'description' => 'A complete transformation program to lose fat and build lean muscle.',
            'level' => 'Advanced',
            'image' => 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800&auto=format&fit=crop',
        ]);

        $items = [
            [ 'title' => 'Home Full Body HIIT', 'type' => 'Home Workouts', 'duration' => '25 Min', 'icon' => 'figure.run', 'color' => '#f43f5e', 'route' => '/workouts' ],
            [ 'title' => 'Bodyweight Core Blast', 'type' => 'Home Workouts', 'duration' => '15 Min', 'icon' => 'figure.yoga', 'color' => '#3b82f6', 'route' => '/workouts' ],
            [ 'title' => 'Gym', 'type' => 'Gym Workouts', 'duration' => '45 Min', 'icon' => 'figure.strengthtraining.traditional', 'color' => '#84cc16', 'route' => '/gym' ],
            [ 'title' => 'Cable Machine Masterclass', 'type' => 'Gym Workouts', 'duration' => '30 Min', 'icon' => 'bolt.fill', 'color' => '#f59e0b', 'route' => '/workouts' ],
            [ 'title' => 'Macro Counting 101', 'type' => 'Nutrition', 'duration' => 'Guide', 'icon' => 'leaf.fill', 'color' => '#10b981', 'route' => '/nutrition' ],
            [ 'title' => 'Deep Sleep Recovery', 'type' => 'Mindfulness', 'duration' => 'Audio', 'icon' => 'moon.fill', 'color' => '#8b5cf6', 'route' => '/sleep' ],
        ];

        foreach ($items as $item) {
            $item['is_featured'] = false;
            DiscoverItem::create($item);
        }
    }
}
