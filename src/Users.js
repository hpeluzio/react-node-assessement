// MyComponent.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, setUsers } from "./userSlice";

function Users() {
  const { loading, users } = useSelector((state) => state.user);
  console.log("Users: ", users);

  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      await dispatch(getUsers());
    };
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      Users:
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
