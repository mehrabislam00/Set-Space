import { betterAuth } from "better-auth"

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

declare global {
  var __setSpaceMongoClient: MongoClient | undefined
}

const mongoUri = getMongoUri()
const client =
  globalThis.__setSpaceMongoClient ??
  new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    maxPoolSize: 10,
    minPoolSize: 0,
    retryWrites: true,
    retryReads: true,
  })

globalThis.__setSpaceMongoClient = client
const db = client.db("auth")

const configuredBaseUrl = process.env.BETTER_AUTH_URL?.trim()
const trustedOrigins = [
  "https://set-space-ten.vercel.app",
  "https://*.vercel.app",
  "http://localhost:3000",
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? []),
]

export const auth = betterAuth({
  baseURL: configuredBaseUrl || undefined,
  trustedOrigins,

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
