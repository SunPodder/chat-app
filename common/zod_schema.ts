import * as v from 'valibot';

export const vRegisterUser = v.object({
	name: v.object({
		first: v.pipe(
			v.string(), 
			v.minLength(2, "Must contain atleast 2 characters"), 
			v.maxLength(7)
		),
		last: v.pipe(
			v.string(), 
			v.minLength(2, "Must contain atleast 2 characters"), 
			v.maxLength(7)
		),
	}),
	username: v.pipe(
		v.string(), 
		v.minLength(3, "Must contain atleast 3 characters"), 
		v.maxLength(10)
	),
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8), v.maxLength(20)),
});

export const vLoginUser = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8), v.maxLength(20)),
});

// const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const vProfile = v.object({
	name: v.object({
		first: v.pipe(
			v.string(), 
			v.minLength(2, "Must contain atleast 2 characters"), 
			v.maxLength(7)
		),
		last: v.pipe(
			v.string(), 
			v.minLength(2, "Must contain atleast 2 characters"), 
			v.maxLength(7)
		),
	}),
	username: v.pipe(
		v.string(), 
		v.minLength(3, "Must contain atleast 3 characters"), 
		v.maxLength(10)
	),
	email: v.pipe(v.string(), v.email()),
	avatar: v.optional(v.any()),
});

export type RegisterUserSchema = v.InferOutput<typeof vRegisterUser>;
export type LoginUserSchema = v.InferOutput<typeof vLoginUser>;
export type ProfileSchema = v.InferOutput<typeof vProfile>;
