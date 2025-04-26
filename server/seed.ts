import { randomUUID } from "crypto";
import { db } from "./src/db";
import { Users, Messages } from "./src/schema";

async function seed() {
	// Create sample users
	const alice: User = await db
		.insert(Users)
		.values({
			name: { first: "Alice", last: "Johnson" },
			username: "alice",
			email: "alice@example.com",
			password: "password123", // In production, this should be hashed
			avatar: "https://api.dicebear.com/9.x/thumbs/png?seed=alice",
		})
		.returning()
		.then((res) => res[0] as User);

	const bob: User = await db
		.insert(Users)
		.values({
			name: { first: "Bob", last: "Smith" },
			username: "bob",
			email: "bob@example.com",
			password: "password123",
			avatar: "https://api.dicebear.com/9.x/thumbs/png?seed=bob",
		})
		.returning()
		.then((res) => res[0])

	const _ = await db
		.insert(Users)
		.values({
			name: { first: "Charlie", last: "Brown" },
			username: "charlie",
			email: "charlie@example.com",
			password: "password123",
			avatar: "https://api.dicebear.com/9.x/thumbs/png?seed=charlie",
		})
		.returning()
		.then((res) => res[0])

	const msgs: Message[] = Array.from({ length: 50 }, (_, i) => ({
    id: randomUUID(),
		from: i % 2 === 0 ? alice.id : bob.id,
		to: i % 2 === 0 ? bob.id : alice.id,
		text: `Hello, this is message number ${i + 1}`,
		created_at: new Date(Date.now() + i * 1000 * 60),
	}));

	// Create some sample messages
	await db.insert(Messages).values(msgs);

	console.log("✅ Seed data inserted successfully!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("❌ Error seeding data:", err);
	process.exit(1);
});
