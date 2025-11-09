import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./views/Homepage";
import Header from "./components/Header";
import EpisodePage from "./views/EpisodePage";
import { FilterProvider } from "./components/filter";

/**
 * Application component.
 *
 * @returns {JSX.Element} App component.
 */
function App() {
  return (
    <>
      {" "}
      <Header />
      <FilterProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/show/:showId" element={<EpisodePage />} />
        </Routes>
      </FilterProvider>
    </>
  );
}

export default App;
