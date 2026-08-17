import {
  getGalleryImages,
  logGalleryError,
  safeErrorResponse,
} from "./_lib/googleDriveGallery.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const forceRefresh = request.query?.refresh === "true";
    const gallery = await getGalleryImages({ forceRefresh });

    response.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=10800, stale-while-revalidate=86400",
    );

    return response.status(200).json({
      images: gallery.images,
      meta: {
        count: gallery.images.length,
        source: gallery.source,
        cacheTtlSeconds: gallery.cacheTtlSeconds,
      },
    });
  } catch (error) {
    logGalleryError(error);
    const safeResponse = safeErrorResponse(error);
    return response.status(safeResponse.statusCode).json(safeResponse.body);
  }
}
