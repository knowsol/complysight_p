import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config: any) {
    const assetRule = config.module.rules.find(
      (rule: any) => typeof rule === 'object' && rule?.test?.test?.('.svg')
    );

    // Keep existing ?react SVG imports working (SVGR)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: /react/,
      use: ['@svgr/webpack'],
    });

    if (assetRule) {
      assetRule.exclude = /\.svg$/i;
    }

    return config;
  },
	async rewrites() {
    const API_SERVER = 'http://localhost:18080';
		return {
			beforeFiles: [
				{
					source: "/manager/authentication",
					destination: `${API_SERVER}/manager/authentication`,
				},
				{
					source: "/sentinel/authentication",
					destination: `${API_SERVER}/sentinel/authentication`,
				},
			],
			afterFiles: [
				{
					source: "/api/:path*",
					destination: `${API_SERVER}/api/:path*`,
				},
			],
			fallback: [],
		};
	}
};

export default nextConfig;
