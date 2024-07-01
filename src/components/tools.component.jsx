import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import { uploadImage } from "../common/aws";

const uploadImageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (error) {
      reject(error);
    }
  });
  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

const uploadImageByFile = (e) => {
  return uploadImage(e).then((url) => {
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    }
  });
};

export const tools = {
  embed: Embed,
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      default: 2,
    },
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  marker: Marker,
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  inlineCode: InlineCode,
};
