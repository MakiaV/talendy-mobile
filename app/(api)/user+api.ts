export async function POST(request: Request) {
	try {
		const { email, password, clerkId } = await request.json();

		if (!email || !clerkId || !password) {
			return Response.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const response = await fetch(
			`${process.env.BACKEND_URL}/api/user/register`,
			// "http://localhost:5000/api/user/register",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"no-cors": "true",
				},
				body: JSON.stringify({ email, password, clerkId }),
			}
		);

		return new Response(JSON.stringify({ data: response }), {
			status: 201,
		});
	} catch (error) {
		console.error("Error creating user:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	try {
		// Récupère l'ID depuis les query params : ?id=...
		const url = new URL(request.url);
		const id = url.searchParams.get("id");

		const base = process.env.BACKEND_URL || "http://localhost:5000";
		const endpoint = id
			? `${base}/api/user/${encodeURIComponent(id)}`
			: `${base}/api/user`;

		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"no-cors": "true",
			},
		});

		// Propager le corps JSON renvoyé par le backend
		const data = await response.json();

		return new Response(JSON.stringify({ data }), {
			status: response.ok ? 200 : response.status,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// export async function GET(request: Request) {
// 	try {
// 		const response = await fetch("http://localhost:5000/api/user", {
// 			method: "GET",
// 			headers: {
// 				"Content-Type": "application/json",
// 				"Access-Control-Allow-Origin": "*",
// 				"no-cors": "true",
// 			},
// 		});

// 		return new Response(JSON.stringify({ data: response }), {
// 			status: 200,
// 		});
// 	} catch (error) {
// 		console.error("Error fetching users:", error);
// 		return Response.json(
// 			{ error: "Internal Server Error" },
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function PUT(request: Request) {
// 	try {
// 		const { id } = request.params;
// 		const body = await request.json();

// 		const response = await fetch(
// 			`http://localhost:3001/api/user/${id}`,
// 			{
// 				method: "PUT",
// 				headers: {
// 					"Content-Type": "application/json",
// 					"Access-Control-Allow-Origin": "*",
// 					"no-cors": "true",
// 				},
// 				body: JSON.stringify(body),
// 			}
// 		);

// 		return new Response(JSON.stringify({ data: response }), {
// 			status: 200,
// 		});
// 	} catch (error) {
// 		console.error("Error updating user:", error);
// 		return Response.json(
// 			{ error: "Internal Server Error" },
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function DELETE(request: Request) {
// 	try {
// 		const { id } = request.params;

// 		const response = await fetch(
// 			`http://localhost:3001/api/user/${id}`,
// 			{
// 				method: "DELETE",
// 				headers: {
// 					"Content-Type": "application/json",
// 					"Access-Control-Allow-Origin": "*",
// 					"no-cors": "true",
// 				},
// 			}
// 		);

// 		return new Response(JSON.stringify({ data: response }), {
// 			status: 200,
// 		});
// 	} catch (error) {
// 		console.error("Error deleting user:", error);
// 		return Response.json(
// 			{ error: "Internal Server Error" },
// 			{ status: 500 }
// 		);
// 	}
// }
