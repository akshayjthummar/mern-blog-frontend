import { Link } from "react-router-dom";
import PageNotFoundImage from "../imgs/404.png";
import fullLogoLight from "../imgs/full-logo-light.png";
import fullLogoDark from "../imgs/full-logo-dark.png";
import { useContext } from "react";
import { ThemeContext } from "../App";

const PageNotFound = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        src={PageNotFoundImage}
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
      />
      <h1 className="text-4xl font-gelasio left-7">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8">
        The page you are looking for does not exists. Head back to our{" "}
        <Link className="text-black underline" to={"/"}>
          home page
        </Link>
      </p>
      <div className="mt-auto ">
        <img
          src={theme == "light" ? fullLogoDark : fullLogoLight}
          className="h-8 object-contain block mx-auto select-none"
        />
        <p className="mt-5 text-dark-grey ">
          Read millions of stories around the word
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
