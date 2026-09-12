import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Interview from "./features/interview/pages/Interview";
import LandingPage from "./features/interview/pages/LandingPage";       
import Onboarding from "./features/interview/pages/Onboarding";
import Dashboard from "./features/interview/pages/Dashboard";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/onboarding",
        element: <Protected><Onboarding /></Protected>
    },
    {
        path: "/dashboard",
        element: <Protected><Dashboard /></Protected>
    }
])