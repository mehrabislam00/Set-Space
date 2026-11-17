import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"

import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

function getMongoUri() {
  const uri = process.env.BETTER_AUTH_MONGO_URI?.trim()
  const username = process.env.MONGODB_USERNAME
  const password = process.env.MONGODB_PASSWORD

  if (!uri) {
    throw new Error("BETTER_AUTH_MONGO_URI is not configured")
  }

  if (
    uri.includes("<MONGODB_USERNAME>") ||
    uri.includes("<MONGODB_PASSWORD>")
  ) {
    if (!username || !password) {
      throw new Error(
        "MONGODB_USERNAME and MONGODB_PASSWORD are required when the MongoDB URI uses placeholders"
      )
    }

    return uri
      .replace("<MONGODB_USERNAME>", encodeURIComponent(username))
      .replace("<MONGODB_PASSWORD>", encodeURIComponent(password))
  }

  return uri
}

const client = new MongoClient(getMongoUri())
const db = client.db("auth")

export const auth = betterAuth({
  plugins: [
    jwt(),
  ],

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
