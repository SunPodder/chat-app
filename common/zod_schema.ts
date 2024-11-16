import { z } from "zod";

export const zRegisterUser = z.object({
	name: z.object({
		first: z.string().min(2, "Must contain atleast 2 characters").max(7),
		last: z.string().min(2, "Must contain atleast 2 characters").max(7),
	}),
	username: z.string().min(3, "Must contain atleast 3 characters").max(10),
	email: z.string().email(),
	password: z.string().min(8).max(20),
});

export const zLoginUser = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(20),
});

// const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const zProfile = z.object({
	name: z.object({
		first: z.string().min(2, "Must contain atleast 2 characters").max(7),
		last: z.string().min(2, "Must contain atleast 2 characters").max(7),
	}),
	username: z.string().min(3, "Must contain atleast 3 characters").max(10),
	email: z.string().email(),
	avatar: z
		.any()
		.optional()
});
