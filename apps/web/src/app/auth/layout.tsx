export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex min-h-screen items-center justify-center flex-col px-4">
			<div className="w-full max-w-xs">{children}</div>
		</div>
	)
}
