/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";

export let activeIndicatorRef;
export let defaultActiveTabRef;

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) => {
  activeIndicatorRef = useRef();
  defaultActiveTabRef = useRef();
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const changePageState = (button, index) => {
    const { offsetWidth, offsetLeft } = button;
    activeIndicatorRef.current.style.width = `${offsetWidth}px`;
    activeIndicatorRef.current.style.left = `${offsetLeft}px`;
    setActiveIndex(index);
  };

  // Set the initial state of the navigation bar.
  useEffect(() => {
    if (width > 766 && activeIndex != defaultActiveIndex) {
      changePageState(defaultActiveTabRef.current, defaultActiveIndex);
    }
    if (!isResizeEventAdded) {
      window.addEventListener("resize", () => {
        if (!isResizeEventAdded) {
          setIsResizeEventAdded(true);
        }
        setWidth(window.innerWidth);
      });
    }
  }, [width]);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes.map((route, index) => (
          <button
            key={index}
            ref={index === defaultActiveIndex ? defaultActiveTabRef : null}
            className={`p-4 px-5 capitalize ${
              activeIndex === index ? "text-black" : "text-dark-grey"
            } ${defaultHidden.includes(route) ? "md:hidden" : ""}`}
            onClick={(e) => {
              changePageState(e.target, index);
            }}
          >
            <p className="line-clamp-1">{route}</p>
          </button>
        ))}
        <hr
          ref={activeIndicatorRef}
          className="absolute bottom-0 duration-300 border-dark-grey"
        />
      </div>
      {Array.isArray(children) ? children[activeIndex] : children}
    </>
  );
};

export default InPageNavigation;
