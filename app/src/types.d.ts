import { Dispatch, SetStateAction } from "react";

export type MyRouteProps = {
	redirectTo?: string;
}

export type INotif = {
	message: string;
	type: 'info' | 'error' | 'success';
	props?: any;
}

export type IAuthContext = {
	isLogged: boolean;
	isLogging: boolean;
	setLogged: Dispatch<SetStateAction<boolean>>;
}

export type IUser = {
	email: string;
	password: string;
	confirmPassword: string;
	username: string;
}