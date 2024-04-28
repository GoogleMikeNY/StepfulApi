import { useEffect, useState } from "react";
import { getUsers } from "@/api/users.js";
import { Link } from "react-router-dom";

export function Home() {
  const [users, setUsers] = useState({});
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <>
      <p className='text-3xl mb-16'>📆 Booking Calendar App 📆</p>
      {Object.values(users).map((u) => {
        return (
          <div key={u.id}>
            <Link id={u.id} to={`/users/${u.id}`}>
              {u.name} -- {u.user_type}
            </Link>
          </div>
        );
      })}
    </>
  );
}
