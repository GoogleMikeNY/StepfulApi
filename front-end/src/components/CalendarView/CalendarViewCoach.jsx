import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";

const localizer = momentLocalizer(moment);

import {
  Dialog,
} from "@/components/ui/dialog";
import { createNewSlot, fetchSlots } from "@/api/slots.js";
import { createNewMeetingReview } from "@/api/meetingReviews.js";
import { DialogTemplate } from "@/components/CalendarView/DialogTemplate.jsx";
import {addTwoHoursToStart} from "@/helpers/DateHelper.js";

export function CalendarViewCoach({ users }) {
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
    createNewSlot(id, timeslotData).then((e) =>
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

  const handleSelectSlot = (selectedTimeSlot) => {
    if (view === "month") {
      setView("week");
      setDate(moment(selectedTimeSlot.start));
    } else {
      selectedTimeSlot.end = addTwoHoursToStart(selectedTimeSlot.start)
      selectedTimeSlot.status = "new";
      setTimeslotData(selectedTimeSlot);
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
  const currentUser = users[id]

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
