"use client";

import { useForm } from "react-hook-form";
import { type z } from "zod";
import { newLinkSchema } from "~/server/db/schema";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const NewLinkForm = () => {
  const form = useForm<z.infer<typeof newLinkSchema>>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: {
      name: "",
    },
  });

  const utils = api.useUtils();
  const newLink = api.links.create.useMutation({
    onSuccess: () => {
      form.reset();
      void Promise.all([
        utils.links.getMostVisited.invalidate(),
        utils.links.getMostRecent.invalidate(),
      ]);
      toast.success("Link created successfully!");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    newLink.mutate(data);
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="grid w-full max-w-md grid-cols-1 gap-2"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>

              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="https://example.com"
              />

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={newLink.isPending}>Create link</Button>
      </form>
    </Form>
  );
};
