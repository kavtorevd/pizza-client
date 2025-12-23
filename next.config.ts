import type { NextConfig } from "next";
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_HOST_NAME || 'localhost' ||'127.0.0.1',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],

    //ONLY FOR DEVELOPMENT!!!  -- LOCAL ONLY
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
  //ONLY FOR DEVELOPMENT!!!  -- LOCAL ONLY
  //!!!ALSO LOOK AT package dev scripts !!!
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    }, 
  },
  
  reactStrictMode: true,
    turbopack: {},
  webpack: (config: Configuration) => {
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;