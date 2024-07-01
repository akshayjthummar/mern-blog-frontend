import axios from "axios";
import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import InPageNavigation, {
  defaultActiveTabRef,
} from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import filterPaginationData from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";
import { logout } from "../common/session";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trandingBlogs, setTrandingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

  const categories = [
    "programing",
    "hollywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finances",
    "travel",
  ];
  const fatchLatestBlog = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrandingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/tranding-blogs")
      .then(({ data }) => {
        setTrandingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadBlogByCategories = (e) => {
    const category = e.target.innerText.toLowerCase();
    setBlogs(null);
    if (pageState == category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };
  const fetchBlogByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState },
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    defaultActiveTabRef.current.click();
    if (pageState == "home") {
      fatchLatestBlog({ page: 1 });
    } else {
      fetchBlogByCategory({ page: 1 });
    }
    if (!trandingBlogs) {
      fetchTrandingBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* letest blog */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "tranding blogs"]}
            defaultHidden={["tranding blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No blog published" />
              )}
              <LoadMoreDataBtn
                state={blogs}
                fetchDataFun={
                  pageState === "home" ? fatchLatestBlog : fetchBlogByCategory
                }
              />
            </>
            {trandingBlogs == null ? (
              <Loader />
            ) : trandingBlogs.length ? (
              trandingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 1 }}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No tranding blog" />
            )}
          </InPageNavigation>
        </div>
        {/* filter and tranding blog */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10 ">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategories}
                      key={i}
                      className={
                        "tag " +
                        (pageState === category ? "bg-black text-white" : "")
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Tranding <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trandingBlogs === null ? (
                <Loader />
              ) : trandingBlogs.length ? (
                trandingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 1 }}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No tranding blog" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
