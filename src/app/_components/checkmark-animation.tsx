import { useEffect, useState } from "react";
import lottie from "lottie-web";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function CheckmarkAnimation() {
  const [elementToAnimate] = useState(
    document.querySelector("#animationContainer"),
  );
  const [elementToAnimate2] = useState(
    document.querySelector("#animationContainer2"),
  );

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
    <DotLottieReact
      src="https://lottie.host/bcd9adca-b0ec-4e7c-97eb-482acb0d2c0a/PIxEzoF8PI.json"
      loop={false}
      autoplay
      className="relative w-[30%]"
    >
      <DotLottieReact
        src="https://lottie.host/7358dc24-34ac-4feb-b028-795bcd925e85/nP3FQzJ1fs.json"
        loop={false}
        autoplay
        className="scale-200 absolute"
      />
    </DotLottieReact>
  );
}
