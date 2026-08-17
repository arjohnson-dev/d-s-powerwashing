import { JWT } from "google-auth-library";
import sharp from "sharp";

const DRIVE_FILES_ENDPOINT = "https://www.googleapis.com/drive/v3/files";
const DRIVE_FILE_MEDIA_ENDPOINT = (fileId) =>
  `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`;
const HEIC_CONVERSION_JPEG_QUALITY = 92;

const REQUIRED_ENV_VARS = [
  "GOOGLE_DRIVE_FOLDER_ID",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
];

const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const HEIC_IMAGE_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const FILE_ID_PATTERN = /^[A-Za-z0-9_-]{10,}$/;

class SafeGalleryError extends Error {
  constructor(message, statusCode = 500, logContext = {}) {
    super(message);
    this.name = "SafeGalleryError";
    this.statusCode = statusCode;
    this.logContext = logContext;
  }
}

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
}

function canUseMockGallery() {
  return !isProduction() && process.env.GOOGLE_DRIVE_GALLERY_USE_MOCK !== "false";
}

function normalizePrivateKey(privateKey) {
  const normalized = privateKey.replace(/\\n/g, "\n");

  if (!normalized.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new SafeGalleryError("Google service account private key is malformed.", 500, {
      reason: "malformed-private-key",
    });
  }

  return normalized;
}

function getGoogleCredentials() {
  const missing = getMissingEnvVars();

  if (missing.length > 0) {
    if (canUseMockGallery()) {
      return null;
    }

    throw new SafeGalleryError("Gallery service is not configured.", 500, {
      reason: "missing-env",
      missing,
    });
  }

  return {
    folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
  };
}

function createAuthClient(credentials) {
  return new JWT({
    email: credentials.email,
    key: credentials.privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

async function getAuthHeaders(authClient) {
  const headers = await authClient.getRequestHeaders();

  if (typeof headers.entries === "function") {
    return Object.fromEntries(headers.entries());
  }

  return Object.fromEntries(Object.entries(headers));
}

function driveQueryForFolder(folderId) {
  const mimeQuery = Array.from(getServableImageMimeTypes())
    .map((mimeType) => `mimeType = '${mimeType}'`)
    .join(" or ");

  return `'${folderId.replace(/'/g, "\\'")}' in parents and trashed = false and (${mimeQuery})`;
}

function canConvertHeicImages() {
  const supportedSuffixes = sharp.format.heif?.input?.fileSuffix ?? [];
  return supportedSuffixes.some((suffix) => suffix === ".heic" || suffix === ".heif");
}

function getServableImageMimeTypes() {
  if (!canConvertHeicImages()) {
    return SUPPORTED_IMAGE_MIME_TYPES;
  }

  return new Set([...SUPPORTED_IMAGE_MIME_TYPES, ...HEIC_IMAGE_MIME_TYPES]);
}

function isHeicImage(file) {
  return HEIC_IMAGE_MIME_TYPES.has(file?.mimeType);
}

function normalizeDriveFile(file) {
  const width = Number(file.imageMediaMetadata?.width);
  const height = Number(file.imageMediaMetadata?.height);
  const imageUrl = `/api/gallery/image?id=${encodeURIComponent(file.id)}`;

  return {
    id: file.id,
    filename: file.name,
    imageUrl,
    width: Number.isFinite(width) ? width : undefined,
    height: Number.isFinite(height) ? height : undefined,
    createdAt: file.createdTime,
    modifiedAt: file.modifiedTime,
  };
}

async function listDriveImageFiles(authClient, folderId) {
  const params = new URLSearchParams({
    q: driveQueryForFolder(folderId),
    fields: "files(id,name,mimeType,createdTime,modifiedTime,imageMediaMetadata(width,height))",
    orderBy: "createdTime desc",
    pageSize: "1000",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });

  const response = await fetch(`${DRIVE_FILES_ENDPOINT}?${params}`, {
    headers: await getAuthHeaders(authClient),
  });

  if (!response.ok) {
    throw new SafeGalleryError("Unable to load gallery images.", response.status, {
      reason: "drive-list-failed",
      status: response.status,
      statusText: response.statusText,
    });
  }

  const data = await response.json();
  const servableImageMimeTypes = getServableImageMimeTypes();

  return (data.files ?? []).filter(
    (file) => file.id && file.name && servableImageMimeTypes.has(file.mimeType),
  );
}

function mockGalleryImages() {
  const now = new Date().toISOString();

  return [
    {
      id: "mock-drive-image-1",
      filename: "mock-gallery-image.jpg",
      imageUrl: "/api/gallery/image?id=mock-drive-image-1",
      width: 1200,
      height: 800,
      createdAt: now,
      modifiedAt: now,
    },
  ];
}

export async function getGalleryImages() {
  const credentials = getGoogleCredentials();

  if (!credentials) {
    return {
      images: mockGalleryImages(),
      source: "mock",
    };
  }

  const authClient = createAuthClient(credentials);
  const files = await listDriveImageFiles(authClient, credentials.folderId);

  return {
    images: files.map(normalizeDriveFile),
    source: "google-drive",
  };
}

async function getGalleryFileById(authClient, folderId, fileId) {
  const files = await listDriveImageFiles(authClient, folderId);
  return files.find((file) => file.id === fileId);
}

export async function getDriveImageResponse(fileId) {
  if (!fileId || !FILE_ID_PATTERN.test(fileId)) {
    throw new SafeGalleryError("Missing or invalid image id.", 400, {
      reason: "invalid-file-id",
    });
  }

  if (fileId.startsWith("mock-drive-image-") && canUseMockGallery()) {
    return {
      body: Buffer.from(
        "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
        "base64",
      ),
      contentType: "image/gif",
      contentLength: 43,
      source: "mock",
    };
  }

  const credentials = getGoogleCredentials();

  if (!credentials) {
    throw new SafeGalleryError("Gallery service is not configured.", 500, {
      reason: "missing-env",
    });
  }

  const authClient = createAuthClient(credentials);
  const requestedImage = await getGalleryFileById(authClient, credentials.folderId, fileId);

  if (!requestedImage) {
    throw new SafeGalleryError("Image was not found in the configured gallery folder.", 404, {
      reason: "file-not-in-gallery-folder",
      fileId,
    });
  }

  const response = await fetch(DRIVE_FILE_MEDIA_ENDPOINT(fileId), {
    headers: await getAuthHeaders(authClient),
  });

  if (!response.ok) {
    throw new SafeGalleryError("Unable to load gallery image.", response.status, {
      reason: "drive-media-failed",
      fileId,
      status: response.status,
      statusText: response.statusText,
    });
  }

  const body = Buffer.from(await response.arrayBuffer());

  if (isHeicImage(requestedImage)) {
    let convertedBody;

    try {
      convertedBody = await sharp(body, { animated: false })
        .rotate()
        .jpeg({
          quality: HEIC_CONVERSION_JPEG_QUALITY,
          mozjpeg: true,
        })
        .toBuffer();
    } catch (error) {
      throw new SafeGalleryError("Unable to convert gallery HEIC image.", 500, {
        reason: "heic-conversion-failed",
        fileId,
        message: error?.message,
      });
    }

    return {
      body: convertedBody,
      contentType: "image/jpeg",
      contentLength: convertedBody.length,
      source: "google-drive-heic-converted",
    };
  }

  return {
    body,
    contentType: response.headers.get("content-type") ?? "application/octet-stream",
    contentLength: body.length,
    source: "google-drive",
  };
}

export function logGalleryError(error) {
  if (error instanceof SafeGalleryError) {
    console.error("[gallery-api]", error.message, error.logContext);
    return;
  }

  console.error("[gallery-api] Unexpected gallery error", {
    name: error?.name,
    message: error?.message,
  });
}

export function safeErrorResponse(error) {
  if (error instanceof SafeGalleryError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: error.message,
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: "Unexpected gallery service error.",
    },
  };
}
