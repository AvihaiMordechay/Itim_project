// import './LandingPage.css';
// import { UserSearchForm } from './UserSearchForm';
// import { UserMikvesList } from './UserMikvesList';
// import Map from './Map';
// import { myAuth } from '../Firebase';
// import React, { useEffect, useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom"; // Import useNavigate hook

// const LandingPage = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false); // Add pop-up state
//     const navigate = useNavigate();

//     const signIn = async () => {
//         try {
//             await signInWithEmailAndPassword(myAuth, email, password);
//             navigate('/Admin');
//             setIsAdminPopupOpen(false); // Close the pop-up after successful login
//         }
//         catch (error) {
//             //TODO: add popup; login failed
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             console.error(errorCode, errorMessage);
//         }
//     };

//     return (
//         <div className="landing-page">
//             <div className="header">
//                 <h1>חיפוש מקוואות נשים</h1>
//                 <div className="admin-icon" onClick={() => setIsAdminPopupOpen(true)}>
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
//                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-6 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z" />
//                     </svg>
//                 </div>
//             </div>

//             {isAdminPopupOpen && ( // Render the pop-up when isAdminPopupOpen is true
//                 <div className="admin-popup">
//                     <div className="admin-popup-content">
//                         <div className="admin-popup-header">
//                             <h2>Admin Login</h2>
//                             <button className="close-button" onClick={() => setIsAdminPopupOpen(false)}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
//                                     <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
//                                 </svg>
//                             </button>
//                         </div>
//                         <div className="admin-popup-body">
//                             <input className="admin-input" id="email_login" placeholder="Email..." onChange={(e) => setEmail(e.target.value)}></input>
//                             <input className="admin-input" id="password_login" type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)}></input>
//                             <button className="admin-button" id="button_login" onClick={signIn}>SIGN IN</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="main-content">
//                 <UserSearchForm />
//                 <div className="content">
//                     <Map />
//                     <UserMikvesList />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export { LandingPage };