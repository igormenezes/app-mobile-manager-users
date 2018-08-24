<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class VerifyAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try{
            if(\Auth::attempt(['email' => $request->email, 'password' => $request->password])){
                return $next($request);
            }
            return response()->json(['success' => false,'message' => 'Login incorreto!']); 
        } catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Por favor, realizar o login, antes de executar essa operação!'
            ]); 
        }
    }
}
