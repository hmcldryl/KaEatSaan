import type { NextConfig } from "next";
import packageJson from "./package.json";
import fs from "fs";
import path from "path";

const changelogRaw = fs.readFileSync(path.join(process.cwd(), "CHANGELOG.md"), "utf-8");

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
    NEXT_PUBLIC_CHANGELOG: changelogRaw,
  },
  generateBuildId: async () => {
    return process.env.NEXT_PUBLIC_BUILD_ID || `local-${Date.now()}`;
  },
};

export default nextConfig;
