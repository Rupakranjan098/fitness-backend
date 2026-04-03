<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DietPlanController extends Controller
{
    public function getPlan(Request $request) {
        $weight = $request->input('weight');
        $height = $request->input('height');
        $goal = $request->input('goal'); // 'bulk', 'cut', 'recomp'

        if (!$goal) {
            return response()->json(['error' => 'Goal is required'], 400);
        }

        $plans = [
            'bulk' => [
                'name' => 'Bulking Diet (Muscle Size + Power)',
                'calorie_change' => '+300–500 kcal Surplus',
                'sections' => [
                    ['title' => 'Empty Stomach', 'items' => ['1 glass warm water + honey', '5 soaked almonds + 2 walnuts'], 'icon' => 'sun.max.fill', 'image' => 'https://images.unsplash.com/photo-1544244015-0cd4b3ff279d?w=400'],
                    ['title' => 'Breakfast', 'items' => ['4 whole eggs (or 100g Paneer)', '2 brown bread / 2 Roti', '1 banana', '1 glass milk'], 'icon' => 'egg.fill', 'image' => 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400'],
                    ['title' => 'Mid-Morning', 'items' => ['Peanut butter sandwich', 'Banana shake'], 'icon' => 'clock.fill', 'image' => 'https://images.unsplash.com/photo-1528751014839-42b176bc21e7?w=400'],
                    ['title' => 'Lunch', 'items' => ['Rice (1–2 cups)', 'Chicken 150g / Paneer 150g', 'Dal + Salad'], 'icon' => 'bowl.fill', 'image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'],
                    ['title' => 'Pre-Workout', 'items' => ['1 banana + Black coffee'], 'icon' => 'bolt.fill', 'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'],
                    ['title' => 'Post-Workout', 'items' => ['Whey protein (1 scoop) OR 4 boiled eggs', '1 banana'], 'icon' => 'figure.strengthtraining.traditional', 'image' => 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400'],
                    ['title' => 'Dinner', 'items' => ['2–3 Roti', 'Chicken / Fish / Paneer', 'Veg Sabzi'], 'icon' => 'moon.fill', 'image' => 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400'],
                ],
                'tips' => ['Eat every 2–3 hours', 'Protein: 1.6–2g per kg body weight'],
                'color' => '#f59e0b'
            ],
            'cut' => [
                'name' => 'Fat Loss Diet (Cutting / Weight Loss)',
                'calorie_change' => '−300–500 kcal Deficit',
                'sections' => [
                    ['title' => 'Morning', 'items' => ['Warm water + lemon', '5 almonds'], 'icon' => 'cloud.sun.fill', 'image' => 'https://images.unsplash.com/photo-1510619052069-426b3c9ec28a?w=400'],
                    ['title' => 'Breakfast', 'items' => ['3 egg whites + 1 whole egg', 'Oats (with water/milk)'], 'icon' => 'egg.fill', 'image' => 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400'],
                    ['title' => 'Mid-Morning', 'items' => ['Apple or Papaya'], 'icon' => 'clock.fill', 'image' => 'https://images.unsplash.com/photo-1512623367039-382d54402636?w=400'],
                    ['title' => 'Lunch', 'items' => ['2 Roti OR small rice portion', 'Chicken 100g / Paneer 100g', 'Green vegetables'], 'icon' => 'leaf.fill', 'image' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
                    ['title' => 'Pre-Workout', 'items' => ['Black coffee'], 'icon' => 'bolt.fill', 'image' => 'https://images.unsplash.com/photo-1443916568596-df5a58c445e9?w=400'],
                    ['title' => 'Post-Workout', 'items' => ['Whey protein OR boiled eggs'], 'icon' => 'figure.walk', 'image' => 'https://images.unsplash.com/photo-1579722820308-d74e5719859b?w=400'],
                    ['title' => 'Dinner', 'items' => ['Salad + grilled chicken / paneer', 'Avoid carbs at night'], 'icon' => 'moon.fill', 'image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'],
                ],
                'tips' => ['Walk 8–10k steps daily', 'Protein high, carbs moderate'],
                'avoid' => ['Sugar', 'Fried food', 'Cold drinks', 'Junk food'],
                'color' => '#ef4444'
            ],
            'recomp' => [
                'name' => 'Muscle Gain (Lean Bulk / Recomposition)',
                'calorie_change' => 'Maintain / Minimal Surplus',
                'sections' => [
                    ['title' => 'Morning', 'items' => ['Water + soaked nuts'], 'icon' => 'sun.max.fill', 'image' => 'https://images.unsplash.com/photo-1544244015-0cd4b3ff279d?w=400'],
                    ['title' => 'Breakfast', 'items' => ['Oats + milk + banana', '3–4 eggs'], 'icon' => 'egg.fill', 'image' => 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400'],
                    ['title' => 'Mid-Morning', 'items' => ['Fruit + peanut butter'], 'icon' => 'clock.fill', 'image' => 'https://images.unsplash.com/photo-1528751014839-42b176bc21e7?w=400'],
                    ['title' => 'Lunch', 'items' => ['Rice + chicken/paneer + dal + salad'], 'icon' => 'bowl.fill', 'image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'],
                    ['title' => 'Pre-Workout', 'items' => ['Banana + coffee'], 'icon' => 'bolt.fill', 'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'],
                    ['title' => 'Post-Workout', 'items' => ['Whey protein'], 'icon' => 'figure.strengthtraining.traditional', 'image' => 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400'],
                    ['title' => 'Dinner', 'items' => ['Roti + protein + veggies'], 'icon' => 'moon.fill', 'image' => 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400'],
                ],
                'tips' => ['Muscle Gain = Gym + Protein + Sleep'],
                'color' => '#10b981'
            ]
        ];

        return response()->json($plans[$goal] ?? $plans['recomp']);
    }
}
