import { useEffect, useState } from "react";

interface Tool {
    name: string;
    domain: string;
}

interface Category {
    name: string;
    tools: Tool[];
}

const categories: Category[] = [
    {
        name: "Coded",
        tools: [
            { name: "ChatGPT", domain: "chatgpt.com" },
            { name: "Grok", domain: "grok.com" },
            { name: "Zed", domain: "zed.dev" },
        ],
    },
    {
        name: "Baked",
        tools: [
            { name: "Astro", domain: "astro.build" },
            { name: "pnpm", domain: "pnpm.io" },
            { name: "Tailwind", domain: "tailwindcss.com" },
            { name: "Radix", domain: "radix-ui.com" },
        ],
    },
];

interface TickerItem {
    category: string;
    tool: string;
    domain: string;
}

export default function ToolTicker() {
    const [index, setIndex] = useState(0);

    // Flatten into a sequential list: all "Coded" items, then "Baked", etc.
    const items: TickerItem[] = categories.flatMap((cat) =>
        cat.tools.map((tool) => ({
            category: cat.name,
            tool: tool.name,
            domain: tool.domain,
        })),
    );

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % items.length);
        }, 2500);
        return () => clearInterval(id);
    }, [items.length]);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm text-neutral-500">
            <span className="relative h-5 overflow-hidden inline-block min-w-36 sm:w-40">
                <span
                    className="absolute left-0 top-0 whitespace-nowrap transition-transform duration-500"
                    style={{ transform: `translateY(-${index * 1.5}rem)` }}
                >
                    {items.map((item, idx) => (
                        <span key={idx} className="block h-6 leading-5">
                            {item.category} with {item.tool}
                            <img
                                src={`https://www.google.com/s2/favicons?sz=32&domain=${item.domain}`}
                                alt={`${item.tool} icon`}
                                className="inline h-4 w-4 ml-1 align-middle"
                            />
                        </span>
                    ))}
                </span>
            </span>
            <span className="shrink-0">and love ❤️</span>
        </div>
    );
}
