import { notFound, redirect } from "next/navigation";
import { URLShortener } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function LinkPage({
  params: { linkKey },
}: {
  params: { linkKey: string };
}) {
  const decodedKey = new URLShortener().decode(linkKey);

  const [link] = await Promise.all([
    api.links.get({ id: decodedKey }),
    api.links.view({ id: decodedKey }),
  ]);

  if (!link) {
    return notFound();
  }

  redirect(link.url);
}
