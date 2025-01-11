/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: false, // Disable React Strict Mode to fix drag-and-drop issues
images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
      'img.clerk.com',
      'subdomain',
      'files.stripe.com',
      "8ahs17cko1.ufs.sh",
    ],
},
};

export default nextConfig;