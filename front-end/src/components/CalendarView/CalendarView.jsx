import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";

const localizer = momentLocalizer(moment);

import {
  Dialog,
} from "@/components/ui/dialog";
import { createNewBooking, fetchSlots } from "@/api/bookings.js";
import { createNewMeetingReview } from "@/api/meetingReviews.js";
import { DialogTemplate } from "@/components/CalendarView/DialogTemplate.jsx";

export function CalendarView({ users }) {
  const [view, setView] = useState("month");
  const [meetingReviewRating, setMeetingReviewRating] = useState("");
  const [date, setDate] = useState(moment());
  const [meetingReviewNotes, setMeetingReviewNotes] = useState("");
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
      meetingReview: e.meeting_review,
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

  const handleSubmit = (timeslotData) => {
    debugger;
    createNewBooking(id, timeslotData).then((e) =>
      setFetchedEvents([...fetchedEvents, e]),
    );
    handleClose();
  };

  const handleCreateReviewForMeeting = (selectedTimeslotData) => {
    const { id: slotId } = selectedTimeslotData;
    createNewMeetingReview(slotId, {
      meetingReviewRating,
      meetingReviewNotes,
    }).then((data) => {
      const newEvents = fetchedEvents.map((slot) => {
        if (slot.id === data.slot_id) {
          slot.meeting_review = data;
        }
        return slot;
      });
      setFetchedEvents(newEvents);
      createEvents();
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
        <DialogTemplate
          timeslotData={timeslotData}
          handleSubmit={handleSubmit}
          allowSubmit={true}
          useBookedSlotTemplate={false}
        />
      );
    }

    if (timeslotData.status === "available") {
      return (
        <DialogTemplate
          timeslotData={timeslotData}
          handleSubmit={null}
          allowSubmit={false}
          useBookedSlotTemplate={false}
        />
      );
    }
    return (
      <DialogTemplate
        timeslotData={timeslotData}
        handleSubmit={handleCreateReviewForMeeting}
        allowSubmit={true}
        useBookedSlotTemplate={true}
        setMeetingReviewNotes={setMeetingReviewNotes}
        setMeetingReviewRating={setMeetingReviewRating}
      />
    );
  };

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
