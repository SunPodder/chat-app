export const GET = async (path: string) => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${path}`, {
		credentials: "include",
		mode: "cors",
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	return await response.json();
};

export const POST = async (path: string, data: object) => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${path}`, {
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
