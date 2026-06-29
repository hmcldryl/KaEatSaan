import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  generateBuildId: async () => {
    return process.env.NEXT_PUBLIC_BUILD_ID || `local-${Date.now()}`;
  },
};

export default nextConfig;
