const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "stimstestneu.blob.core.windows.net",
                pathname: "**"
            }
        ]
    }
};

module.exports = nextConfig;
