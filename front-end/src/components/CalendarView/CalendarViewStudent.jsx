import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";

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
import { formatDate } from "@/helpers/DateHelper.js";
import {
  fetchSlots,
  updateSlotWithStudent,
} from "@/api/slots.js";

export function CalendarViewStudent({ users }) {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(moment());
  const [displayDialog, setDisplayDialog] = useState(false);
  const [timeslotData, setTimeslotData] = useState({});
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchSlots({ student_id: id }).then((data) => {
      setFetchedEvents(data);
    });
  }, []);

  const createEvents = () => {
    return fetchedEvents.map((e) => ({
      id: e.id,
      start: moment(e.start_time).toDate(),
      end: moment(e.end_time).toDate(),
      title: `${users[e.coach_id]?.name}`,
      status: e.status,
      coach: users[e.coach_id],
      student: users[e.student_id]
    }));
  };

  const handleSelectEvent = (selectedTimeslotData) => {
    setDisplayDialog(true);
    setTimeslotData(selectedTimeslotData);
  };

  const handleClose = () => {
    setDisplayDialog(false);
    setTimeslotData({});
  };

  const handleSubmit = (e) => {
    updateSlotWithStudent(currentUser, timeslotData.id).then((e) => {
      const newEvents = fetchedEvents.map((slot) => {
        if (slot.id === e.id) return e;
        return slot;
      });
      setFetchedEvents(newEvents);
    });
    handleClose();
  };

  const handleViewChange = (vc) => {
    setView(vc);
  };

  const handleOnNavigate = (e) => {
    setDate(moment(e));
  };
  const currentUser = users[id];

  const printDialogContent = () => {
    if (timeslotData.status === "available") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Confirm Booking Slot</DialogTitle>
            <DialogDescription>Confirm Booking Timeslot</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid">
              {" "}
              Booking:
              <p>
                Please confirm you wish to meet with {timeslotData.title} at the
                following block of time:
              </p>
              <p>
                {formatDate(timeslotData.start)} -{" "}
                {formatDate(timeslotData.end)}
              </p>
            </div>
          </div>
        </>
      );
    }
    const { coach, student } = timeslotData;
    return (
      <>
        <DialogHeader>
          <DialogTitle>Confirm Booking Slot</DialogTitle>
          <DialogDescription>Confirm Booking Timeslot</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid">
            <p>Booked slot!</p>
            <p>
              You'll be meeting with {coach.name} at{" "}
              {formatDate(timeslotData.start)}.
            </p>
            <p>Here are the phone numbers for the meetings:</p>
            <b>
              <p>
                Coach -- {coach.name}: {coach.phone_number}
              </p>
              <p>
                Student -- {student.name}: {student.phone_number}
              </p>
            </b>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="text-3xl">
        📆 Booking Calendar App 📆
        <p>Hello, {currentUser.name}</p>
      </div>
      <div>
        <div>
          <Calendar
            localizer={localizer}
            events={createEvents()}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            onSelectEvent={handleSelectEvent}
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
            {displayDialog && (
              <DialogContent className="max-w-screen-md">
                {printDialogContent()}
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  {timeslotData.status !== "booked" && (
                    <Button type="submit" onClick={handleSubmit}>
                      Submit
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>
    </div>
  );
}
