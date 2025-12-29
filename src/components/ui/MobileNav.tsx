import * as Dialog from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";

export default function MobileNav() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button
                    className="
            rounded-md p-2
            hover:bg-neutral-100 dark:hover:bg-neutral-800
          "
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                <Dialog.Content
                    className="
            fixed inset-x-4 top-24 z-50
            rounded-xl
            bg-white dark:bg-neutral-900
            p-4
            shadow-lg
          "
                >
                    <nav className="flex flex-col gap-3 text-sm font-medium">
                        <a href="/">Home</a>
                        <a href="/cv">CV</a>
                        <a href="/publications">Publications</a>
                        <a href="/about">About</a>
                    </nav>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
