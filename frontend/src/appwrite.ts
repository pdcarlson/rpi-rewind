// src/appwrite.ts
import { Client, Databases } from "appwrite";
import type { Models } from "appwrite"; // <-- this is the fix

// get env variables
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// check that all env variables are set
if (!endpoint || !projectId || !databaseId || !collectionId) {
  throw new Error(
    "missing appwrite environment variables. check your .env file."
  );
}

// initialize the client
const client = new Client().setEndpoint(endpoint).setProject(projectId);

// initialize the services
const databases = new Databases(client);

// export a helper object
export const appwrite = {
  databases,
  databaseId,
  collectionId,
};

// also, let's define the typescript type for our event data
// this must match our database schema
export interface EventDocument {
  title: string;
  description: string;
  year: number;
  era: string;
  image_url: string;
}

// this is our new "master" type.
// it's an appwrite document *and* our custom event data.
export type AppwriteEvent = EventDocument & Models.Document;
