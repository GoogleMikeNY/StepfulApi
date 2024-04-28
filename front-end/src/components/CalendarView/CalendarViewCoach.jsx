import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createNewSlot, fetchSlots } from '@/api/slots.js';
import { createNewMeetingReview } from '@/api/meetingReviews.js';
import { DialogTemplate } from '@/components/CalendarView/DialogTemplate.jsx';
import { addTwoHoursToStart, formatDate } from '@/helpers/DateHelper.js';
import { Button } from '@/components/ui/button.jsx';

const localizer = momentLocalizer(moment);

export function CalendarViewCoach({ users }) {
  const [view, setView] = useState('month');
  const [meetingReviewRating, setMeetingReviewRating] = useState('');
  const [date, setDate] = useState(moment());
  const [meetingReviewNotes, setMeetingReviewNotes] = useState('');
  const [displayDialog, setDisplayDialog] = useState(false);
  const [timeslotData, setTimeslotData] = useState({});
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const { id } = useParams();
  /*
  * TODO: Use useCallback for CreateEvents.
  * TODO: Update useState for Fetched Events to use useReducer!
  * https://react.dev/learn/extracting-state-logic-into-a-reducer
  * */


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
    createNewSlot(id, timeslotData).then((e) => setFetchedEvents([...fetchedEvents, e]));
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
    if (view === 'month') {
      setView('week');
      setDate(moment(selectedTimeSlot.start));
    } else {
      selectedTimeSlot.end = addTwoHoursToStart(selectedTimeSlot.start);
      selectedTimeSlot.status = 'new';
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
    if (timeslotData.status === 'new') {
      return (
        <DialogTemplate>
          <DialogHeader>
            <DialogTitle>Create Booking</DialogTitle>
            <DialogDescription>Create Booking Timeslot</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid">
              Booking:
              <p>
                Block of time: {formatDate(timeslotData.start)} - {formatDate(timeslotData.end)}
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" onClick={() => handleSubmit(timeslotData)}>
              Submit
            </Button>
          </DialogFooter>
        </DialogTemplate>
      );
    }

    if (timeslotData.status === 'available') {
      return (
        <DialogTemplate>
          <DialogHeader>
            <DialogTitle>Create Booking</DialogTitle>
            <DialogDescription>Create Booking Timeslot</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid">
              Booking:
              <p>
                Block of time: {formatDate(timeslotData.start)} - {formatDate(timeslotData.end)}
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
        </DialogTemplate>
      );
    }
    const { coach, student } = timeslotData;
    return (
      <DialogTemplate>
        <DialogHeader>
          <DialogTitle>Booked Slot!</DialogTitle>
          <DialogDescription>Describing booked slot</DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 justify-between">
          <div className="grid">
            Booked Slot:
            <p>This session is in the books with {timeslotData.student?.name}! following block of time:</p>
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
            <p>If this meeting has occurred, please rate the following session with {timeslotData?.student?.name}.</p>
            <div className="flex mt-4 justify-between">
              <div className="w-1/2">
                <label>
                  Select rating of the meeting
                  <select
                    className="border-2 py-2"
                    value={timeslotData.meetingReview?.rating || ''} // ...force the select's value to match the state variable...
                    disabled={!!timeslotData.meetingReview}
                    onChange={(e) => setMeetingReviewRating(e.target.value)} // ... and update the state variable on any change!
                  >
                    <option value="1">Very Dissatisfied</option>
                    <option value="2">Dissatisfied</option>
                    <option value="3">Neutral</option>
                    <option value="4">Satisfied</option>
                    <option value="5">Very Satisfied</option>
                  </select>
                </label>
              </div>
              <div className="w-1/2">
                <label>
                  Notes:
                  <textarea
                    value={timeslotData.meetingReview?.notes}
                    disabled={!!timeslotData.meetingReview}
                    onChange={(e) => setMeetingReviewNotes(e.target.value)}
                    className="border-2 w-full"
                  />
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
          <Button type="submit" onClick={() => handleCreateReviewForMeeting(timeslotData)}>
            Submit
          </Button>
        </DialogFooter>
      </DialogTemplate>
    );
  };
  const currentUser = users[id];

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
