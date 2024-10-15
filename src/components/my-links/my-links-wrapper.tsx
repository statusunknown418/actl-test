import { api } from "~/trpc/server";
import { MyLinks } from ".";

export const MyLinksWrapper = async () => {
  void api.links.getMostRecent.prefetch();
  return <MyLinks />;
};
