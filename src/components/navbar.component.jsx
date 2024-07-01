import { useContext, useEffect, useState } from "react";
import logoDark from "../imgs/logo-dark.png";
import logoLight from "../imgs/logo-light.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ThemeContext, UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";
import axios from "axios";
import { storeInSession } from "../common/session";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  const { theme, setTheme } = useContext(ThemeContext);

  const {
    userAuth,
    userAuth: { access_token, profile_img, new_notification_available },
    setUserAuth,
  } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      axios
        .get(`${import.meta.env.VITE_SERVER_DOMAIN}/new-notification`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch((err) => console.log(err));
    }
  }, [access_token]);

  const handleUserNavigationPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  const changeTheme = () => {
    let newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    storeInSession("theme", newTheme);
  };

  return (
    <>
      <nav className="navbar z-50">
        <Link to={"/"} className="w-10">
          <img
            src={theme === "light" ? logoDark : logoLight}
            className="w-full"
          />
        </Link>

        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            onClick={() =>
              setSearchBoxVisibility((currentValue) => !currentValue)
            }
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>
          <Link to="/editor" className="hidden md:flex gap-2 link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>
          <button
            onClick={changeTheme}
            className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10"
          >
            <i
              className={`fi fi-rr-${
                theme === "dark" ? "sun" : "moon-stars"
              } text-2xl block mt-1`}
            ></i>
          </button>
          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                  {new_notification_available ? (
                    <span className="bg-red h-3 w-3 rounded-full absolute z-10 right-2 top-2"></span>
                  ) : (
                    ""
                  )}
                </button>
              </Link>
              <div
                className="relative"
                onClick={handleUserNavigationPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={profile_img}
                    alt="Profile Image"
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
                {userNavPanel ? <UserNavigationPanel /> : ""}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
