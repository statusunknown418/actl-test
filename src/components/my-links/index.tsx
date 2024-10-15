"use client";

import { api } from "~/trpc/react";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";

export const MyLinks = () => {
  const [data] = api.links.getMostRecent.useSuspenseQuery();

  return (
    <section className="flex w-full max-w-md flex-col gap-2">
      <h2 className="text-muted-foreground">My links</h2>

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
