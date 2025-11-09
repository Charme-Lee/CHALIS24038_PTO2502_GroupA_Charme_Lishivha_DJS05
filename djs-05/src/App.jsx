import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShowDetailPage from "./pages/ShowDetailPage";
import { FilterProvider } from "./context/FilterContext";
import Header from "./components/Header";

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
          <Route path="/show/:showId" element={<ShowDetailPage />} />
        </Routes>
      </FilterProvider>
    </>
  );
}

export default App;
