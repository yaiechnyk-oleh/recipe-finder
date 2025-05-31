import { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.spoonacular.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
