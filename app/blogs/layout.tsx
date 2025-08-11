import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "hold on ⛽️",
    description: "个人博客系统",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <main className="h-[calc(100vh-80px)] overflow-y-auto bg-gray-300">
                {children}
            </main>
        </>
    );
}
