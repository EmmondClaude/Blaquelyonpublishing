/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The 3D pass (R3F / three / drei) is loaded client-only via next/dynamic,
  // so no transpile/SSR config is needed yet. Kept here as the seam for it.
};

export default nextConfig;
