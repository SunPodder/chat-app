declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      username: string;
      name: {
        first: string;
        last: string;
      };
      avatar?: string;
      created_at: Date;
      updated_at: Date;
    }
    file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
    }
  }
}