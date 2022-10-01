import React from "react";

const UploadImage = ({ source, className, type, setState }) => {
  const imageRef = React.useRef();
  const [image, setImage] = React.useState(null);
  const defaultImage =
    type === "avatar"
      ? "http://www.gravatar.com/avatar/?d=mp"
      : "https://picsum.photos/600/400/?random";
  const src = source ? source : image ? image : defaultImage;

  return (
    <>
      <img
        onClick={() => imageRef.current.click()}
        src={src}
        alt="Picture"
        className={className}
      />
      <input
        type="file"
        onChange={(e) => {
          setImage(URL.createObjectURL(e.target.files[0]));
          setState(e.target.files[0]);
        }}
        className="hidden"
        name="avatar"
        ref={imageRef}
      />
    </>
  );
};

export default UploadImage;
