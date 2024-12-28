import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   selectCount,
// } from './counterSlice';

export function Timesheet() {
  // const count = useSelector(selectCount);
  // const dispatch = useDispatch();
  const [form, setForm] = useState({})
  const [employeefilled, setEmployeefilled] = useState(false);
  const [rate, setRate] = useState()
  const [managerForm, setManagerForm] = useState({});
  const [hasManagerRated, setHasManagerRated] = useState(false);
  const handleDetail = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://192.168.1.6:8005/api/v1/timesheet/register', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'content-type': 'application/json' }
      })
      if (response.ok) {
        setEmployeefilled(true);
      } else {
        console.log("Error saving user sheet");
      }
    }
    catch (error) {
      console.log("Error submitting form:", error);
    }

    // const response = await fetch("http://192.168.1.6:8005/api/v1/timesheetregister", {
    //     method: "POST",
    //     body: form,
    // try {
    //   const response = await fetch("http://192.168.1.6:8005/api/v1/timesheetregister", {
    //     method: "POST",
    //     body: form,
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log(data);
    //   } else {
    //     console.log("Error registering user");
    //   }
    // } catch (error) {
    //   console.log("Error submitting form:", error);
    // }

  }

  const handleManager = (e) => {
    setManagerForm({ ...managerForm, [e.target.name]: e.target.value })
  }

  const handlerateChange = (e) => {
    setManagerForm({ ...managerForm, [e.target.name]: e.target.value })
  }
  const handleSubmitManager = async (e) => {
    e.preventDefault();
    // console.log(managerForm)
    //   try {
    //     const response = await fetch('http://192.168.1.6:8005/api/v1/manager/rate',{
    //     method: 'POST',
    //     body: JSON.stringify(managerForm),
    //     headers:{'content-type': 'application/json'}
    //   })
    //   if (response.ok) {
    setEmployeefilled(false);
    //       } else {
    //         console.log("Error rating employee");
    //       }
    // }
    //   catch (error) {
    //       console.log("Error submitting form:", error);
    //     }
    // setHasManagerRated(true);
  }

  return (
    <div>
      {employeefilled ? (
        <div className="flex flex-col items-center bg-[grey] shadow-lg h-[100vh]">
          <h1 className="text-2xl">Manager Rate</h1>
          <form className="flex flex-col items-center gap-2 mt-6" onSubmit={handleSubmitManager}>
            <label for="ManagerEmail">ManagerEmail</label>
            <input type="email" name="managerEmail" id="ManagerEmail" onChange={handleManager} />
            <label for="EmployeeEmail">EmployeeEmail</label>
            <input type="email" name="employeeEmail" id="EmployeeEmail" onChange={handleManager} />
            <h1>Rate</h1>
            <div className='flex gap-2'>
              <label for="1">1</label>
              <input type="radio" id="1" name="rate" value="1" onChange={handlerateChange} />
              <label for="2">2</label>
              <input type="radio" id="2" name="rate" value="2" onChange={handlerateChange} />
              <label for="3">3</label>
              <input type="radio" id="3" name="rate" value="3" onChange={handlerateChange} />
              <label for="4">4</label>
              <input type="radio" id="4" name="rate" value="4" onChange={handlerateChange} />
              <label for="5">5</label>
              <input type="radio" id="5" name="rate" value="5" onChange={handlerateChange} />
            </div>

            <input className="bg-[red] text-[white] mt-2 p-1" type="submit" />
          </form>
        </div>
      )

        : (<div className="flex flex-col items-center bg-[grey] shadow-lg h-[100vh]">
          <h1 className="text-2xl">Timesheet</h1>
          <form className="flex flex-col items-center gap-2 mt-6" onSubmit={handleSubmit}>
            <label for="name">Name</label>
            <input type="text" name="name" id="name" onChange={handleDetail} />
            <label for="email">Email</label>
            <input type="email" name="email" id="email" onChange={handleDetail} />

            <label for="ManagerName">ManagerName</label>
            <input type="text" name="managerName" id="ManagerName" onChange={handleDetail} />
            <label for="ManagerEmail">ManagerEmail</label>
            <input type="email" name="managerEmail" id="ManagerEmail" onChange={handleDetail} />
            <input className="bg-[red] text-[white] mt-2 p-1" type="submit" />
          </form>
        </div>)}
    </div>
  );
}
