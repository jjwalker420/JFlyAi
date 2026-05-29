import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: '/diningout-DOO-Final-proposal',
        destination: '/diningout-DOO-Final-proposal.html',
      },
    ];
  },
};

export default nextConfig;
