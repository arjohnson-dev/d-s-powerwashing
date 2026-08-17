# Google Drive Gallery

The gallery API reads images from one Google Drive folder with a Google service
account. Credentials stay in Vercel serverless functions and are never exposed
through `VITE_` variables or bundled client code.

## Environment Variables

Set these in `.env.local` for local development and in the Vercel project
settings for production:

```env
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
```

`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` may be pasted with escaped newline
sequences (`\n`). The API normalizes those before authenticating.

Local development can run without credentials. When the required variables are
missing outside production, `/api/gallery` returns a small mock response and
`/api/gallery/image?id=mock-drive-image-1` returns a placeholder image. Set
`GOOGLE_DRIVE_GALLERY_USE_MOCK=false` to disable this behavior locally.

In Vite development, the React gallery replaces mock API responses with local
photos from `src/assets` so lightbox navigation can be tested with real project
images. Those local test images are gated by `import.meta.env.DEV` and are not
used as production gallery content.

## Google Drive Setup

1. Create or choose a Google Cloud service account with Drive API access.
2. Copy the service account email into `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
3. Create a JSON key and copy its `private_key` value into
   `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
4. Share the Drive gallery folder with the service account email as a viewer.
5. Copy the folder ID from the Drive folder URL into
   `GOOGLE_DRIVE_FOLDER_ID`.

For a folder URL like:

```text
https://drive.google.com/drive/folders/abc123FolderId
```

the folder ID is `abc123FolderId`.

## Endpoints

`GET /api/gallery` returns normalized image metadata:

```json
{
  "images": [
    {
      "id": "drive-file-id",
      "filename": "project.jpg",
      "imageUrl": "/api/gallery/image?id=drive-file-id",
      "width": 1200,
      "height": 800,
      "createdAt": "2026-08-17T12:00:00.000Z",
      "modifiedAt": "2026-08-17T12:00:00.000Z"
    }
  ],
  "meta": {
    "count": 1,
    "source": "google-drive"
  }
}
```

`GET /api/gallery/image?id=FILE_ID` streams an image through the server-side
Drive client. The endpoint validates the file ID and only serves files returned
from the configured gallery folder, so it cannot be used as a generic Drive
proxy.

The React gallery grid and lightbox both use `imageUrl`, so browser-compatible
Drive originals are served without resizing or quality reduction.

HEIC/HEIF browser support is limited, so the API only includes those files when
the deployed image runtime can decode `.heic` or `.heif` input. When supported,
`GET /api/gallery/image?id=FILE_ID` converts HEIC/HEIF files to high-quality
JPEG without resizing. JPEG, PNG, WebP, and GIF originals are streamed as-is.

## Caching

Gallery metadata is intentionally not cached. Every `GET /api/gallery` request
queries Google Drive for the current folder contents and sends no-store headers:

```text
Cache-Control: no-store, max-age=0, s-maxage=0, must-revalidate
CDN-Cache-Control: no-store
Vercel-CDN-Cache-Control: no-store
```

Original image responses can be cached by browsers for 1 hour and by Vercel/CDN
for 24 hours:

```text
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800
```
