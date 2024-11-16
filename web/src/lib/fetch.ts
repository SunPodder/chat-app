export const GET = async (url: string) => {
	const response = await fetch(url, {
		credentials: "include",
		mode: "cors",
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	return await response.json();
};

export const POST = async (url: string, data: object) => {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		mode: "cors",
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	return await response.json();
};
