# URL Shortener

The flow for a the link to be shortened is as follows:

1. The user enters a URL and submits it.
2. The URL is validated and if it is valid, the link is created.
3. If the link is created successfully:
   1. Metadata is fetched from the URL (if failed, the link is created as `Untitled link`).
   2. The link is updated with the title and the key.
4. The link is displayed to the user.

## Setup

Fill in the required env vars in a `.env` file.

```bash
DATABASE_URL=sqlite_url
DATABASE_TOKEN=secret
```

## Development

Just do

```bash
pnpm dev (or --turbo)
```
