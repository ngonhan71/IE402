import { Routes, Route } from "react-router-dom"
import { useSelector } from "react-redux"

import DefaultLayout from "./layouts/DefaultLayout"

import Login from "./pages/Login"

// import Home from "./pages/Home"

import SymbolList from "./pages/Symbol/SymbolList"

import ProvinceList from "./pages/Province/ProvinceList"

import LocationList from "./pages/Location/LocationList"
import AddLocation from "./pages/Location/AddLocation"

import TourList from "./pages/Tour/TourList"
import AddTour from "./pages/Tour/AddTour"


import Map from "./pages/Map"



function App() {

  const user = useSelector((state) => state.user)

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Map />}></Route>

        <Route element={<DefaultLayout isAllowed={user.role > 0} />}>
          {/* <Route path="/overview" element={<Home />}></Route> */}

          <Route path="/symbol" element={<SymbolList />}></Route>

          <Route path="/province" element={<ProvinceList />}></Route>

          <Route path="/location" element={<LocationList />}></Route>
          <Route path="/location/add" element={<AddLocation />}></Route>

          <Route path="/tour" element={<TourList />}></Route>
          <Route path="/tour/add" element={<AddTour />}></Route>
        
        </Route>
      </Routes>
    </div>
  );
}

export default App;
