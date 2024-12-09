import AsyncStorage from '@react-native-async-storage/async-storage';

export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://192.168.1.2:8005/api/v1/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    //TODO: on sever it will only return some info of user (not password)
    resolve({ data });
  });
}

// export function loginUser(loginInfo) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await fetch("http://192.168.1.2:8000/api/v1/users/login", {
//         method: "POST",
//         body: JSON.stringify(loginInfo),
//         headers: { "content-type": "application/json" },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);

//         await AsyncStorage.setItem('token', JSON.stringify(data.data.refreshToken));
//         resolve({ data });
//       } else {
//         const error = await response.text();
//         reject(error);
//       }
//     } catch (error) {
//       reject(error);
//     }
//     //TODO: on sever it will only return some info of user (not password)
//   });
// }

export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://192.168.1.2:8000/api/v1/users/login", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data);

        await AsyncStorage.setItem('token', data.data.accessToken);
        const token = await AsyncStorage.getItem('token');
        // console.log(token);
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
    //TODO: on sever it will only return some info of user (not password)
  });
}

export function checkUser() {
  return new Promise(async (resolve, reject) => {
    try {
      const tokenC = await AsyncStorage.getItem('token');
      // console.log(`Bearer ${tokenC}`);
      const response = await fetch("http://192.168.1.2:8000/api/v1/users/current-user", {
        method: "GET",
        headers: {
          authorization: `Bearer ${tokenC}`
        }

        //   // Accept: "application/json",
        //   "content-type": "application/json" },
        // credentials: "include"
      }
      );
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
    //TODO: on sever it will only return some info of user (not password)
  });
}

export function fetchUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("https://priest-span-them-phd.trycloudflare.com/v1/user", {
        method: "GET",
        // body: JSON.stringify(loginInfo),
        // headers: { "content-type": "application/json" },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE3MTMzMzM5OTYsImV4cCI6MTcxMzc2NTk5Nn0.zApn1S6KkpNRWy-yiQBu1QbiVtsQAh6EA9RF-zZKUn4`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data);

        // localStorage.setItem('token', JSON.stringify(data.data.refreshToken));
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
    //TODO: on sever it will only return some info of user (not password)
  });
}

// export function checkUser() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       console.log(`Bearer ${JSON.parse(AsyncStorage.getItem('token'))}`);
//       const response = await fetch("http://192.168.1.2:8000/api/v1/users/current-user", {
//         method: "GET",
//         headers: {
//           authorization: `Bearer ${JSON.parse(AsyncStorage.getItem('token'))}`
//         }

//         //   // Accept: "application/json",
//         //   "content-type": "application/json" },
//         // credentials: "include"
//       }
//       );
//       if (response.ok) {
//         const data = await response.json();
//         resolve({ data });
//       } else {
//         const error = await response.text();
//         reject(error);
//       }
//     } catch (error) {
//       reject(error);
//     }
//     //TODO: on sever it will only return some info of user (not password)
//   });
// }

export function signOut(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://192.168.1.2:8005/api/v1/users/logout", {
        method: "POST",
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      if (response.ok) {
        resolve({ data: 'success' });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
    //TODO: on sever it will only return some info of user (not password)
  });
}

export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/auth/reset-password-request", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
    //TODO: on sever it will only return some info of user (not password)
  });
}

export function resetPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://192.168.1.2:8005/api/v1/users/change-password", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
    //TODO: on sever it will only return some info of user (not password)
  });
}