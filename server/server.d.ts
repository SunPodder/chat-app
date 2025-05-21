declare global {
	declare namespace Express {
		interface Request {
			user: ServerUser;
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
}
