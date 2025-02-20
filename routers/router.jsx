import { createBrowserRouter } from "react-router";
import Home from "../src/pages/Home";
import Login from "../src/Authentications/Login";
import Register from "../src/Authentications/Register";
import ErrorPage from "../src/pages/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home></Home>,
    },
    {
        path: "/auth/login",
        element: <Login></Login>,
    },
    {
        path: "/auth/register",
        element: <Register></Register>,
    },
    {
        path: "*",
        element: <ErrorPage></ErrorPage>,
    },
]);

export default router;