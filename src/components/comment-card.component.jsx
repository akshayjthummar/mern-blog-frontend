import React, { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentsFiled from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
  const {
    _id,
    commented_by: {
      personal_info: { fullname, username: commentedByUsername, profile_img },
    },
    commentedAt,
    comment,
    children,
  } = commentData;

  const {
    userAuth: { access_token, username },
  } = useContext(UserContext);

  const {
    blog: {
      comments: { results: commentsArr },
      comments,
      activity,
      activity: { total_parent_comments },
      author: {
        personal_info: { username: blog_username },
      },
    },
    blog,
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const [isReplying, setIsReplying] = useState(false);

  const getParentIndex = () => {
    let startingIndex = index - 1;
    try {
      while (
        commentsArr[startingIndex].childrenLevel >= commentData.childrenLevel
      ) {
        startingIndex--;
      }
    } catch (error) {
      startingIndex = undefined;
    }
    return startingIndex;
  };

  const removeCommentsCard = (startingIndex, isDelete = false) => {
    if (commentsArr[startingIndex]) {
      while (
        commentsArr[startingIndex].childrenLevel > commentData.childrenLevel
      ) {
        commentsArr.splice(startingIndex, 1);
        if (!commentsArr[startingIndex]) {
          break;
        }
      }
    }

    if (isDelete) {
      let parentIndex = getParentIndex();
      if (parentIndex != undefined) {
        commentsArr[parentIndex].children = commentsArr[
          parentIndex
        ].children.filter((child) => child != _id);
        if (!commentsArr[parentIndex].children.length) {
          commentsArr[parentIndex].isReplyLoaded = false;
        }
      }

      commentsArr.splice(index, 1);
    }

    if (commentData.childrenLevel == 0 && isDelete) {
      setTotalParentCommentsLoaded((preVal) => preVal - 1);
    }
    setBlog({
      ...blog,
      comments: { results: commentsArr },
      activity: {
        ...activity,
        total_parent_comments:
          total_parent_comments -
          (commentData.childrenLevel == 0 && isDelete ? 1 : 0),
      },
    });
  };

  const loadReplies = ({ skip = 0, currentIndex = index }) => {
    if (commentsArr[currentIndex].children.length) {
      hideReplies();
      axios
        .post(`${import.meta.env.VITE_SERVER_DOMAIN}/get-replies`, {
          _id: commentsArr[currentIndex]._id,
          skip,
        })
        .then(({ data: { replies } }) => {
          commentsArr[currentIndex].isReplyLoaded = true;
          for (let i = 0; i < replies.length; i++) {
            replies[i].childrenLevel =
              commentsArr[currentIndex].childrenLevel + 1;
            commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
          }
          setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteComments = (e) => {
    e.target.setAttribute("disabled", true);
    axios
      .post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/delete-comments`,
        { _id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        e.target.removeAttribute("disabled", true);
        removeCommentsCard(index + 1, true);
      })
      .catch((err) => console.log(err));
  };
  const hideReplies = () => {
    commentData.isReplyLoaded = false;
    removeCommentsCard(index + 1);
  };

  const handleReply = () => {
    if (!access_token) {
      toast.error("Login frist to leave a replies");
    }
    setIsReplying((preVal) => !preVal);
  };

  const LoadMoreReplyButton = () => {
    let parentIndex = getParentIndex();

    if (commentsArr[index + 1]) {
      if (
        commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel
      ) {
        if (index - parentIndex < commentsArr[parentIndex].children.length) {
          return (
            <button
              onClick={() =>
                loadReplies({
                  skip: index - parentIndex,
                  currentIndex: parentIndex,
                })
              }
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 border-md flex items-center gap-2"
            >
              Load More Replies
            </button>
          );
        }
      }
    } else {
      if (parentIndex) {
        if (index - parentIndex < commentsArr[parentIndex].children.length) {
          return (
            <button
              onClick={() =>
                loadReplies({
                  skip: index - parentIndex,
                  currentIndex: parentIndex,
                })
              }
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 border-md flex items-center gap-2"
            >
              Load More Replies
            </button>
          );
        }
      }
    }
  };
  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-3">
          <img src={profile_img} className="h-6 w-6 rounded-full " />
          <p className="line-clamp-1">
            {fullname} @{commentedByUsername}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>
        <p className="font-gelasio text-xl ml-3">{comment}</p>
        <div className="flex gap-5 items-center mt-5">
          {commentData.isReplyLoaded ? (
            <button
              onClick={hideReplies}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i>
              Hide Reply
            </button>
          ) : (
            <button
              onClick={loadReplies}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              {children.length} Replies
            </button>
          )}
          <button onClick={handleReply} className="underline">
            Reply
          </button>

          {username == commentedByUsername || username == blog_username ? (
            <button
              onClick={deleteComments}
              className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center "
            >
              <i className="fi fi-rr-trash"></i>
            </button>
          ) : (
            ""
          )}
        </div>

        {isReplying ? (
          <div className="mt-8">
            <CommentsFiled
              action={"reply"}
              index={index}
              replyingTo={_id}
              setReplying={setIsReplying}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <LoadMoreReplyButton />
    </div>
  );
};

export default CommentCard;
