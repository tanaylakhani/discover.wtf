import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import React from "react";

const AnimationSection = () => {
  const positions = [
    { top: "10%", left: "5%" },
    { top: "20%", right: "10%" },
    { top: "15%", left: "20%" },
    { top: "5%", right: "15%" },
  ];
  const { scrollYProgress } = useScroll();
  const [position, setPosition] = React.useState<React.CSSProperties>({
    position: "static",
  });
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("Scroll Y Progress:", latest);
    if (latest > 0.26) {
      setPosition({ position: "relative" });
    } else if (latest < 0.26) {
      setPosition({ position: "static" });
    }
  });
  return (
    <section className="h-[200vh]  relative  w-full">
      <div className="h-[50vh] sticky top-[60px] bg-red-50">
        <div className="relative max-w-5xl h-full">
          <div className="h-4 absolute w-full max-w-5xl mx-auto border-2-t border-dashed border-neutral-300" />
          <div className="h-4 absolute w-full max-w-5xl mx-auto border-2-t border-dashed border-neutral-300" />
        </div>
      </div>
      {/* <div className="h-screen bg-blue-500  sticky top-10 flex items-center justify-center">
        <div
          style={{ ...position }}
          className="aspect-[9/16] max-w-sm border-8 border-black rounded-3xl h-[500px]"
        >
          {positions.map((pos, index) => (
            <FloatingItem
              key={index}
              initialX={0}
              initialY={0}
              style={{ ...pos, zIndex: 50 }}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div> */}
    </section>
  );
};

type FloatingItemProps = {
  initialX: number;
  initialY: number;
  index: number;
  style: any;
  scrollYProgress: MotionValue<number>;
};
const FloatingItem = ({
  initialX,
  initialY,
  index,
  style,
  scrollYProgress,
}: FloatingItemProps) => {
  const x = useTransform(scrollYProgress, [0, 1], [initialX, initialX + 100]);
  const y = useTransform(scrollYProgress, [0, 1], [initialY, initialY + 100]);
  return (
    <motion.div
      className=" border bg-white shadow-xl size-48 rounded-2xl"
      style={{ ...style, x, y }}
    >
      {index}
    </motion.div>
  );
};
export default AnimationSection;
