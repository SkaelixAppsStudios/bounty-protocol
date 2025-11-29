import { WhopApp } from "@whop/react/components";
import { Theme } from "@whop/frosted-ui";
import { SkaelixFooter } from "@/components/branding/SkaelixFooter";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Whop App",
	description: "My Whop App",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<WhopApp>
					<Theme appearance="dark">
						<div className="min-h-screen flex flex-col bg-gray-900 text-white">
							<main className="flex-1 p-6">
								{children}
							</main>
							<SkaelixFooter />
						</div>
					</Theme>
				</WhopApp>
			</body>
		</html>
	);
}
