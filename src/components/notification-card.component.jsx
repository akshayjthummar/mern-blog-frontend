import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentFiled from "./notification-comment-field.component";
import { UserContext } from "../App";
import axios from "axios";

const NotificationCard = ({ data, index, notificationState }) => {
  const {
    seen,
    type,
    reply,
    comment,
    createdAt,
    replied_on_comment,
    blog: { _id, blog_id, title },
    user,
    user: {
      personal_info: { username, fullname, profile_img },
    },
    _id: notification_id,
  } = data;
  const {
    userAuth: {
      profile_img: author_profile_img,
      username: author_username,
      access_token,
    },
  } = useContext(UserContext);

  let {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    setIsReplying((preVal) => !preVal);
  };
  const handleDelete = (comment_id, type, target) => {
    target.setAttribute("disabled", true);
    axios
      .post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/delete-comments`,
        { _id: comment },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        if (type == "comment") {
          results.splice(index, 1);
        } else {
          delete results[index].reply;
        }
        target.removeAttribute("disabled");

        setNotifications({
          ...notifications,
          results,
          totalDocs: totalDocs - 1,
          deletedDocCount: notifications.deletedDocCount + 1,
        });
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      className={`p-6 border-b border-grey border-l-black ${
        !seen ? "border-l-2" : ""
      }`}
    >
      <div className="flex gap-5 mb-3">
        <img src={profile_img} className="w-14 h-14 rounded-full flex-none" />
        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="lg:inline-block hidden capitalize">
              {fullname}
            </span>
            <Link
              className="mx-1 text-black underline"
              to={`/user/${username}`}
            >
              @{username}
            </Link>
            <span className="font-normal">
              {type === "like"
                ? "liked your blog"
                : type === "comment"
                ? "commented on "
                : "replied on "}
            </span>
          </h1>
          {type === "reply" ? (
            <div>
              <p className="p-4 mt-4 rounded-md bg-grey">
                {replied_on_comment.comment}
              </p>
            </div>
          ) : (
            <Link
              to={`/blog/${blog_id}`}
              className="font-medium text-dark-grey hover:underline line-clamp-1"
            >{`"${title}"`}</Link>
          )}
        </div>
      </div>
      {type !== "like" ? (
        <p className="ml-14 pl-5 font-gelasio text-xl my-3">
          {comment.comment}
        </p>
      ) : (
        ""
      )}

      <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
        <p>{getDay(createdAt)}</p>
        {type !== "like" ? (
          <>
            {!reply ? (
              <button
                onClick={handleReply}
                className="underline hover:text-black "
              >
                Reply
              </button>
            ) : (
              ""
            )}
            <button
              onClick={(e) => handleDelete(comment._id, "comment", e.target)}
              className="underline hover:text-black "
            >
              Delete
            </button>
          </>
        ) : (
          ""
        )}
      </div>
      {isReplying ? (
        <div className="mt-8">
          <NotificationCommentFiled
            _id={_id}
            blog_author={user}
            index={index}
            replyingTo={comment._id}
            setReplying={setIsReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      ) : (
        ""
      )}
      {reply ? (
        <div className="ml-20 p-5 bg-grey rounded-md mt-5">
          <div className="flex gap-3 mb-3">
            <img src={author_profile_img} className="w-8 h-8 rounded-full" />
            <div>
              <h1 className="font-medium text-xl text-dark-grey">
                <Link
                  className="mx-1 text-black underline"
                  to={`/user/${author_username}`}
                >
                  @{author_username}
                </Link>
                <span className="font-normal">replied to</span>
                <Link
                  className="mx-1 text-black underline"
                  to={`/user/${username}`}
                >
                  @{username}
                </Link>
              </h1>
            </div>
          </div>
          <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>
          <button
            onClick={(e) => handleDelete(comment._id, "reply", e.target)}
            className="underline hover:text-black ml-14 mt-2"
          >
            Delete
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationCard;
