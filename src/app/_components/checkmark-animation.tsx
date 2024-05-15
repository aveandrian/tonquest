import { useEffect } from "react";
import lottie from "lottie-web";

export function CheckmarkAnimation() {
  const elementToAnimate = document.querySelector("#animationContainer");
  const elementToAnimate2 = document.querySelector("#animationContainer2");

  useEffect(() => {
    elementToAnimate &&
      lottie.loadAnimation({
        container: elementToAnimate,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "https://lottie.host/bcd9adca-b0ec-4e7c-97eb-482acb0d2c0a/PIxEzoF8PI.json",
      });
    elementToAnimate2 &&
      lottie.loadAnimation({
        container: elementToAnimate2,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "https://lottie.host/7358dc24-34ac-4feb-b028-795bcd925e85/nP3FQzJ1fs.json",
      });
  }, [elementToAnimate, elementToAnimate2]);

  return (
    <div id="animationContainer" className="relative w-[30%]">
      <div id="animationContainer2" className="absolute scale-150"></div>
    </div>
  );
}
