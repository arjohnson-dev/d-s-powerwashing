import {
  getDriveThumbnailResponse,
  logGalleryError,
  safeErrorResponse,
} from "../_lib/googleDriveGallery.js";

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const fileId = Array.isArray(request.query?.id) ? request.query.id[0] : request.query?.id;
    const image = await getDriveThumbnailResponse(fileId);

    response.setHeader("Content-Type", image.contentType);
    response.setHeader("Content-Length", String(image.contentLength));
    response.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
    );
    response.setHeader("X-Content-Type-Options", "nosniff");

    if (request.method === "HEAD") {
      return response.status(200).end();
    }

    return response.status(200).send(image.body);
  } catch (error) {
    logGalleryError(error);
    const safeResponse = safeErrorResponse(error);
    return response.status(safeResponse.statusCode).json(safeResponse.body);
  }
}
