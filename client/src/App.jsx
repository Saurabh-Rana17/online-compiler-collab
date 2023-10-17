import "./App.css";
import React from "react";
import OfflineEditor from "./OfflineEditor";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/editor" element={<OfflineEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
