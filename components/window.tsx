import { useScroll } from "framer-motion";
import React from "react";

const Window = () => {
  const { scrollYProgress } = useScroll();
  // const scaleX=useSpring(scrollYProgress,{
  //     stiffness:100,
  //     damping:30,
  //     restDelta:0.001
  // })
  return (
    <section className="w-full max-w-6xl h-[80dvh] mx-auto">
      {/* <div className="w-full bg- h-full aspect-video rounded-3xl border border-neutral-200 shadow-xl"></div> */}
    </section>
  );
};

export default Window;
