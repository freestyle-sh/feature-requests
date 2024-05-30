import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  url.host = new URL(import.meta.env.FREESTYLE_API_ENDPOINT).host;
  url.protocol = new URL(import.meta.env.FREESTYLE_API_ENDPOINT).protocol;
  const response = await fetch(url, request);
  const json = await response.json();
  return new Response(JSON.stringify(json), {
    status: response.status,
  });
};
