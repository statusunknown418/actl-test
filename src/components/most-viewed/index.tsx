"use client";

import { api } from "~/trpc/react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

export const MostViewedList = () => {
  const [data] = api.links.getMostVisited.useSuspenseQuery();

  if (!data.length) {
    return (
      <section className="w-full max-w-sm rounded-xl border p-4 text-muted-foreground">
        No links found
      </section>
    );
  }

  return (
    <section className="flex w-full max-w-md flex-col gap-2">
      <h2 className="text-muted-foreground">Top 100 links!</h2>

      <ScrollArea className="h-[400px] border bg-muted p-2">
        <article className="flex flex-col gap-2">
          {data.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <CardTitle>{link.name}</CardTitle>
                <CardTitle>
                  <Link
                    href={`/${link.key}`}
                    className="font-medium underline underline-offset-2"
                  >
                    {link.url}
                  </Link>
                </CardTitle>

                <CardDescription>
                  Viewed {Intl.NumberFormat().format(link.views)} times
                </CardDescription>

                <CardDescription>
                  <kbd>Key - {link.key}</kbd>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </article>
      </ScrollArea>
    </section>
  );
};
