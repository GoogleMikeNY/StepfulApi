import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { formatDate } from "@/helpers/DateHelper.js";
import { Button } from "@/components/ui/button.jsx";

export function DialogTemplateWithChildren({
  children
}) {
  return (
    <DialogContent className="max-w-screen-md">
        <>
          DIALOG TEMPLATE WITH CHILDREN!!
          {children}
        </>
    </DialogContent>
  );
}