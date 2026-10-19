import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import EmpHome from './components/Employee/EmpHome';
import PunchIn from "./components/Employee/PunchIn";
import OrgHome from "./components/Organization/OrgHome";
import StudentSidebar from "./components/Employee/StudentSidebar";
import Home from "./components/Organization/Home";
import Sidebar from "./components/Organization/Sidebar";
import OrgSignup from "./components/Organization/OrgSignup";
import AddStops from "./components/Organization/AddStop";
import AddEmployee from "./components/Organization/AddEmployee";
import AddRoute from "./components/Organization/AddRoute";
import Login from "./components/Organization/Login";
import History from "./components/Employee/History";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact element={
            <>
              <Login></Login>
            </>
          } />
          <Route path='/login' exact element={
            <>
              <Login></Login>
            </>
          } />

          <Route path='/emp/home' exact element={
            <>
              <div className="flex">
                <div className="">
                  <StudentSidebar></StudentSidebar>
                </div>
                <div className="flex-grow">
                  <EmpHome></EmpHome>
                </div>
              </div>
            </>
          } />
          <Route path='/emp/PunchIn' exact element={
            <>
              <div className="flex">
                <div className="">
                  <StudentSidebar></StudentSidebar>
                </div>
                <div className="flex-grow">
                  <PunchIn />
                </div>
              </div>
            </>
          } />
          <Route path='/emp/attendanceHistory' exact element={
            <>
              <div className="flex">
                <div className="">
                  <StudentSidebar></StudentSidebar>
                </div>
                <div className="flex-grow">
                  <History></History>
                </div>
              </div>
            </>
          } />


          <Route path='/org/signup' exact element={<>
            <div className="flex">

              <div className="flex-grow"> {/* AddStudent takes remaining space */}
                <OrgSignup />
              </div>
            </div>
          </>}
          />

          <Route
            path='/org/home'
            exact
            element={
              <div className="flex">
                <div className="w-64"> {/* Fixed width for Sidebar */}
                  <Sidebar></Sidebar>
                </div>
                <div className="flex-1"> {/* Home component takes remaining space */}
                  <Home />
                </div>
              </div>
            }
          />


          <Route path='/org/AddStop' exact element={
            <>
              <div className="flex">
                <div className="w-64"> {/* Fixed width for Sidebar */}
                  <Sidebar />
                </div>
                <div className="flex-grow"> {/* AddStops takes remaining space */}
                  <AddStops />
                </div>
              </div>
            </>
          } />

          <Route path='/org/AddEmployee' exact element={
            <>
              <div className="flex">
                <div className="w-64"> {/* Fixed width for Sidebar */}
                  <Sidebar />
                </div>
                <div className="flex-grow"> {/* AddDriver takes remaining space */}
                  <AddEmployee />
                </div>
              </div>
            </>
          } />

          <Route path='/org/AddRoute/*' exact element={
            <>
              <div className="flex">
                <div className="w-64"> {/* Fixed width for Sidebar */}
                  <Sidebar />
                </div>
                <div className="flex-grow"> {/* AddRoute takes remaining space */}
                  <AddRoute />
                </div>
              </div>
            </>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
