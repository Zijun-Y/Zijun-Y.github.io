import * as Dialog from "@radix-ui/react-dialog";

export function IdentityDrawer() {
    return (
        <Dialog.Root>
            {/* Trigger */}
            <Dialog.Trigger asChild>
                <button
                    className="group flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium
                     hover:bg-neutral-100 dark:hover:bg-neutral-800
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    aria-label="Open identity panel"
                >
                    <span className="text-lg leading-none">⦿</span>
                    <span>Zijun</span>
                    <span
                        className="text-xs transition-transform group-hover:translate-y-0.5"
                        aria-hidden="true"
                    >
                        ▾
                    </span>
                </button>
            </Dialog.Trigger>

            {/* Overlay */}
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />

                {/* Content */}
                <Dialog.Content
                    className="fixed left-0 top-0 z-50 h-full w-[300px]
                     bg-white dark:bg-neutral-900
                     p-6 shadow-lg
                     focus:outline-none"
                >
                    <Dialog.Title className="text-lg font-semibold">
                        Zijun
                    </Dialog.Title>

                    <Dialog.Description className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Researcher at the intersection of systems and theory.
                    </Dialog.Description>

                    {/* Profile image placeholder */}
                    <div className="mt-6">
                        <div className="h-24 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700">
                            {/* image goes here later */}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="mt-6 flex flex-col gap-3 text-sm">
                        <a
                            href="mailto:your@email.com"
                            className="hover:underline"
                        >
                            Email
                        </a>
                        <a href="#" className="hover:underline">
                            Google Scholar
                        </a>
                        <a href="#" className="hover:underline">
                            GitHub
                        </a>
                    </div>

                    {/* Close */}
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-4 top-4 rounded-md px-2 py-1
                         hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
