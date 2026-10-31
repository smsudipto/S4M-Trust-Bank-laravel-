<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class SecuritySettingsController extends Controller
{
    public function index(): View
    {
        return view('customer.security.index');
    }
}
