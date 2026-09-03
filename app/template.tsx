import Script from 'next/script'

export default async function Template({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div>
                <main>
                    {children} {/* Now has access to mock data */}
                    <Script src='https://static.matterport.com/showcase-sdk/latest.js' />
                </main>
        </div>
    );
}