"use client";
import { cn } from "@/lib/utils";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  Variants,
} from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import Heading from "./general-components";
import { Button } from "./ui/button";
import Image from "next/image";
import { Star } from "lucide-react";

const badgeVariants: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const heading = `Escape the Algorithm \n Discover Software that Matters`;
const paragraph = `Don’t wait for the algorithm. Find powerful tools, made \n by indie hackers, before they hit the mainstream.`;
const Hero = () => {
  const { data } = useSession();

  const containerRef = useRef<HTMLDivElement>(null);

  const icons = {
    chrome: <img className="size-8" src={"/chrome.svg"} />,
    edge: <img className="size-8" src={"/edge.svg"} />,
    firefox: <img className="size-8" src={"/firefox.svg"} />,
    safari: <img className="size-8" src={"/safari.svg"} />,
    brave: <img className="size-8" src={"/brave.svg"} />,
  };
  const pos = [
    { x: 600, y: -100 },
    { x: -600, y: 0 }, // convert "30%" to px
    { x: 400, y: window?.innerHeight * 0.3 },
    { x: -450, y: -200 },
    { x: -400, y: 200 },
  ];

  const mouseX = useMotionValue(window?.innerWidth / 2);
  const mouseY = useMotionValue(window?.innerHeight / 2);
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window?.addEventListener("mousemove", handleMouseMove);
    return () => window?.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="flex flex-col  items-center justify-center   px-4 h-[80vh] md:h-[100dvh] relative overflow-hidden"
    >
      {/* {Object.values(icons).map((icon, index) => {
        const baseX = pos[index].x;
        const baseY = pos[index].y;

        const offsetX = useTransform(
          mouseX,
          (val) => baseX + (val - window.innerWidth / 2) * 0.02
        );
        const offsetY = useTransform(
          mouseY,
          (val) => baseY + (val - window.innerHeight / 2) * 0.02
        );

        const x = useSpring(offsetX, { stiffness: 80, damping: 15 });
        const y = useSpring(offsetY, { stiffness: 80, damping: 15 });

        return (
          <motion.div
            key={index}
            className="absolute  z-[2]"
            // initial={{ ...pos[index] }}
            style={{
              x,
              y,
            }}
            // transition={{
            //   type: "spring",
            //   stiffness: 100,
            //   damping: 20,
            // }}
          >
            <div className="size-10 bg-white rounded-full  even:-rotate-6 odd:-rotate-3 border border-neutral-200 shadow-xl p-1 flex items-center justify-center">
              {icon}
            </div>
          </motion.div>
        );
      })} */}

      <motion.div className="container z-[2] relative mx-auto text-center max-w-5xl flex flex-col items-center justify-center   h-full">
        <div className="mb-8 font-inter  text-neutral-800 dark:text-neutral-200 leading-relaxed  flex flex-col items-center justify-center">
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            className={cn(
              " mb-6 flex z-[2] bg-orange-50  w-fit dark:bg-neutral-900 dark:border-neutral-800 backdrop-blur-lg text-sm text-orange-600 font-medium items-center justify-center border  border-orange-200 px-1 static shadow-lg py-1  rounded-3xl "
            )}
          >
            <div className="flex text-xs text-white bg-orange-600 font-medium px-3 items-center justify-center py-0.5 rounded-full tracking-tight">
              New
            </div>
            <span className="mx-2 text-sm tracking-tight font-medium font-inter w-full">
              Loved by over 1000+ users
            </span>
            {/* </>
            )} */}
          </motion.div>
          <WordsPullUp text={heading} />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:text-lg lg:text-xl leading-tight items-center justify-center flex flex-wrap md:flex-col font-medium text-neutral-700 dark:text-neutral-400 font-inter tracking-tight"
          >
            {paragraph.split(isDesktop ? "\n" : " ").map((line, i) => (
              <motion.span key={i} className="inline-block mr-1 md:mr-0">
                {line}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={badgeVariants}
          whileHover={{
            y: -10,
            scale: 1.05,
          }}
          initial="initial"
          animate="animate"
          className="flex flex-col mt-10 relative items-center justify-start"
        >
          <div className="shadow-sm shadow-orange-500 hover:shadow-2xl delay-75 cursor-pointer duration-300 transition-all hover:shadow-orange-500 border flex flex-row items-center justify-center border-orange-100 p-3 rounded-2xl bg-orange-50">
            <Image
              width={100}
              height={100}
              alt=""
              className="aspect-square object-cover"
              src={"/qr.png"}
            />
            <div className="ml-4 flex flex-col h-full py-2 items-start justify-start pr-2">
              <span className="text-neutral-700 text-sm font-medium text-left leading-tight">
                Scan to download <br /> extension
              </span>
              <div className="w-full flex mt-2 items-center justify-start">
                {Array.from({ length: 5 }).map((_, i) => {
                  return (
                    <Star strokeWidth={0} className="size-4 fill-orange-400" />
                  );
                })}
              </div>
            </div>
          </div>
          {/* <Button className="group md:max-w-xs w-full relative px-8 h-14 py-6 text-lg font-semibold text-white border-0 rounded-full  transition-all [&_svg]:size-6 bg-indigo-700 hover:bg-indigo-800 duration-300 hover:scale-105 hover:shadow-2xl">
            <img
              draggable={false}
              className="group-hover:opacity-100 select-none absolute opacity-0 "
              src="stars.gif"
              alt=""
            />
            <motion.div className="relative font-inter z-10 flex items-center space-x-2">
              {icons["chrome"]}
              <span className="flex items-center justify-center mr-2">
                Get Discover for Chrome
              </span>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20  to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button> */}
          {/* <span className="text-neutral-700 font-medium tracking-tight mt-2 cursor-pointer hover:underline font-inter underline-offset-2">
            Works on all browsers
          </span> */}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

export function WordsPullUp({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const splittedText = text.split("\n");

  const pullupVariant = {
    initial: { y: 40, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <Heading  className="text-4xl md:text-5xl lg:text-6xl z-[2] text-black tracking-tight font-instrument-serif font-thin inline-block mb-6 leading-[1]  md:leading-none ">
      {splittedText.map((current, i) => {
        if (current === "\n") {
          return <br className="" key={i} />;
        }
        return (
          <motion.div
            key={i}
            ref={ref}
            variants={pullupVariant}
            initial="initial"
            animate={isInView ? "animate" : ""}
            custom={i}
          >
            {current}
          </motion.div>
        );
      })}
    </Heading>
  );
}
export function ParagraphPullUp({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const splittedText = text.split("\n");
  const pullupVariant = {
    initial: { y: 40, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
    }),
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div className={cn(className)}>
      {splittedText.map((current, i) => {
        return (
          <motion.span
            key={i}
            ref={ref}
            variants={pullupVariant}
            initial="initial"
            animate={isInView ? "animate" : ""}
            custom={i}
            className=""
          >
            {current}
            <br className="hidden md:flex" />
          </motion.span>
        );
      })}
    </div>
  );
}

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="#ffffff"
      {...props}
      width="320px"
      height="320px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <title>ionicons-v5_logos</title>
        <path d="M188.8,255.93A67.2,67.2,0,1,0,256,188.75,67.38,67.38,0,0,0,188.8,255.93Z"></path>
        <path d="M476.75,217.79s0,0,0,.05a206.63,206.63,0,0,0-7-28.84h-.11a202.16,202.16,0,0,1,7.07,29h0a203.5,203.5,0,0,0-7.07-29H314.24c19.05,17,31.36,40.17,31.36,67.05a86.55,86.55,0,0,1-12.31,44.73L231,478.45a2.44,2.44,0,0,1,0,.27V479h0v-.26A224,224,0,0,0,256,480c6.84,0,13.61-.39,20.3-1a222.91,222.91,0,0,0,29.78-4.74C405.68,451.52,480,362.4,480,255.94A225.25,225.25,0,0,0,476.75,217.79Z"></path>
        <path d="M256,345.5c-33.6,0-61.6-17.91-77.29-44.79L76,123.05l-.14-.24A224,224,0,0,0,207.4,474.55l0-.05,77.69-134.6A84.13,84.13,0,0,1,256,345.5Z"></path>
        <path d="M91.29,104.57l77.35,133.25A89.19,89.19,0,0,1,256,166H461.17a246.51,246.51,0,0,0-25.78-43.94l.12.08A245.26,245.26,0,0,1,461.17,166h.17a245.91,245.91,0,0,0-25.66-44,2.63,2.63,0,0,1-.35-.26A223.93,223.93,0,0,0,91.14,104.34l.14.24Z"></path>
      </g>
    </svg>
  );
}
