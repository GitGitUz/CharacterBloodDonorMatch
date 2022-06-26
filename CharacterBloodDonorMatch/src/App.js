import Home from "./Pages/Home/Home";
import Donors from "./Pages/Donors/Donors";
import Transfusion from "./Pages/Transfusion/Transfusion";
import SearchResults from "./Pages/SearchResults/SearchResults";
import Success from "./Pages/Success/Success";
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element = {<Home/>}/>
        <Route exact path="/SearchResults" element = {<SearchResults/>}/>
        <Route exact path="/SearchResults/Donors" element = {<Donors/>}/>
        <Route exact path="/SearchResults/Donors/Transfusion" element = {<Transfusion/>}/>
        <Route exact path="/SearchResults/Donors/Transfusion/Success" element = {<Success/>}/>
      </Routes>
    </div>
  );
}

export default App;
