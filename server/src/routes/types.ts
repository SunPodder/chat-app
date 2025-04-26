export interface User {
	id: string;
	username: string;
	email: string;
	name: {
		first: string;
		last: string;
	};
	password: string;
	created_at: Date;
}
