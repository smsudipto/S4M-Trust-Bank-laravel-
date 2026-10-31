<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BankStatementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\FundTransferController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SecuritySettingsController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WithdrawalController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::get('/deposit', [DepositController::class, 'create'])->name('deposit');
    Route::post('/deposit', [DepositController::class, 'store'])->name('deposit.store');
    Route::get('/withdraw', [WithdrawalController::class, 'create'])->name('withdrawal');
    Route::post('/withdraw', [WithdrawalController::class, 'store'])->name('withdrawal.store');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions');
    Route::get('/fund-transfer', [FundTransferController::class, 'index'])->name('customer.fund-transfer.index');
    Route::post('/fund-transfer/verify-recipient', [FundTransferController::class, 'verifyRecipient'])
        ->middleware('throttle:10,1')
        ->name('customer.fund-transfer.verify');
    Route::post('/fund-transfer', [FundTransferController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('customer.fund-transfer.store');
    Route::get('/fund-transfer/{transfer}/receipt', [FundTransferController::class, 'receipt'])
        ->name('customer.fund-transfer.receipt');
    Route::get('/bank-statement', [BankStatementController::class, 'index'])->name('customer.bank-statement.index');
    Route::get('/bank-statement/pdf', [BankStatementController::class, 'pdf'])
        ->middleware('throttle:10,1')
        ->name('customer.bank-statement.pdf');
    Route::get('/bank-statement/print', [BankStatementController::class, 'print'])->name('customer.bank-statement.print');
    Route::get('/bank-statement/transaction/{transaction}', [BankStatementController::class, 'show'])->name('customer.bank-statement.transaction');
    Route::get('/profile', [ProfileController::class, 'index'])->name('customer.profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('customer.profile.update');
    Route::get('/profile/photo', [ProfileController::class, 'photo'])->name('customer.profile.photo');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('customer.notifications.index');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('customer.notifications.read-all');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('customer.notifications.read');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('customer.notifications.destroy');
    Route::get('/security-settings', [SecuritySettingsController::class, 'index'])->name('customer.security.index');
});
