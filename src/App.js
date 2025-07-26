import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Load from "./pages/Load";
import { JobProvider } from "./Context/JobContext";
import JobDetails from "./pages/JobDetails";

function App() {
  return (
    <JobProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/load" element={<Load/>} />
        <Route path="/job/:jobId" element={<JobDetails />} />
      </Routes>
    </Router>
    </JobProvider>
  );
}

export default App;