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
import { createNewBooking, fetchSlots } from "@/api/bookings.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {createNewMeetingReview} from "@/api/meetingReviews.js";

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
export function CalendarView({ users }) {
  const [view, setView] = useState("month");
  const [meetingReviewRating, setMeetingReviewRating] = useState("");
  const [date, setDate] = useState(moment());
  const [meetingReviewNotes, setMeetingReviewNotes] = useState("")
  const [displayDialog, setDisplayDialog] = useState(false);
  const [timeslotData, setTimeslotData] = useState({});
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchSlots({ coach_id: id }).then((data) => {
      setFetchedEvents(data);
    });
  }, []);

  const createEvents = () => {
    return fetchedEvents.map((e) => ({
      id: e.id,
      start: moment(e.start_time).toDate(),
      end: moment(e.end_time).toDate(),
      title: `Meeting with ${users[e.coach_id]?.name}`,
      status: e.status,
      coach: users[e.coach_id],
      student: users[e.student_id],
      resourceId: e.id,
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
    createNewBooking(id, timeslotData).then((e) =>
      setFetchedEvents([...fetchedEvents, e]),
    );
    handleClose();
  };

  const handleCreateReviewForMeeting = () => {
    const {id: slotId} = timeslotData
    createNewMeetingReview(slotId, {
      meetingReviewRating,
      meetingReviewNotes,
    }).then((data) => {
      const newEvents = fetchedEvents.map((slot) => {
        if (slot.id === data.slot_id) return slot;
        return slot;
      });
      setFetchedEvents(newEvents);
    });
    handleClose();
  };

  const handleSelectSlot = (p) => {
    if (view === "month") {
      setView("week");
      setDate(moment(p.start));
    } else {
      p.end = moment(new Date(p.start)).add(2, "hour").toDate();
      p.status = "new";
      setTimeslotData(p);
      setDisplayDialog(true);
    }
  };

  const handleViewChange = (vc) => {
    setView(vc);
  };

  const handleOnNavigate = (e) => {
    setDate(moment(e));
  };

  const printDialogContent = () => {
    if (timeslotData.status === "new") {
      return (
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>Create Booking</DialogTitle>
            <DialogDescription>Create Booking Timeslot</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid">
              Booking:
              <p>
                Block of time: {formatDate(timeslotData.start)} -{" "}
                {formatDate(timeslotData.end)}
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      );
    }
    if (timeslotData.status === "available") {
      return (
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>Create Booking</DialogTitle>
            <DialogDescription>Create Booking Timeslot</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid">
              Booking:
              <p>
                Block of time: {formatDate(timeslotData.start)} -{" "}
                {formatDate(timeslotData.end)}
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      );
    }
    const { coach, student } = timeslotData;
    return (
      <DialogContent className="max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Booked Slot!</DialogTitle>
          <DialogDescription>Describing booked slot</DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 justify-between">
          <div className="grid">
            Booked Slot:
            <p>
              This session is in the books with {timeslotData.student?.name}!
              following block of time:
            </p>
            <p>
              {formatDate(timeslotData.start)} - {formatDate(timeslotData.end)}
            </p>
            <p>Here are the phone numbers for the meetings:</p>
            <b>
              <p>
                Coach -- {coach?.name}: {coach?.phone_number}
              </p>
              <p>
                Student -- {student?.name}: {student?.phone_number}
              </p>
            </b>
            <p>
              If this meeting has occurred, please rate the following session
              with {timeslotData?.student?.name}.
            </p>
            <div className="flex mt-4 justify-between">
              <div className='w-1/2'>
                <label>
                  Select rating of the meeting
                  <select
                    className="border-2 py-2"
                    value={meetingReviewRating} // ...force the select's value to match the state variable...
                    onChange={(e) => setMeetingReviewRating(e.target.value)} // ... and update the state variable on any change!
                  >
                    <option value="0">N/A -- Didn't meet with Student.</option>
                    <option value="1">Very Dissatisfied</option>
                    <option value="2">Dissatisfied</option>
                    <option value="3">Neutral</option>
                    <option value="4">Satisfied</option>
                    <option value="5">Very Satisfied</option>
                  </select>
                </label>
              </div>
              <div className='w-1/2'>
                <label>
                  Notes:
                  <textarea value={meetingReviewNotes} onChange={e => setMeetingReviewNotes(e.target.value)} className="border-2 w-full" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleCreateReviewForMeeting}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  };

  const currentUser = users[id];

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
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
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
            {displayDialog && printDialogContent()}
          </Dialog>
        </div>
      </div>
    </div>
  );
}
