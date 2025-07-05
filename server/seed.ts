import { randomUUID } from "crypto";
import { db } from "./src/db";
import { Users, Messages, Media } from "./src/schema";
import { eq } from "drizzle-orm";

async function seed() {

	// Create sample users
	const alice = await db
		.insert(Users)
		.values({
			name: { first: "Alice", last: "Johnson" },
			username: "alice",
			email: "alice@example.com",
			password: "password123",
		})
		.returning()
		.then((res) => res[0] as User);

	const bob = await db
		.insert(Users)
		.values({
			name: { first: "Bob", last: "Smith" },
			username: "bob",
			email: "bob@example.com",
			password: "password123",
		})
		.returning()
		.then((res) => res[0] as User);

	await db
		.insert(Users)
		.values({
			name: { first: "Charlie", last: "Brown" },
			username: "charlie",
			email: "charlie@example.com",
			password: "password123",
		})
		.returning()
		.then((res) => res[0] as User);

	const msgs: ServerMessage[] = Array.from({ length: 50 }, (_, i) => ({
    id: randomUUID(),
		from: i % 2 === 0 ? alice.id : bob.id,
		to: i % 2 === 0 ? bob.id : alice.id,
		text: `Hello, this is message number ${i + 1}`,
		created_at: new Date(Date.now() + i * 1000 * 60),
	}));

	// Create some sample messages
	const messages = await db.insert(Messages).values(msgs).returning();

		const media1 = await db
		.insert(Media)
		.values({
			user_id: alice.id,
			type: "image/png",
			url: `https://api.dicebear.com/9.x/thumbs/png?seed=${alice.username}`,
			created_at: new Date(),
		})
		.returning()
		.then((res) => res[0] as Media);

	const media2 = await db
		.insert(Media)
		.values({
			user_id: bob.id,
			type: "image/png",
			url: `https://api.dicebear.com/9.x/thumbs/png?seed=${bob.username}`,
			created_at: new Date(),
		})
		.returning()
		.then((res) => res[0] as Media);

	await db
		.insert(Media)
		.values({
			user_id: alice.id,
			type: "image/png",
			url: `https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D`,
			created_at: new Date(),
			message_id: messages.at(-1).id,
		})
		.returning()
		.then((res) => res[0]);

	await db
		.insert(Media)
		.values({
			user_id: alice.id,
			type: "image/png",
			url: "https://images.unsplash.com/photo-1546464677-c25cd52c470b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			created_at: new Date(),
			message_id: messages.at(-1).id,
		})
		.returning()
		.then((res) => res[0]);

	// update avatars
	await db
		.update(Users)
		.set({ avatar: media1.id })
		.where(eq(Users.id, alice.id))
		.returning()
		.then((res) => res[0]);

	await db
		.update(Users)
		.set({ avatar: media2.id })
		.where(eq(Users.id, bob.id))
		.returning()
		.then((res) => res[0]);


	console.log("✅ Seed data inserted successfully!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("❌ Error seeding data:", err);
	process.exit(1);
});
