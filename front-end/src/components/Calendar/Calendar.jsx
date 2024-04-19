import {useEffect, useState} from "react";
import {getUsers} from "@/api/users.js"
import {useParams} from "react-router-dom";
import {CalendarView} from "@/components/CalendarView/CalendarView.jsx";
import {CalendarViewStudent} from "@/components/CalendarView/CalendarViewStudent.jsx";
export function Calendar() {
  const [users, setUsers] = useState({})
  useEffect(() => {
    const foo = getUsers().then(setUsers)
      }, [])
  const { id } = useParams();

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
//   setTimeslotData(p)
//   setDisplayDialog(true);

  // const handleSelectSlot = (selectedDate, view, {setView, setDate, setTimeslotData, setDisplayDialog}) => {
  //   console.log("WHAT IS P within handleSelect!!: ", selectedDate);
  //   if (view === "month") {
  //     setView("week");
  //     setDate(moment(selectedDate.start))
  //   } else {
  //     console.log('P is a thing: ', p)
  //     selectedDate.end = moment(new Date(selectedDate.start)).add(2, 'hour').toDate()
  //     setTimeslotData(selectedDate)
  //     setDisplayDialog(true);
  //   }
  // }
  //
  // const handleSubmitForCoach = (id, timeslotData) => {
  //   return createNewBooking(id, timeslotData)
  // }

  if(user?.user_type === "coach") {
    return (
      <div>
        This is a coach!
        <CalendarView/>
      </div>
    )
  }
  if(user?.user_type === 'student') {
    return (
      <div>
        This is a STUDENT!!!
        <CalendarViewStudent users={users}/>
      </div>
    )
  }


  return (<div>
    This is blank?
  </div>)
}