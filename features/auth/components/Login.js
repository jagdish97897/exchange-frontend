import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkUserAsync, loginUserAsync , selectError, selectLoggedInUser } from '../authSlice';
import { View, TextInput, TouchableOpacity, Text, Button } from 'react-native';
import { Formik } from 'formik';

const Login = ({navigation}) => {
  
  const error = useSelector(selectError);
  const user = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  useEffect(() => { 
    dispatch(checkUserAsync())
  }, []);
  useEffect(() => {
    if (user) {
      navigation.navigate('FlowSelect');
    }
  }, [user, navigation]);

  
  

  return (
    <>
    {/* {user && navigation.navigate('FlowSelect')} */}
    <Formik
     initialValues={{ email: '' , password: '' }}
     onSubmit={(values) => {
       dispatch(loginUserAsync(values))
      //  console.log(values);
      
      }}
   >
     {({ handleChange, handleBlur, handleSubmit, values }) => (
       <View className="mt-[50%]">
        <Text>Hello</Text>
         <TextInput className="m-[10%] bg-gray-200 text-black-200"
           onChangeText={handleChange('email')}
           onBlur={handleBlur('email')}
           value={values.email}
           placeholder='Enter your email'
         />
         <TextInput className="m-[10%] bg-gray-200 text-black-200"
           onChangeText={handleChange('password')}
           onBlur={handleBlur('password')}
           value={values.password}
           placeholder='Enter your password'
         />
         <Button onPress={handleSubmit} title="Submit" />
       </View>
     )}
   </Formik>
    </>
  );
};

export default Login;








































// import { useSelector, useDispatch } from 'react-redux';
// import { Link, Navigate } from 'react-router-dom';
// import { loginUserAsync , selectError, selectLoggedInUser } from '../authSlice';
// import { useForm } from 'react-hook-form';

// export default function Login() {
  
//   const dispatch = useDispatch();
//   const error = useSelector(selectError);
//   const { register, handleSubmit, formState: {errors} } = useForm();
//   const user = useSelector(selectLoggedInUser);
  
//   return (
//       <>
//       {user && <Navigate to='/' replace={true}></Navigate>}
//       <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <img
//             className="mx-auto h-10 w-auto"
//             src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//             alt="Your Company"
//           />
//           <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
//             Log in to your account
//           </h2>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form noValidate
//           onSubmit={handleSubmit((data)=>{
//             dispatch(
//               loginUserAsync({email: data.email, password: data.password })
//               );
//           })}
//            className="space-y-6" action="#" method="POST">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
//                 Email address
//               </label>
//               <div className="mt-2">
//               <input
//                   id="email"
//                   {...register("email",{required: "email is required" ,pattern: {value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
//                   message: 'email is not valid'},
//                 })}
//                   type="email"
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//                 {errors.email && (<p className='text-red-500'>{errors.email.message}</p>)}
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
//                   Password
//                 </label>
//                 <div className="text-sm">
//                   <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
//                     Forgot password?
//                   </Link>
//                 </div>
//               </div>
//               <div className="mt-2">
//               <input
//                   id="password"
//                   {...register("password",{required: "password is required",
//               })}
//                   type="password"
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//                 {errors.password && (<p className='text-red-500'>{errors.password.message}</p>)}
//               </div>
//               {error && (<p className='text-red-500'>{error || error.message}</p>)}
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Log in
//               </button>
//             </div>
//           </form>

//           <p className="mt-10 text-center text-sm text-gray-500">
//             Not a member?{' '}
//             <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
//               Create an account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }


















































// import { useState } from "react";
// import { Timesheet } from "../../timesheet/Timesheet";

// export default function Signup() {
//   // const [formdata, setFormdata] = useState({
//   //   email: "",
//   //   password: "",
//   // });
//   const [form, setForm] = useState({})
//   const [isloggedin, setisloggedin] = useState(false)

//   const handleDetail =(e)=>{
//     setForm({...form , [e.target.name] : e.target.value})
//   }
//   const handleSubmit = async(e)=>{
//     e.preventDefault()
//     try {
//       const response = await fetch('http://192.168.1.5:8005/api/v1/users/login',{
//       method: 'POST',
//       body: JSON.stringify(form),
//       headers:{'content-type': 'application/json'}
//     })
//     if (response.ok) {
//       setisloggedin(true)
//         } else {
//           console.log("Error saving user sheet");
//         }
//   }
//     catch (error) {
//         console.log("Error submitting form:", error);
//       }
    
//   }

  

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const formData = new FormData();
//   //   formData.append("email", formdata.email);
//   //   formData.append("password", formdata.password);

//   //   try {
//   //     const response = await fetch("http://192.168.1.5:8005/api/v1/users/login", {
//   //       method: "POST",
//   //       body: formData,
//   //     });

    
//   //     if (response.ok) {
//   //       // <Timesheet></Timesheet>
//   //       const data = await response.json();
//   //       console.log(data);
//   //     } else {
//   //       console.log("Error Logging user");
//   //     }
//   //   } catch (error) {
//   //     console.log("Error submitting form:", error);
//   //   }
//   // };

//   return (
//     <div>
//       {isloggedin ? <Timesheet></Timesheet> : (<div className="flex flex-col items-center bg-[grey] shadow-lg h-[100vh]">
//       <h1 className="text-2xl">Login</h1>
//       <form className="flex flex-col items-center gap-2 mt-6" onSubmit={handleSubmit}>
      
//       <label for="email">Email</label>
//       <input type="email" name="email" id="email" onChange={handleDetail} />
      
//       <label for="password">Password</label>
//       <input type="password" name="password" id="password" onChange={handleDetail}/>

//       <input className="bg-[red] text-[white] mt-2 p-1" type="submit"/>
//       </form>
//      </div>)}
//     </div>
//     // <div className="w-[100%] bg-[green]  h-[100vh] mx-auto flex flex-col items-center">
//     //   <h1 className="text-2xl my-3 py-3">Login User</h1>
//     //   <div className="">
//     //     <form onSubmit={handleSubmit} className="mx-auto flex flex-col">
//     //       <label htmlFor="email">E-mail</label>
//     //       <input type="email" id="email" name="email" onChange={handleForm} />
//     //       <label htmlFor="password">Password</label>
//     //       <input type="password" id="password" name="password" onChange={handleForm} />
//     //       <input type="submit"  className="bg-[red] text-[white]  m-1 p-1"/>
//     //     </form>
//     //   </div>
//     // </div>
//   );
// }
