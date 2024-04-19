const {VITE_API_URL} = import.meta.env
export const createNewMeetingReview = async (slotId, {meetingReviewRating, meetingReviewNotes}) => {
  const slotResponse = await fetch(`${VITE_API_URL}/meeting_reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
// :rating, :notes, :slot_id
    body: JSON.stringify({
      slot_id: slotId,
      rating: meetingReviewRating,
      notes: meetingReviewNotes,
    })
  })

  return await slotResponse.json()
}
