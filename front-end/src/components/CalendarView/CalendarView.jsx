import {useParams} from "react-router-dom";
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'

import "react-big-calendar/lib/css/react-big-calendar.css";
import {useState} from "react";
const localizer = momentLocalizer(moment)

import { CopyIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


/*
*
* */
export function CalendarView() {
  const [view, setView] = useState('month')
  const [displayDialog, setDisplayDialog] = useState(false)
  const handleSelectEvent = p => {
    console.log("WHAT IS P: ", p)
  }

  const handleSelectSlot = p => {
    console.log("WHAT IS P within handleSelect!!: ", p)
    if(view === 'month') {
      setView('week')
      // return
    } else {

    }

  }
  const handleViewChange = vc => {
    console.log('what is VC: ', vc)
    setView(vc)
  }
  let {id} = useParams();

  return (
    <div className='w-full'>
      <div className='text-3xl'>
        📆 Booking Calendar App 📆

        <p>
          Hello ID: {id}
        </p>
      </div>
      <div>
        <div>
          <Calendar
            localizer={localizer}
            events={[
              {
                start: moment().toDate(),
                end: moment()
                  .add(1, "days")
                  .toDate(),
                title: "Some title"
              }
            ]}
            startAccessor="start"
            endAccessor="end"
            style={{height: 700}}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onView={handleViewChange}
            view={view}
            selectable
          />
        </div>
        <div>
          {!!displayDialog && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Share</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to view this.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input
                      id="link"
                      defaultValue="https://ui.shadcn.com/docs/installation"
                      readOnly
                    />
                  </div>
                  <Button type="submit" size="sm" className="px-3">
                    <span className="sr-only">Copy</span>
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}
