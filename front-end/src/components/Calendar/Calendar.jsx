import {useEffect, useState} from "react";
import {getUsers} from "@/api/users.js"
import {Navigate, useParams} from "react-router-dom";
import {CalendarViewCoach} from "@/components/CalendarView/CalendarViewCoach.jsx";
import {CalendarViewStudent} from "@/components/CalendarView/CalendarViewStudent.jsx";
export function Calendar() {
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false)
    });

  }, [])
  const { id } = useParams();

  const user = users[id];
  if(user?.user_type === "coach") {
    return (
      <div>
        This is a coach!
        <CalendarViewCoach users={users}/>
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

  if(loading === true) {
    return (
      <div>Now loading</div>
    )
  }
}