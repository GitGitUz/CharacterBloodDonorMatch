import Home from "./Pages/Home/Home";
import Donors from "./Pages/Donors/Donors";
import Transfusion from "./Pages/Transfusion/Transfusion";
import SearchResults from "./Pages/SearchResults/SearchResults";
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element = {<Home/>}></Route>
        <Route exact path="/SearchResults" element = {<SearchResults/>}></Route>
        <Route exact path="/SearchResults/:characterID" element = {<Donors/>}/>
        <Route exact path="/SearchResults/:characterID/:transfusion" element = {<Transfusion/>}/>
      </Routes>
    </div>
  );
}

export default App;
