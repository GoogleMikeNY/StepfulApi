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
  const [date, setDate] = useState(moment());
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
    }));
  };

  const handleSelectEvent = (timeslotData) => {
    setDisplayDialog(true);
    setTimeslotData(timeslotData);
  };

  const handleClose = () => {
    console.log("closing the thing");
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
    handleClose();
  }

  const handleSelectSlot = (p) => {
    console.log("WHAT IS P within handleSelect!!: ", p);
    if (view === "month") {
      setView("week");
      setDate(moment(p.start));
    } else {
      p.end = moment(new Date(p.start)).add(2, "hour").toDate();
      p.status = 'available'
      debugger;
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
    debugger;
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
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      );
    }
    const { coach, student } = timeslotData;
    return (
        <DialogContent className="max-w-screen-md">
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
                {formatDate(timeslotData.start)} -{" "}
                {formatDate(timeslotData.end)}
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
              <div className="flex mt-4">
                <Select>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Meeting Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">
                        N/A -- Didn't meet with Student.
                      </SelectItem>
                      <SelectItem value="1">Very Dissatisfied</SelectItem>
                      <SelectItem value="2">Dissatisfied</SelectItem>
                      <SelectItem value="3">Neutral</SelectItem>
                      <SelectItem value="4">Satisfied</SelectItem>
                      <SelectItem value="5">Very Satisfied</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Textarea className="ml-6" />
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
