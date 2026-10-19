import React from "react";
import { Link, useRoutes, useLocation, Navigate, useNavigate } from "react-router-dom";


const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
 

  return (
    <>
     
      <div
        className={`fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 sm:w-1/4 ${
          location.pathname === "/student/home"
            ? "bg-gray-100 text-red-500"
            : "text-gray-600"
        }`}
      >
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
          <Link
            to="/emp/attendanceHistory"
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group ${
              location.pathname === "/student/home"
                ? "bg-gray-100 text-red-500"
                : "text-gray-600"
              }`}
              >
            <svg
            className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600"
            
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 9H21M9 15L11 17L15 13M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

            <span className="text-sm text-gray-500 group-hover:text-blue-600">
               History
            </span>
          </Link>

          <Link
            to="/emp/PunchIn"
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group ${
              location.pathname === "/student/ViewLocation/:senderId"
                ? "-z-50"
                : ""
            }`}
          >
            <svg 
              className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600"
            
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 11V6.36154C12 5.85177 12.1003 5.36242 12.2845 4.90769M22 11V7.81538M14.2222 2.73446C15.0167 2.27055 15.9721 2 17 2C19.2795 2 21.2027 3.33062 21.8046 5.15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15 12V9.82353M19 12V6.85294C19 5.82959 18.1046 5 17 5C15.8954 5 15 5.82959 15 6.85294V7.64706" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 17.01L8.01 16.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 5H3.6C3.26863 5 3 5.26863 3 5.6V20.4C3 20.7314 3.26863 21 3.6 21H12.4C12.7314 21 13 20.7314 13 20.4V16" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Punch
            </span>
          </Link>
          <button
            onClick={() => {localStorage.clear(); navigate("../../login")}}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group ${
              location.pathname === "/org/Logout"
                ? "bg-gray-100 text-gray-800"
                : "text-gray-600"
            }`}
          >
            <svg

className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600"
             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 16.5V19C15 20.1046 14.1046 21 13 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3H13C14.1046 3 15 3.89543 15 5V8.0625M11 12H21M21 12L18.5 9.5M21 12L18.5 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;