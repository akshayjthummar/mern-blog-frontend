import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useContext, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type === "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    let form = new FormData(formElement);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    const { fullname, email, password } = formData;
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be 3 letters long");
      }
    }

    if (!email.length) {
      return toast.error("Enter email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be 6-20 characters, including at least one numeric digit, one lowercase letter, and one uppercase letter."
      );
    }
    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    await authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";
        let formData = {
          access_token: user.accessToken,
        };
        userAuthThroughServer(serverRoute, formData);
      })
      .catch((error) => {
        toast.error("trouble authrentication through google");
        return console.log(error);
      });
  };
  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <Toaster />
      <section className="h-cover flex items-center justify-center">
        <form id={"formElement"} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome back" : "Join us today"}
          </h1>
          {type !== "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="full name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="email"
            icon="fi-rr-at"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="password"
            icon="fi-rr-key"
          />

          <button
            onClick={handleSubmit}
            type="submit"
            className="btn-dark center mt-14 "
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold ">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button
            onClick={handleGoogleAuth}
            className="btn-dark flex items-center justify-center gap-4 center w-[90%]"
          >
            <img src={googleIcon} alt="Google Icon" className="w-5" />
            continue with google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don&apos;t have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
