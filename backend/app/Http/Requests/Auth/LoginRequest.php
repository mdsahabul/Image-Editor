<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function ensureIsNotRateLimited(): void
    {
        $key = strtolower($this->input('email')).'|'.$this->ip();

        if (! app('cache')->get("login_attempts:{$key}")) {
            return;
        }

        $attempts = (int) app('cache')->get("login_attempts:{$key}", 0);

        if ($attempts >= 5) {
            throw ValidationException::withMessages([
                'email' => 'Too many login attempts. Please try again in 60 seconds.',
            ]);
        }
    }

    public function recordFailedAttempt(): void
    {
        $key = strtolower($this->input('email')).'|'.$this->ip();
        $attempts = (int) app('cache')->get("login_attempts:{$key}", 0);
        app('cache')->put("login_attempts:{$key}", $attempts + 1, 60);
    }

    public function clearAttempts(): void
    {
        $key = strtolower($this->input('email')).'|'.$this->ip();
        app('cache')->forget("login_attempts:{$key}");
    }
}
