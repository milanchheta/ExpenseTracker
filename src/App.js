//Entry file for frontend

//import statements
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Expenses from "./components/Expenses/Expenses";
import Sheets from "./components/Sheets/Sheets";
import Analyse from "./components/Analyse/Analyse";
import "./App.css";

//Entry funtion for frontend
function App() {
  return (
    <div className="App h-100">
      {/* All the routes and corresponding components */}
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/register" component={Register} />
          <Route path="/sheets" component={Sheets} />
          <Route path="/expenses" component={Expenses} />
          <Route path="/analyse" component={Analyse} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;
