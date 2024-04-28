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

export function DialogTemplate({
  timeslotData,
  handleSubmit,
  allowSubmit,
  useBookedSlotTemplate,
  setMeetingReviewRating,
  setMeetingReviewNotes,
  children
}) {
  return (
    <DialogContent className="max-w-screen-md">
      {useBookedSlotTemplate ? (
        bookedSlotTemplate(timeslotData, handleSubmit,  setMeetingReviewRating, setMeetingReviewNotes)
      ) : (
        <>
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
            {!!allowSubmit && (
              <Button type="submit" onClick={() => handleSubmit(timeslotData)}>
                Submit
              </Button>
            )}
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
}

function bookedSlotTemplate(timeslotData, handleCreateReviewForMeeting, setMeetingReviewRating, setMeetingReviewNotes) {
  const { coach, student } = timeslotData;
  return (
    <>
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
            If this meeting has occurred, please rate the following session with{" "}
            {timeslotData?.student?.name}.
          </p>
          <div className="flex mt-4 justify-between">
            <div className="w-1/2">
              <label>
                Select rating of the meeting
                <select
                  className="border-2 py-2"
                  value={timeslotData.meetingReview?.rating} // ...force the select's value to match the state variable...
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
    </>
  );
}
