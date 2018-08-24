<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{
	public function login(Request $request){
		return response()->json(['success' => true]);
	}
	
	public function get(Request $request){
		$users = User::where('email', '<>', $request->email)->get();
		return response()->json(['success' => true, 'users' => $users]);
	}

	public function remove(Request $request){
		User::where('id', $request->id)->delete();
		return response()->json(['success' => true, 'message' => 'Usuário removido!']);
	}

	public function save(Request $request, User $user){
		$validator = \Validator::make($request->all(), [
			'name' => 'required',
			'email' => 'required|email',
			'password' => 'required'
		]);

		if ($validator->fails())
		{
			return response()->json(['success' => false,'message' => 'Dados inválidos!']);
		}

		try{
			$user->name = $request->name;
			$user->email = $request->email;
			$user->password = bcrypt($request->password);
			$user->save();
		}catch(\Exception $e){
			return response()->json(['success' => false,'message' => 'Usuário já existe!']);
		}

		return response()->json(['success' => true,'message' => 'Usuário cadastrado com sucesso!']);
	}
}
