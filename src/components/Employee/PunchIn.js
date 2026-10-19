import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import customMarkerIcon from "../../pin1.png";
import L from "leaflet";
import EmpValidate from "./EmpValidate";
import * as turf from '@turf/turf';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SET_POSITION = "SET_POSITION";

const reducer = (state, action) => {
    switch (action.type) {
        case SET_POSITION:
            return { ...state, position: action.payload };
        default:
            return state;
    }
};

export default function PunchIn(props) {
    const user = EmpValidate();

    const [punchDetails, setPunchDetails] = useState([]);
    // const [ifAlreadyPunchIn, setIfAlreadyPunchIn] = useState([]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/PunchDetails`)
            .then(response => setPunchDetails(response.data)

            )
            .catch(err => console.error(err));
    }, []);
    const today = new Date();
    const todayDay = today.getDate().toString().padStart(2, '0');
    const ifAlreadyPunchIn = punchDetails.find(e => e.empId === user._id && e.punchedInAtDate === todayDay)
    const ifAlreadyPunchOut = punchDetails.find(e => e.empId === user._id && e.punchedOutAt)


    const [isWithinArea, setIsWithinArea] = useState(false); // New state variable

    const [location, setLocation] = useState(null);
    const [mapOptions, setMapOptions] = useState(false);
    const [locatiopopup, setLocatioPopup] = useState(false);
    const [state, dispatch] = useReducer(reducer, {
        driverOrg: "N/A",
        position: [0, 0],
    });
    const navigate = useNavigate();
    const [routes, setRoutes] = useState([
        {
            "lat": 0,
            "long": 0
        },
        {
            "lat": 0,
            "long": 0
        },
        {
            "lat": 0,
            "long": 0
        },
        {
            "lat": 0,
            "long": 0
        },
        {
            "lat": 0,
            "long": 0
        }
    ])



    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/routes`)
            .then(response => setRoutes(response.data[0].stop))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                dispatch({
                    type: SET_POSITION,
                    payload: [position.coords.latitude, position.coords.longitude],
                });
                setLocatioPopup(false);
                setLocation(position.coords);

                if (routes) {
                    const polygonPoints = routes.map(stop => [stop.lat, stop.long]);
                    polygonPoints.push(polygonPoints[0]);
                    const point = turf.point([position.coords.latitude, position.coords.longitude]);
                    const polygon = turf.polygon([polygonPoints]);

                    if (turf.booleanPointInPolygon(point, polygon)) {
                        setMapOptions(true)
                        setIsWithinArea(true)

                        // alert("You are not within the allowed area to punch in.");
                        return;
                    }
                }

            },
            (error) => {
                console.error("Error getting user location:", error);
                setLocatioPopup(true);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }

        );
        return () => navigator.geolocation.clearWatch(watchId);

    }, []);

    const customIcon = L.icon({
        iconUrl: customMarkerIcon,
        iconSize: [60, 61],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    async function PunchIn(e) {
        e.preventDefault();
        // const today = new Date();
        // const todayDay = today.getDate().toString().padStart(2, '0');
        // const ifAlreadyPunchIn = punchDetails.find(e => e.empId === user._id && e.punchedInAtDate === todayDay)
        if (ifAlreadyPunchIn) {
            alert("Already Punched In")
        } else {


            try {

                if (routes && routes.length < 3) {
                    alert("Not enough stops to form a polygon.");
                    return;
                }

                // Build polygon points from stops
                const polygonPoints = routes.map(stop => [stop.lat, stop.long]);
                polygonPoints.push(polygonPoints[0]);
                const point = turf.point([location.latitude, location.longitude]);
                const polygon = turf.polygon([polygonPoints]);

                if (!turf.booleanPointInPolygon(point, polygon)) {
                    alert("You are not within the allowed area to punch in.");
                    return;
                }


                const res = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/punchIn`,
                    {
                        lat: location.latitude,
                        long: location.longitude,
                        empId: user._id,
                        empOrgId: user.empOrgId,
                        punchedInAt: Date.now(),
                        punchedInAtDate: todayDay

                    }
                );

                if (res.data.message === "added") {
                    // alert("Punched in successfully.");
                    const today = new Date(res.data.punchedInAt);
                    const todayHour = today.getHours().toString().padStart(2, '0');
                    const todayMin = today.getMinutes().toString().padStart(2, '0');
                    const todaySec = today.getSeconds().toString().padStart(2, '0');

                    const todayDay = today.getDate().toString().padStart(2, '0');
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const todayMonth = monthNames[today.getMonth()];
                    const todayYear = today.getFullYear();
                    toast.success(`Punch In Successful at ${todayHour}:${todayMin}:${todaySec} on ${todayDay} ${todayMonth}!`);
                    setTimeout(() => {

                        navigate("/emp/home")
                    }, 1500);

                } else {
                    alert("Already punched in.");
                }
            } catch (error) {
                alert("Failed to punch in. Please try again later.");
                console.log(error);
            }
        }
    }
    const PunchOut = () => {
        axios
            .put(
                `${process.env.REACT_APP_API_BASE_URL}/update-PunchIn/${user._id}`,
                {
                    punchedOutAt: Date.now(),
                }
            )
            .then((response) => {
                navigate("/emp/home");
            })
            .catch((error) => {
                console.error("Error ending trip:", error);
            });
    };

    function MapComponent() {
        const map = useMap();
        const polygonPoints = routes.filter((e => e.empOrgId === user.empOrgId)).map((stop) => [stop.lat, stop.long]);
        var polygon = L.polygon(polygonPoints, { color: 'blue' , weight: 7, opacity: 0.8,fill: false,}).addTo(map);
        map.setView(state.position, map.getZoom());
        return null;
    }
  
    
    
    
    return (
        <>
            <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white">
                <div className="flex items-center justify-between p-4">
                    <ToastContainer />
                    <div className="flex items-center space-x-2">
                        <Link to="/emp/Home" className="text-lg font-semibold">
                            <svg
                                className="w-6 h-6 mr-2 inline-block"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </Link>
                        <h1 className="text-lg font-semibold">Punch In</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            className="text-black py-2 px-4 bg-gray-200 rounded-full font-semibold text-sm"
                            type="button"
                            data-drawer-target="drawer-bottom-example"
                            data-drawer-show="drawer-bottom-example"
                            data-drawer-placement="bottom"
                            aria-controls="drawer-bottom-example"
                        >
                            MarkDigital
                        </button>
                    </div>
                </div>
            </div>

            <MapContainer
                center={state.position}
                zoom={17}
                style={{ height: "75vh", width: "100%" }}

            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={state.position} icon={customIcon}>
                    <Popup>Your Current Location</Popup>
                </Marker>
                <MapComponent />
            </MapContainer>

            <div className="w-full p-8 fixed " style={{ bottom: "0vh", zIndex: 1000 }}>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-gray-950 to-gray-800 p-5 rounded-t-2xl shadow-xl">
                    <div className="flex flex-col items-center h-2 w-16 bg-gray-300 rounded-full relative overflow-hidden m-auto mb-10">
                        <div className="absolute inset-y-0 left-0 bg-gray-400 w-2 rounded-full"></div>
                        <div className="absolute inset-y-0 right-0 bg-gray-400 w-2 rounded-full"></div>
                    </div>

                    <div className="flex flex-col items-center justify-between">

                        {!ifAlreadyPunchIn ? <>
                            <button
                                onClick={PunchIn}
                                className=" hover:opacity-90 relative bg-green-400 py-2 px-4 rounded-md flex items-center justify-center shadow-md mb-4 w-full overflow-hidden text-white"
                            >
                                <>
                                    <span className="font-semibold mr-2">Punch In</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="feather feather-arrow-right h-4 w-4"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            </button>

                        </> : <>
                            {!ifAlreadyPunchOut ? <>
                                <button
                                    onClick={PunchOut}
                                    className=" hover:opacity-90 relative bg-green-400 py-2 px-4 rounded-md flex items-center justify-center shadow-md mb-4 w-full overflow-hidden text-white"
                                >
                                    <>
                                        <span className="font-semibold mr-2">Punch Out</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="feather feather-arrow-right h-4 w-4"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </>
                                </button>
                            </> :
                                <>
                                    <button
                                        className=" disabled relative bg-blue-400 py-2 px-4 rounded-md flex items-center justify-center shadow-md mb-4 w-full overflow-hidden text-white"
                                    >
                                        <>
                                            <Link to={"/emp/attendanceHistory"} className="font-semibold mr-2">Attendance Marked for the Day</Link>

                                        </>
                                    </button>
                                </>}

                        </>}
                    </div>
                </div>

                {locatiopopup && (
                    <>
                        <div id="overlay" className="fixed inset-0 bg-black bg-opacity-50"></div>
                        <div className="fixed inset-0 flex items-center justify-center">
                            <div className="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800" role="alert">
                                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <div className="ps-4 text-sm font-normal">
                                    Please turn on your Location.
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {!state.position && locatiopopup && (
                    <>
                        <div id="overlay" className="fixed inset-0 bg-black bg-opacity-50"></div>
                        <div className="fixed inset-0 flex items-center justify-center">
                            <div className="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800" role="alert">
                                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <div className="ps-4 text-sm font-normal">
                                    Fetching Your Current Location......
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
