import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter, Navigate,
    RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import './index.css'
import {CalendarView} from "@/components/CalendarView/CalendarView.jsx";

const router = createBrowserRouter([
    {
        path: "*",
        element: <Navigate to={"/users/1"}/>
    }, {
        path: "/users/:id",
        element: <CalendarView />

    }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
