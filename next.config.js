const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "stimstestneu.blob.core.windows.net",
                pathname: "**"
            }
        ]
    },
    transpilePackages: ['react-international-phone']
};

module.exports = nextConfig;
