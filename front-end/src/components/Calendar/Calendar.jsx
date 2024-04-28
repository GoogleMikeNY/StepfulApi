import { useEffect, useState } from "react";
import { getUsers } from "@/api/users.js";
import { Link, useParams } from "react-router-dom";
import { CalendarViewCoach } from "@/components/CalendarView/CalendarViewCoach.jsx";
import { CalendarViewStudent } from "@/components/CalendarView/CalendarViewStudent.jsx";

export function Calendar() {
  const [users, setUsers] = useState({});
  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
    });
  }, []);
  const { id } = useParams();

  const user = users[id];
  if (user?.user_type === "coach") {
    return (
      <div>
        This is a coach!
        <CalendarViewCoach users={users} />
      </div>
    );
  }
  if (user?.user_type === "student") {
    return (
      <div>
        This is a STUDENT!!!
        <CalendarViewStudent users={users} />
      </div>
    );
  }

  return (
    <>
      <p>
        Either users are being loaded, or there's an error within the route.
      </p>
      <p>
        Please navigate to the root and choose a valid user:
      </p>
      <p className='text-3xl'><Link to={`/`}>Here</Link></p>
    </>
  );
}
