const {VITE_API_URL} = import.meta.env
export const createNewBooking = async (userId, timeslotData) => {
  const slotResponse = await fetch(`${VITE_API_URL}/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      coach_id: userId,
      start_time: timeslotData.start,
      end_time: timeslotData.end,
    })
  })
  return await slotResponse.json()

}

export const fetchSlots = async (queryParams = {}) => {
  const buildQueryParams = new URLSearchParams(queryParams).toString()
  const slotsResponse = await fetch(`${VITE_API_URL}/slots?${buildQueryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  })

  const slotsResponseJSON = await slotsResponse.json()

  console.log("Are we fetching the things??", slotsResponseJSON)
  return slotsResponseJSON
}

export const updateSlotWithStudent = async (user, slotId) => {
  const slotsResponse = await fetch(`${VITE_API_URL}/slots/${slotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      id: slotId,
      student_id: user.id,
      status: 'booked'
    })
  })

  const slotsResponseJSON = await slotsResponse.json()

  console.log("Are we fetching the things??", slotsResponseJSON)
  return slotsResponseJSON

}

export const fetchAvailableSlots = async () => {
  const slotsResponse = await fetch(`${VITE_API_URL}/slots`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  })

  const slotsResponseJSON = await slotsResponse.json()

  console.log("Are we fetching the things??", slotsResponseJSON)
  return slotsResponseJSON
}