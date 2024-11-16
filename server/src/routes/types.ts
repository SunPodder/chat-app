import type { Request } from "express";

export interface User {
	id: number;
	username: string;
	email: string;
	name: {
		first: string;
		last: string;
	};
	password: string;
	created_at: string;
}

export interface UserRequest extends Request {
	user: User;
}
