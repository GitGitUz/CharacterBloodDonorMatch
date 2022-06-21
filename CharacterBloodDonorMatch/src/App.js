import Home from "./Pages/Home/Home";
import Donors from "./Pages/Donors/Donors";
import Transfusion from "./Pages/Transfusion/Transfusion";
import SearchResults from "./Pages/SearchResults/SearchResults";
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element = {<Home/>}/>
        <Route exact path="/SearchResults" element = {<SearchResults/>}/>
        <Route exact path="/Donors" element = {<Donors/>}/>
        <Route exact path="/Transfusion" element = {<Transfusion/>}/>
      </Routes>
    </div>
  );
}

export default App;
