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
		const response = await fetch("http://localhost:5000/api/user", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"no-cors": "true",
			},
		});

		return new Response(JSON.stringify({ data: response }), {
			status: 200,
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

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
