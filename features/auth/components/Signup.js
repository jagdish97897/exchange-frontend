import { useState } from "react";
import { Timesheet } from "../../timesheet/Timesheet";

export default function Signup() {
  const [formdata, setFormdata] = useState({
    fullName: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const handleForm = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setFormdata({ ...formdata, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", formdata.fullName);
    formData.append("email", formdata.email);
    formData.append("password", formdata.password);
    formData.append("profileImage", formdata.profileImage);

    try {
      const response = await fetch("http://localhost:8005/api/v1/users/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        <Timesheet></Timesheet>
        const data = await response.json();
        console.log(data);
      } else {
        console.log("Error registering user");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  return (
    <div className="w-[100%] bg-[green]  h-[100vh] mx-auto flex flex-col items-center">
      <h1 className="text-2xl my-3 py-3">Register User</h1>
      <div className="">
        <form onSubmit={handleSubmit} className="mx-auto flex flex-col">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="fullName" onChange={handleForm} />
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" onChange={handleForm} />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" onChange={handleForm} />
          <label htmlFor="profile-pic">Profile Pic</label>
          <input type="file" id="profile-pic" name="profileImage" onChange={handleImage} />
          <input type="submit" className="bg-[red] text-[white]  m-1 p-1" />
        </form>
      </div>
    </div>
  );
}
