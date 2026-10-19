import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmpValidate from './EmpValidate';

export default function History() {
    const user = EmpValidate();
    const [punchDetails, setPunchDetails] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/PunchDetails`)
            .then(response => setPunchDetails(response.data))
            .catch(err => console.error(err));
    }, []);

    const getDuration = (start, end) => {
        const duration = new Date(end) - new Date(start);

        if (isNaN(duration)) return "Ongoing";

        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((duration % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }

    function formatTimeFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }

    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
    const daysInMonth = getDaysInMonth(selectedMonth, currentYear);
    const isCurrentMonth = selectedMonth === currentMonth;

    const daysArray = [...Array(daysInMonth).keys()].map(day => day + 1).reverse();

    return (
        <>
            <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white">
                <div className="flex items-center justify-between p-4">
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
                        <h1 className="text-lg font-semibold">Attendance Record</h1>
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

            <div className="flex items-center justify-center my-4">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="mr-4 p-2 border border-gray-300 rounded"
                >
                    {[...Array(currentMonth).keys()].map(month => (
                        <option key={month + 1} value={month + 1}>{new Date(0, month).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                </select>
                {/* <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown button <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                </svg>
                </button>

                <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        {[...Array(currentMonth).keys()].map(month => (
                            <li>
                                <button key={month + 1} value={month + 1} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{new Date(0, month).toLocaleString('default', { month: 'long' })}</button>
                            </li>
                        ))}

                    </ul>
                </div> */}


            </div>

            <div className="p-4 mb-12">
                {daysArray.map(dayNumber => {
                    if (isCurrentMonth && dayNumber > currentDay) return null; // Skip future days in the current month

                    const punchRecord = punchDetails.find(e =>
                        e.empId === user._id &&
                        new Date(e.punchedInAt).getMonth() + 1 === selectedMonth &&
                        new Date(e.punchedInAt).getDate() === dayNumber
                    );
                    const bgColor = !punchRecord ? 'bg-red-300' : punchRecord.punchedInAt && !punchRecord.punchedOutAt ? 'bg-yellow-300' : 'bg-green-300';

                    return (
                        <div key={dayNumber} className={`w-full max-w-md p-4 mb-4 border border-gray-200 rounded-lg shadow ${bgColor} darkk:bg-gray-800`}>
                            <div className="flow-root">
                                <ul role="list" className="divide-y divide-gray-200 darkk:divide-gray-700">
                                    <li className="py-3 sm:py-4">
                                        <div className="flex items-center">
                                            <div className="flex-1 min-w-0 ms-4">
                                                <p className="text-sm texce font-medium text-gray-900 truncate darkk:text-white bg-white p-0.5 px-1 shadow-sm shadow-slate-600 mb-1  rounded-lg w-fit">
                                                    {dayNumber} {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {currentYear}
                                                </p>
                                                <p className="text-sm text-gray-800 truncate darkk:text-gray-400">
                                                    Punch In: {punchRecord ? formatTimeFromTimestamp(punchRecord.punchedInAt) : 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-800 truncate darkk:text-gray-400">
                                                    Punch Out: {punchRecord && punchRecord.punchedOutAt ? formatTimeFromTimestamp(punchRecord.punchedOutAt) : 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-800 truncate darkk:text-gray-400">
                                                    Duration: {punchRecord && punchRecord.punchedOutAt ? getDuration(punchRecord.punchedInAt, punchRecord.punchedOutAt) : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="">
                                                <p className="text-sm font-medium text-gray-900 truncate darkk:text-white">
                                                    Status
                                                </p>
                                                <p className="text-sm text-gray-800 truncate darkk:text-gray-400 ">
                                                    {punchRecord ? (punchRecord.punchedInAt ? 'Present' : 'Absent') : 'Absent'}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
