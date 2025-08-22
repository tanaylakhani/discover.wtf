import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useAuth } from "@/lib/auth-client";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const Navbar = ({ hide }: { hide: boolean }) => {
  const { scrollYProgress, scrollY } = useScroll({
    axis: "y",
  });
  const [scrolledPast, setScrolledPast] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const prevScrollY = useRef(0);
  const [goingUp, setGoingUp] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.06 && !scrolledPast) {
      setScrolledPast(true);
    } else if (scrolledPast && latest < 0.06) {
      setScrolledPast(false);
    }
  });
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = prevScrollY.current;
    if (!scrolledPast) return;
    if (latest > prev) {
      setGoingUp(true); // scrolling down → show nav
    } else if (latest < prev) {
      setGoingUp(false); // scrolling up → hide nav
    }

    prevScrollY.current = latest;
  });

  const icons = {
    chrome: <Image className="size-6" src="/chrome.svg" alt="Chrome" width={24} height={24} />,
    edge: <Image className="size-8" src="/edge.svg" alt="Edge" width={32} height={32} />,
    firefox: <Image className="size-8" src="/firefox.svg" alt="Firefox" width={32} height={32} />,
    safari: <Image className="size-8" src="/safari.svg" alt="Safari" width={32} height={32} />,
    brave: <Image className="size-8" src="/brave.svg" alt="Brave" width={32} height={32} />,
  };

  return (
    <>
      <AnimatePresence>
        {hide ||
          (scrolledPast && (
            <motion.div
              animate={{ y: goingUp ? 0 : 80 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "bottom-0 fixed z-50 border-t border-neutral-300/80 bg-orange-100 text-neutral-900  backdrop-blur-md px-6 py-2  inset-x-0 right-0 left-0 shadow-xl flex items-center justify-center"
              )}
            >
              <div className="flex max-w-5xl mx-auto items-center justify-between w-full">
                {/* <div className="ml-4  text-lg font-inter font-semibold">
                  Discover.wtf
                </div> */}

                <span className=" text-orange-700 leading-tight font-medium tracking-tight font-inter">
                  Start discovering software that matters.
                </span>
                <div className="w-fit ">
                  <Button className="group md:max-w-xs w-full relative px-6 h-10 py-3 font-semibold text-white  border-0 rounded-xl  transition-all [&_svg]:size-4 bg-orange-500 duration-300 hover:scale-105 hover:shadow-2xl">
                    <Image
                      draggable={false}
                      className="group-hover:opacity-100 select-none absolute opacity-0"
                      src="/stars.gif"
                      alt="Stars animation"
                      width={100}
                      height={40}
                    />
                    <motion.div className="relative font-inter z-10 flex items-center space-x-2">
                      {icons["chrome"]}
                      <span className="flex items-center justify-center mr-2">
                        Get Extension
                      </span>
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20  to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
