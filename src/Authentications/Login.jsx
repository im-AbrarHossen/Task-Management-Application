import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
//import Navbar from "../../components/Navbar";
//import Footer from "../../components/Footer";
import { AuthContext } from "../providers/AuthProvider"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const { userLogin, setUser, signInWithGoogle } = useContext(AuthContext);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const location = useLocation();

    const loginGoogle = () => {
        signInWithGoogle()
            .then((result) => {
                const user = result.user;
                setUser(user);
                navigate(location?.state ? location.state : "/");
                toast.success("Logged in with Google!", { position: "top-center" });
            })
            .catch((error) => {
                toast.error(
                    "Google Sign-In failed. Please try again.",
                    { position: "top-center" }
                );
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        userLogin(email, password)
            .then((result) => {
                const user = result.user;
                setUser(user);
                Swal.fire({
                    title: 'Success!',
                    text: 'Successfully Logged in',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                })
                    .then(() => {
                        navigate(location?.state ? location.state : "/");
                    });
            })
            .catch((error) => {
                toast.error(
                    error.code === "auth/user-not-found"
                        ? "User not found. Please check your credentials."
                        : "Something went wrong. Please try again.",
                    { position: "top-center" }
                );
            });
    }

    return (
        <div>
            <nav className="bg-[#026C84] py-2 w-full fixed top-0 left-0 z-50">
                {/* <Navbar></Navbar> */}
            </nav>
            <main className="py-10 grid place-items-center mt-[100px]">
                <ToastContainer></ToastContainer>
                <div className="bg-base-100 shrink-0 shadow-2xl rounded-xl border">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-5">
                            <h1 className="text-center text-[35px] font-[600] text-[#403F3F]">Login your account</h1>
                        </div>
                        <hr />
                        <div className="form-control mt-5">
                            <button
                                type="button"
                                className="btn bg-blue-500 text-white flex items-center justify-center"
                                onClick={loginGoogle}
                            >
                                <div className="bg-white p-1">
                                    <FcGoogle></FcGoogle>
                                </div>
                                Sign in with Google
                            </button>
                        </div>

                        <div className="text-center text-black mt-5">
                            <p>OR</p>
                        </div>
                        <div className="form-control mt-5">
                            <label className="label">
                                <span className="label-text text-[20px] font-[600] text-[#403F3F]">Email address</span>
                            </label>
                            <input name="email" type="email" placeholder="Enter your email address" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-[20px] font-[600] text-[#403F3F]">Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="input input-bordered w-full"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? (
                                        <FaEyeSlash></FaEyeSlash>
                                    ) : (
                                        <FaEye></FaEye>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn bg-[#403F3F] text-white">Login</button>
                        </div>
                        <div className="mt-5">
                            <p className="text-center text-[16px] font-[600] text-[#706F6F]">Dont't Have An Account ? <Link to="/auth/register" className="text-[#026C84]">Register</Link> </p>
                        </div>
                    </form>
                </div>
            </main>
            <footer>
                {/* <Footer></Footer> */}
            </footer>
        </div>
    );
};

export default Login;