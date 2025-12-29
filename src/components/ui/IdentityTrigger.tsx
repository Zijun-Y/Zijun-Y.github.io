import * as Dialog from "@radix-ui/react-dialog";
import WordTicker from "@/components/ui/WordTicker";
import { IdentityDrawer } from "@/components/ui/IdentityDrawer";

export default function IdentityTrigger() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <div>
                    <WordTicker />
                </div>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />
                <IdentityDrawer />
            </Dialog.Portal>
        </Dialog.Root>
    );
}
