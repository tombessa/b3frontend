import NextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import {
    FACEBOOK_CLIENT_ID,
    FACEBOOK_SECRET_ID,
    GITHUB_CLIENT_ID,
    GITHUB_SECRET_ID,
    INSTAGRAM_CLIENT_ID,
    INSTAGRAM_SECRET_ID,
    SECRET
} from "../../../utils/constants";

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_SECRET_ID
        }),
        FacebookProvider({
            clientId: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_SECRET_ID
        }),
        InstagramProvider({
            clientId: INSTAGRAM_CLIENT_ID,
            clientSecret: INSTAGRAM_SECRET_ID
        })
    ],
    secret: SECRET
});