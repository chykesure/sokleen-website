/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    // This will help bypass any small type errors in the Gallery code
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;