import type { APIRoute } from "astro";

export const prerender = false;

const FACE_RECOGNITION_URL = import.meta.env.PUBLIC_FACE_RECOGNITION_URL;

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    return new Response(JSON.stringify({ error: "Invalid content type" }), {
      status: 400,
    });
  }

  try {
    const body = await request.json();

    const photo = body.photo as string;
    console.log("Photo", photo.slice(0, 100));

    const response = await fetch(FACE_RECOGNITION_URL, {
      method: "POST",
      body: JSON.stringify({ photo }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Data", data);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to upload photo" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
    });
  }
};
