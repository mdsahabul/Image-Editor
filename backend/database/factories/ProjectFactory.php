<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'title'            => fake()->sentence(3),
            'canvas_width'     => fake()->randomElement([1920, 1080, 3840]),
            'canvas_height'    => fake()->randomElement([1080, 1080, 2160]),
            'background_color' => '#ffffff',
            'is_template'      => false,
        ];
    }
}
