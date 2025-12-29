import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import {
    Mail,
    Github,
    GraduationCap,
    type LucideIcon,
    Linkedin,
    Clipboard,
    Eye,
    ClipboardCheck,
} from "lucide-react";

interface DrawerLinkProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

const emailSource = "emlqdW4ueXVAbWFpbC5tY2dpbGwuY2E=";

function DrawerLink({ icon: Icon, label, href }: DrawerLinkProps) {
    return (
        <a
            href={href}
            className="
        flex items-center gap-3
        rounded-lg px-3 py-2
        text-sm font-medium
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        transition
      "
        >
            <Icon className="h-4 w-4 text-neutral-500" />
            {label}
        </a>
    );
}

export function IdentityDrawer() {
    const [emailAddress, setEmailAddress] = useState("Email");
    const [copied, setCopied] = useState(false);

    return (
        <Dialog.Content
            className="
          fixed left-4 top-4 bottom-4 z-50 w-[320px]
          rounded-2xl
          bg-white dark:bg-neutral-900
          p-6
          shadow-xl
          focus:outline-none

          data-[state=open]:animate-in
          data-[state=open]:fade-in
          data-[state=open]:slide-in-from-left-6
          data-[state=open]:duration-500
          data-[state=open]:ease-out

          data-[state=closed]:animate-out
          data-[state=closed]:fade-out
          data-[state=closed]:slide-out-to-left-6
          data-[state=closed]:duration-200
          data-[state=closed]:ease-in
        "
        >
            <Dialog.Title className="text-lg font-semibold">
                Zijun Yu
            </Dialog.Title>

            <Dialog.Description className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                PhD student in in Mathematics and Statistics, McGill University
            </Dialog.Description>

            {/* Avatar */}
            <div className="mt-5">
                <div className="h-20 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </div>

            {/* Links */}
            <div className="mt-6 space-y-2">
                <div className="flex flex-row">
                    <button
                        onClick={() => {
                            const email = atob(emailSource);
                            window.location.href = `mailto:${email}`;
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer grow"
                    >
                        <Mail className="h-4 w-4 text-neutral-500" />
                        {emailAddress}
                    </button>
                    <div className="flex flex-row">
                        <button
                            onClick={() => {
                                const email = atob(emailSource);
                                navigator.clipboard
                                    .writeText(email)
                                    .then(() => setCopied(true));
                            }}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        >
                            {copied ? (
                                <ClipboardCheck className="h-4 w-4 text-neutral-500" />
                            ) : (
                                <Clipboard className="h-4 w-4 text-neutral-500" />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                const email = atob(emailSource);
                                setEmailAddress(email);
                            }}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        >
                            <Eye className="h-4 w-4 text-neutral-500" />
                        </button>
                    </div>
                </div>
                {/*<DrawerLink
                    icon={GraduationCap}
                    label="Google Scholar"
                    href="#"
                />*/}
                <DrawerLink
                    icon={Github}
                    label="GitHub"
                    href="https://github.com/Zijun-Y"
                />
                <DrawerLink
                    icon={Linkedin}
                    label="LinkedIn"
                    href="https://www.linkedin.com/in/yuzijun"
                />
            </div>

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
    );
}
