import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../provider/AuthProvider";
import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
// import { Helmet } from "react-helmet";
import { AuthContext } from "../Providers/AuthProvider";

const Register = () => {
  const { createNewUser, setUser, updateUserProfile } = useContext(AuthContext);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");
    if (name.length < 5) {
      toast.error("Follow the requerment!", {
        position: "top-center",
        autoClose: 2000,
      });
      setError({ ...error, name: "name should be more then 5 character" });
      return;
    }
    const email = form.get("email");
    const photo = form.get("photo");
    const password = form.get("password");
    const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.{6,})/;
    if (!passwordValidation.test(password)) {
      toast.error("Follow the requerment!", {
        position: "top-center",
        autoClose: 2000,
      });
      setError({
        ...error,
        password:
          "Password must be at least 6 characters long, contain at least one uppercase letter, and one lowercase letter.",
      });
      return;
    }
    createNewUser(email, password)
      .then((result) => {
        const user = result.user;
        setUser(user);
        updateUserProfile({ displayName: name, photoURL: photo })
          .then(() => {
            toast.success(`Registration Successful!`, {
              position: "top-center",
              autoClose: 2000,
            });
            navigate("/profile");
          })
          .catch((err) => {
            toast.error("Enter valid email and password!", {
              position: "top-center",
              autoClose: 2000,
            });
            setError({ ...error, err });
          });
      })
      .catch((err) => {
        setError({ ...error, err });
      });
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  return (
    <div className="min-h-screen flex bg-violet-100 text-black justify-center items-center mb-12">
      {/* <Helmet>
        <title>{`Register | Career Consult`}</title>
        <meta name="description" content="Description of your page" />
      </Helmet> */}
      <div className="card bg-violet-300 mt-6 w-full max-w-lg shrink-0  p-10 border-2 border-gray-200 solid rounded-lg">
        <h2 className="text-2xl font-semibold text-center">
          Register your account
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Name</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="name"
              className="input input-bordered"
              required
            />
          </div>
          {error.name && (
            <label className="label text-xs text-red-500">{error.name}</label>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Photo URL</span>
            </label>
            <input
              type="text"
              name="photo"
              placeholder="photo-url"
              className="input input-bordered"
              required
            />
          </div>
          {/* email input  */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Email</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="email"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control relative">
            <label className="label">
              <span className="label-text text-black">Password</span>
            </label>
            <input
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="password"
              className="input input-bordered"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute  top-[3.25rem] right-4 text-gray-500"
              style={{ border: "none", background: "transparent" }}
            >
              {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {error.password && (
            <label className="label text-xs text-red-500">
              {error.password}
            </label>
          )}

          <div className="form-control mt-6">
            <button className="btn bg-[#faa2a0] hover:bg-[#f99796] text-white rounded-none">
              Register
            </button>
          </div>
        </form>
        <p className="text-center font-semibold">
          Allready Have An Account ?{" "}
          <Link className="text-red-500" to="/login">
            Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
