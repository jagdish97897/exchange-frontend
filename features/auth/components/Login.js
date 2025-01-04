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
