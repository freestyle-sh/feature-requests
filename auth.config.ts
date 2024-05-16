import GoogleProvider from "@auth/core/providers/google";
import Passkey from "@auth/core/providers/passkey";
import { defineConfig } from "auth-astro";

export default defineConfig({
  providers: [
    GoogleProvider({
      clientId: import.meta.env.AUTH_GOOGLE_ID,
      clientSecret: import.meta.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});
