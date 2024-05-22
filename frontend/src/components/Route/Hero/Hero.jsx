import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  const images = [
    "https://i.imgur.com/uKJe62C.png",
    "https://i.imgur.com/dC3bo1W.png",
    "https://i.imgur.com/oP9Ucvg.png"
  ];

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
      setCurrentImage(images[index]);
    }, 5000);

    return () => clearInterval(interval);
  }, [index, images]);

  return (
    <div
      className={`relative flex flex-col justify-between min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
      style={{
        backgroundImage: `url(${currentImage})`,
      }}
    >
      <div className={`${styles.section} w-[80%] 800px:w-[90%]`}></div>
      
      <Link to="/products" className="inline-block"style={{ marginLeft: '180px'}}>
        <div className={`${styles.button} mb-5`}>
          <span className="text-[#fff] font-[Poppins] text-[18px]">
            Shop Now
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Hero;
