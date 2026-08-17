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

  response.setHeader("Cache-Control", "no-store, max-age=0, s-maxage=0, must-revalidate");
  response.setHeader("CDN-Cache-Control", "no-store");
  response.setHeader("Vercel-CDN-Cache-Control", "no-store");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Expires", "0");

  try {
    const gallery = await getGalleryImages();

    return response.status(200).json({
      images: gallery.images,
      meta: {
        count: gallery.images.length,
        source: gallery.source,
      },
    });
  } catch (error) {
    logGalleryError(error);
    const safeResponse = safeErrorResponse(error);
    return response.status(safeResponse.statusCode).json(safeResponse.body);
  }
}
