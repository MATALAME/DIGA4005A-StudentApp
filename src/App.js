import React from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Load from "./pages/Load";
import { JobProvider } from "./Context/JobContext";
import JobDetails from "./pages/JobDetails";
import ChatPage from "./pages/ChatPage";
import ChatListPage from "./pages/ChatListPage"; 
import Questionnaire from "./pages/Questionnaire";
import ProfilePage from "./pages/ProfilePage";
import AllUsers from "./pages/AllUsers";
import ProtectedRoute from "./Components/ProtectedRoute";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <JobProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Load />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questionnaire"
            element={
              <ProtectedRoute>
                <Questionnaire />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-users"
            element={
              <ProtectedRoute>
                <AllUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/load"
            element={
              <ProtectedRoute>
                <Load />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job/:jobId"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </JobProvider>
  );
}

export default App;