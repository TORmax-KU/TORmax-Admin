'use client';

import { useState } from 'react';

interface ScraperResponse {
    success: boolean;
    data?: any;
    error?: string;
    statusCode?: number;
    url?: string;
}

export default function WebScrapeSettingsPage() {
    const [apiKey, setApiKey] = useState('');
    const [targetUrl, setTargetUrl] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const [response, setResponse] = useState<ScraperResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleScrape = async () => {
        if (!apiKey) {
            setError('Please enter your ScraperAPI key');
            return;
        }
        if (!targetUrl) {
            setError('Please enter a URL to scrape');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            // Build the ScraperAPI URL
            const baseUrl = 'https://api.scraperapi.com';
            const params = new URLSearchParams({
                api_key: apiKey,
                url: targetUrl,
                // Add premium proxy support
                premium: 'true',
                // Use JSON response format
                format: 'json',
                // User defined prompt - will be sent as a custom parameter
                ...(customPrompt && { prompt: customPrompt }),
            });

            const response = await fetch(`${baseUrl}?${params.toString()}`);
            const data = await response.json();

            if (response.ok) {
                setResponse({
                    success: true,
                    data: data,
                    statusCode: response.status,
                    url: targetUrl,
                });
            } else {
                setResponse({
                    success: false,
                    error: data.error || 'Scraping failed',
                    statusCode: response.status,
                });
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold">🔍 Web Scrape Settings</h1>
                <div className="flex gap-2">
                    <a
                        href="https://dashboard.scraperapi.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                    >
                        📊 Dashboard
                    </a>
                    <a
                        href="https://www.scraperapi.com/documentation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                    >
                        📖 Docs
                    </a>
                </div>
            </div>

            {/* Main Settings Card */}
            <div className="bg-base-100 shadow-lg rounded-box p-6">
                <h2 className="text-xl font-bold mb-4">⚙️ ScraperAPI Configuration</h2>

                <div className="space-y-4">
                    {/* API Key Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">🔑 API Key</span>
                            <span className="label-text-alt text-error">Required</span>
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter your ScraperAPI key"
                                className="input input-bordered w-full"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
                                onClick={() => {
                                    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                                    input.type = input.type === 'password' ? 'text' : 'password';
                                }}
                            >
                                👁️
                            </button>
                        </div>
                        <label className="label">
                            <span className="label-text-alt">Get your API key from <a href="https://dashboard.scraperapi.com" target="_blank" rel="noopener noreferrer" className="link link-primary">ScraperAPI Dashboard</a></span>
                        </label>
                    </div>

                    {/* Target URL Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">🌐 Target URL</span>
                            <span className="label-text-alt text-error">Required</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/page-to-scrape"
                            className="input input-bordered w-full"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                        />
                    </div>

                    {/* Custom Prompt Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">💬 Request Prompt (Optional)</span>
                            <span className="label-text-alt">Custom instructions for the scraper</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-24"
                            placeholder="e.g., Extract all product names, prices, and descriptions"
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                        />
                    </div>

                    {/* Scrape Button */}
                    <button
                        className="btn btn-primary w-full"
                        onClick={handleScrape}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Scraping...
                            </>
                        ) : (
                            '🚀 Start Scraping'
                        )}
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* API Response Display */}
            {response && (
                <div className="bg-base-100 shadow-lg rounded-box p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">📥 API Response</h2>
                        <div className="flex gap-2">
                            <span className={`badge ${response.success ? 'badge-success' : 'badge-error'}`}>
                                {response.success ? 'Success' : 'Failed'}
                            </span>
                            {response.statusCode && (
                                <span className="badge badge-ghost">Status: {response.statusCode}</span>
                            )}
                        </div>
                    </div>

                    {response.url && (
                        <div className="text-sm opacity-70 mb-4">
                            URL: <span className="font-mono">{response.url}</span>
                        </div>
                    )}

                    <div className="bg-base-200 rounded-lg p-4 overflow-auto max-h-96">
                        <pre className="text-sm whitespace-pre-wrap">
                            {response.error
                                ? `❌ Error: ${response.error}`
                                : JSON.stringify(response.data, null, 2)
                            }
                        </pre>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                                const text = response.error
                                    ? response.error
                                    : JSON.stringify(response.data, null, 2);
                                navigator.clipboard.writeText(text);
                            }}
                        >
                            📋 Copy
                        </button>
                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setResponse(null)}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Examples */}
            <div className="bg-base-100 shadow-lg rounded-box p-6">
                <h3 className="font-semibold mb-2">💡 Quick Examples</h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setTargetUrl('https://books.toscrape.com')}
                    >
                        📚 Books Demo
                    </button>
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setTargetUrl('https://quotes.toscrape.com')}
                    >
                        💬 Quotes Demo
                    </button>
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                            setTargetUrl('https://scrapeme.live/shop');
                            setCustomPrompt('Extract all product names and prices');
                        }}
                    >
                        🛍️ Shop Demo with Prompt
                    </button>
                </div>
            </div>
        </div>
    );
}