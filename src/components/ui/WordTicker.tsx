import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const WORDS = ["Hi there", "Contact me", "Salut 👋"];

export default function WordTicker({
    onInteract,
}: {
    onInteract?: () => void;
}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % WORDS.length);
        }, 2500);
        return () => clearInterval(id);
    }, []);

    return (
        <button
            onClick={onInteract}
            className="
        group flex items-center gap-3
        rounded-xl px-4 py-2
        text-base font-medium
        bg-transparent
        transition cursor-pointer
      "
        >
            <span className="relative h-5 w-28 overflow-hidden">
                <span
                    className="absolute left-0 top-0 transition-transform duration-500"
                    style={{ transform: `translateY(-${index * 1.25}rem)` }}
                >
                    {WORDS.map((w) => (
                        <span key={w} className="block h-5 leading-5">
                            {w}
                        </span>
                    ))}
                </span>
            </span>

            <ArrowRight className="h-4 w-4 text-neutral-500" />
        </button>
    );
}
