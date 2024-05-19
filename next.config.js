/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'pbs.twimg.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'flowbite.s3.amazonaws.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'flowbite.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'indigo-foreign-manatee-785.mypinata.cloud',
            port: '',
          },
        ],
      },
};

export default config;
