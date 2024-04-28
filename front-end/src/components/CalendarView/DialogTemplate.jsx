import {DialogContent} from "@/components/ui/dialog.jsx";

export function DialogTemplate({children}) {
  return (<DialogContent className="max-w-screen-md">
    <>
      {children}
    </>
  </DialogContent>);
}