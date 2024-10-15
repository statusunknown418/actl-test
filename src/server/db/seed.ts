import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from ".";
import { links } from "./schema";
import { URLShortener } from "~/lib/utils";

const fakeData = Array.from({ length: 100 }, () => {
  const encoded = new URLShortener().encode(faker.number.int({ min: 10 }));

  return {
    url: faker.internet.url(),
    name: faker.internet.displayName(),
    key: encoded,
    views: faker.number.int({ min: 100 }),
  };
});

void db
  .insert(links)
  .values(fakeData)
  .execute()
  .then(() => {
    console.log("Seeded database with fake data");
  });
