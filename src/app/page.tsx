import { Suspense } from "react";
import { MostViewedList } from "~/components/most-viewed";
import { MyLinksWrapper } from "~/components/my-links/my-links-wrapper";
import { NewLinkForm } from "~/components/NewLinkForm";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.links.getMostVisited.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="mt-4 text-2xl font-medium tracking-tight">
          Link Shortener
        </h1>

        <NewLinkForm />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MostViewedList />

          <Suspense fallback={<div>Loading...</div>}>
            <MyLinksWrapper />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  );
}
