import {useEffect, useState} from "react";
import {getUsers} from "@/api/users.js"
import {useParams} from "react-router-dom";
import {CalendarViewWithProps} from "@/components/CalendarView/CalendarViewWithProps.jsx";
import {createNewBooking, fetchSlots} from "@/api/bookings.js";
export function Calendar() {
  const [users, setUsers] = useState({})
  useEffect(() => {
    const foo = getUsers().then(setUsers)
      }, [])
  const { id } = useParams();

  console.log('The id is: ', id)
  console.log('This person is a... ', users[id]?.user_type)

  const user = users[id];
// * fetchSlots: fetchOnlySlotsPertainingToThemselves | fetchAllCoachSlots
//   * handleSelectEvent: noop | opens information about the booking and check if there's an issue.
//   * handleSubmit? createNewBooking | UpdateBookingToBeTaken By the student
//   * handleSelect: ChangeView | noop
//   * handleViewChange: ChangeDate | noop
//   * handleOnNavigate: Debugger? | debugger?
//   const handleSubmit = () => {
//     console.log('bro submitted it!! ')
//     console.log('whats the timeslot data? ', timeslotData)
//     createNewBooking(id, timeslotData).then(e => setFetchedEvents([...fetchedEvents, e]))
//     handleClose()
//   }

  const handleSubmitForCoach = (id, timeslotData) => {
    console.log('bro submitted it!! ')
    console.log('whats the timeslot data? ', timeslotData)
    return createNewBooking(id, timeslotData)
  }

  if(user?.user_type === "coach") {
    return (

      <div>
        This is a coach!
        <CalendarViewWithProps fetchSlots={fetchSlots} handleSelectEvent={() => {}} handleSubmit={handleSubmitForCoach}  />
      </div>
    )
  }


  return (<div>
    This is a student?!
  </div>)
}