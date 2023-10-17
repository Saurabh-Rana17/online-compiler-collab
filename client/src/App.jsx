import "./App.css";
import React from "react";
import OfflineEditor from "./OfflineEditor";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LiveEditor from "./LiveEditor";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/editor" element={<OfflineEditor />} />
          <Route path="/live-editor" element={<LiveEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
