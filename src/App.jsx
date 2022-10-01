import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomeLayout } from "./layouts/HomeLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Dating from "./pages/Dating";
import Events from "./pages/Events";
import ForgotPassword from "./pages/ForgotPassword";
import { AdminLayout } from "./layouts/AdminLayout";
import { OrganiserLayout } from "./layouts/OrganiserLayout";
import PendingEvents from "./pages/Admin/PendingEvents";
import DeclinedEvents from "./pages/Admin/DeclinedEvents";
import ApprovedEvents from "./pages/Admin/ApprovedEvents";
import OrganiserApprovedEvents from "./components/Organisations/OrganiserApprovedEvents";
import OrganiserDeclinedEvents from "./components/Organisations/OrganiserDeclinedEvents";
import OrganiserPendingEvents from "./components/Organisations/OrganiserPendingEvents";
import CreateEvent from "./components/Organisations/CreateEvent";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="" element={<Navigate to="events" />} />
        <Route path="*" element={<Navigate to="events" />} />
        <Route path="events" element={<Events />} />
        <Route path="chat" element={<Chat />} />
        <Route path="dating" element={<Dating />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="pending-events" element={<PendingEvents />} />
        <Route path="approved-events" element={<ApprovedEvents />} />
        <Route path="declined-events" element={<DeclinedEvents />} />
      </Route>
      <Route path="/organiser" element={<OrganiserLayout />}>
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="pending-events" element={<OrganiserPendingEvents />} />
        <Route path="approved-events" element={<OrganiserApprovedEvents />} />
        <Route path="declined-events" element={<OrganiserDeclinedEvents />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
