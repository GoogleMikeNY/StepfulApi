import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import {useEffect, useState} from "react";

const localizer = momentLocalizer(moment);

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {formatDate} from "@/helpers/DateHelper.js"
import {createNewBooking, fetchSlots} from "@/api/bookings.js";
/*
*
* fetchSlots: fetchOnlySlotsPertainingToThemselves | fetchAllCoachSlots
* handleSelectEvent: noop | opens information about the booking and check if there's an issue.
* handleSubmit? createNewBooking | UpdateBookingToBeTaken By the student
* handleSelect: ChangeView | noop
* handleViewChange: ChangeDate | noop
* handleOnNavigate: Debugger? | debugger?
*
*
* */
export function CalendarViewWithProps({fetchSlots, handleSelectEvent, handleSubmit, handleSelectSlot}) {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(moment())
  const [displayDialog, setDisplayDialog] = useState(false);
  const [timeslotData, setTimeslotData] = useState({})
  const [fetchedEvents, setFetchedEvents] = useState([])
  const { id } = useParams();

  useEffect(() => {
    fetchSlots().then((data) => {
      setFetchedEvents(data)
    });
  }, [fetchSlots]);

  const createEvents = () => {
    console.log('fetchedEvents', fetchedEvents)
    return fetchedEvents.map(e => ({
      start: moment(e.start_time).toDate(),
      end: moment(e.end_time).toDate(),
      title: "Bookings"
    }))
  }

  const handleFormSelectEvent = (p) => {
    console.log("WHAT IS P: ", p);
    console.log("A student will probably utilize this to book an appointment!")
    handleSelectEvent();
  };

  const handleClose = () => {
    console.log('closing the thing')
    setDisplayDialog(false)
    setTimeslotData({})
  }

  const handleFormSubmit = () => {
    handleSubmit(id, timeslotData).then(e => setFetchedEvents([...fetchedEvents, e]))
    console.log('handle form submit close')
    handleClose()
  }

  const handleFormSelectSlot = (date) => {
    handleSelectSlot(date, view, {setView, setDate, setTimeslotData, setDisplayDialog})
  };

  const handleViewChange = (vc) => {
    console.log("what is VC: ", vc);
    setView(vc);
  };

  const handleOnNavigate = (e) => {
    setDate(moment(e))
  }

  return (
    <div className="w-full">
      <div className="text-3xl">
        📆 Booking Calendar App 📆
        <p>Hello ID: {id}</p>
      </div>
      <div>
        <div>
          <Calendar
            localizer={localizer}
            events={createEvents()}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            onSelectEvent={handleFormSelectEvent}
            onSelectSlot={handleFormSelectSlot}
            onView={handleViewChange}
            view={view}
            timeslots={2}
            selectable
            date={date}
            onNavigate={handleOnNavigate}
          />
        </div>

        <div>
          <Dialog open={displayDialog} onOpenChange={handleClose}>
            {displayDialog && <DialogContent className='max-w-screen-md'>

              <DialogHeader>
                <DialogTitle>Create Booking</DialogTitle>
                <DialogDescription>Create Booking Timeslot</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid">
                  Booking:
                  <p>Block of time: {formatDate(timeslotData.start)} - {formatDate(timeslotData.end)}</p>
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button type='submit' onClick={handleFormSubmit}>
                  Submit
                </Button>
              </DialogFooter>

            </DialogContent> }
          </Dialog>
        </div>
      </div>
    </div>
  );
}
