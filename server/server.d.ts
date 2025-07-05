declare namespace Express {
	interface Request {
		user: User;
		file?: {
			fieldname: string;
			originalname: string;
			encoding: string;
			mimetype: string;
			destination: string;
			filename: string;
		};
	}
}
