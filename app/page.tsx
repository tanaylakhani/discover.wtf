"use client";

import Component from "@/components/faq";
import Features from "@/components/features";
import Features1 from "@/components/features-1";
import Hero from "@/components/hero";
import WebsitesMarqueeEffect from "@/components/marquee";
import Navbar from "@/components/navbar";
import Testimonials from "@/components/testimonials";
import { cn } from "@/lib/utils";
import Lenis from "@studio-freight/lenis";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useRef, useState } from "react";

const steps = [
  {
    title: "Open a New Tab and Step Into a Curated Feed of the Web",
    video: "/videos/step1-tab.mp4",
  },
  {
    title: "Swipe Through Surprisingly Good Sites — No Follower Graph Needed",
    video: "/videos/step2-swipe.mp4",
  },
  {
    title: "Save What Speaks to You and Build a Personal Internet Shelf",
    video: "/videos/step3-save.mp4",
  },
  // {
  //   title: "Use the Extension to Explore Deeper — Ask the Web Anything",
  //   video: "/videos/step4-extension.mp4",
  // },
  // {
  //   title: "Turn Your Discoveries Into Moodboards and Shareable Collections",
  //   video: "/videos/step5-moodboard.mp4",
  // },
  {
    title:
      "React, Comment, and Rediscover Together with the Internet’s Curious Few",
    video: "/videos/step6-social.mp4",
  },
];

export default function DiscoverWTFLanding() {
  React.useEffect(() => {
    const lenis = new Lenis({
      orientation: "vertical",
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const ref = useRef(null);

  const isInView = useInView(ref, {
    margin: "0px 0px -400px 0px", // or omit, default is fine
    amount: 0.1, // or threshold: 0.5 if using react-intersection-observer
    once: false, // or true if you only want it to trigger once
  });

  const [activeText, setActiveText] = useState<number | null>(null);

  // useMotionValueEvent(scrollYProgress, "change", (latestValue) => {
  //   console.log(latestValue);

  //   if (latestValue > 0.09) {
  //     const scrollProgress = latestValue - 0.098;
  //     const maxScrollRange = 0.25 - 0.098;
  //     const stepProgress = scrollProgress / maxScrollRange; // 0 to 1

  //     const adjustedProgress = stepProgress * steps.length;
  //     const stepIndex = Math.floor(adjustedProgress);
  //     console.log({ adjustedProgress, stepIndex });

  //     if (stepIndex >= 0) {
  //       setActiveText(stepIndex);
  //     } else {
  //       setActiveText(null);
  //     }
  //   } else {
  //     setActiveText(null);
  //   }
  // });

  const bgs = [
    "bg-blue-500",
    "bg-red-500",
    "bg-lime-400",
    "bg-yellow-400",
    "bg-indigo-500",
  ];

  const feats = [
    {
      title: "Daily Digests",
    },
    {
      title: "Read minds. Follow Curators.",
    },
    {
      title: "Play with Lists. Playlists.",
    },
    {
      title: "Sharing is caring",
    },
  ];

  const discoverStats = [
    {
      value: "5000+",
      label: "Curious questions asked",
      icon: "🧠",
    },
    {
      value: "45k+",
      label: "WTF moments logged",
      icon: "😲",
    },
    {
      value: "1200+",
      label: "Videos, threads & deep dives",
      icon: "🔍",
    },
  ];

  return (
    <motion.div
      style={{
        // backgroundColor: isInView && activeText ? "black" : "white",
        transition: "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className={cn("min-h-screen w-full ")}
    >
      <Navbar hide={isInView} />

      {/* <img
        src={"/hero2.png"}
        className="w-screen  md:-top-[200px] -top-[160px] h-screen md:h-auto object-cover  absolute -z-20"
      /> */}
      {/* <div className=" w-screen flex -z-10 absolute items-center justify-center">
        <div className="max-w-md w-full h-[400px] bg-gradient-to-t from-black/80 via-black/60 to-black/50 blur-3xl inset-x-0"></div>
      </div> */}
      <div className="md:min-h-[120vh] z-0 bg-blue-200 w-full relative flex items-center justify-center">
        <Hero />
        <img
          src={
            "https://framerusercontent.com/images/MGyRJiqZvcsd1To5R6KDZPibM.png"
          }
          className="w-screen  top-[200px] h-screen object-cover  absolute z-[1]"
        />
      </div>

      <WebsitesMarqueeEffect />
      <section className="w-full relative  mt-20  font-inter flex flex-col items-center justify-start min-screen ">
        {/* <svg
          pathLength={0}
          className="absolute -top-[100px] inset-x-0 -z-10"
          width="100%"
          height="600"
          viewBox="0 0 1440 1174"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            pathLength={0}
            d="M326.886 0C495.576 15.4318 671.319 75.6174 704.813 99.6287C738.306 123.64 1159.82 147.401 1506.16 283.117C1589.84 345.529 1628.63 366.619 1650.63 482.375C1672.63 598.13 1606.14 661.563 1572.64 733.597C1539.15 805.63 1482.2 941.799 1339.19 1052.55C1146.17 1138.79 1016.07 1166.39 738.306 1172.25C519.684 1177.73 386.048 1174.13 42.941 1104.52L39.7897 1102.59C-95.4875 1019.69 -172.303 972.618 -201.512 893.074C-208.139 786.229 -260.345 730.286 42.941 598.13C160.018 545.155 235.357 535.782 371.377 522.513L738.306 482.375H270.897C143.47 473.45 63.4144 460.96 -107.03 414.642C-239.803 262.991 -222.367 188.007 -68.0375 67.7332C49.7862 31.8873 113.508 11.1869 326.886 0Z"
            fill="#FFE7CF"
          />
        </svg> */}

        <div className="max-w-5xl flex  flex-col py-10 rounded-3xl  items-center justify-evenly w-full mx-auto">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium md:font-semibold text-black text-center tracking-tight font-inter leading-tight">
            What We’ve Done <br /> So Far,
            <span className="bg-gradient-to-t bg-clip-text text-transparent from-orange-500 via-orange-600 to-orange-400">
              Statistically
            </span>{" "}
          </h3>
          <div className="flex flex-col md:flex-row  items-center justify-evenly mt-16 w-full ">
            {discoverStats?.map((stat, i) => {
              return (
                <div
                  key={i}
                  className="w-full flex flex-col mb-10 md:mb-0 items-center justify-center"
                >
                  {/* <span className="text-3xl font-bold">{stat?.icon}</span> */}
                  <h3 className="tracking-tight text-5xl bg-gradient-to-t from-orange-600 via-orange-600 to-orange-400 text-transparent bg-clip-text font-bold ">
                    {stat?.value}
                  </h3>
                  <span className="text-lg mt-2 text-neutral-600 font-medium tracking-tight">
                    {stat?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section
        ref={ref}
        className="w-full flex max-w-5xl mx-auto  flex-col-reverse md:flex-row py-[100px] relative items-start justify-center h-[250vh]"
      >
        <div className="max-w-xs mt-[60px] w-full mr-auto flex items-center justify-start ">
          <div className="">
            {steps.map((step, i) => {
              return (
                <Step setActiveText={setActiveText} step={step} key={i} i={i} />
              );
            })}
          </div>
        </div>
        <div className="w-full md:w-1/2 h-screen sticky top-0 flex items-center justify-center ">
          <motion.div
            style={{
              borderRadius: "3rem",
              transition: "background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className={cn(
              "max-w-lg border border-neutral-200 w-full h-[300px] md:h-[500px] relative  overflow-hidden mx-auto  ",
              activeText ? bgs[activeText] : "bg-white"
            )}
          >
            <AnimatePresence key={activeText}>
              {activeText === 1 && (
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                  <motion.video
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    exit={{ y: 200 }}
                    src="/asset.mp4"
                    className="border-[12px] border-black max-w-xs w-full absolute -bottom-[40%] mx-auto rounded-[3rem] aspect-[9/16] object-cover "
                    autoPlay
                    muted
                    loop
                  />
                </div>
              )}
              {activeText === 2 && (
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                  <motion.video
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    exit={{ y: 200 }}
                    src="/asset1.mp4"
                    className="border-[12px] border-black max-w-xs w-full absolute -bottom-[40%] mx-auto rounded-[3rem] aspect-[9/16] object-cover "
                    autoPlay
                    muted
                    loop
                  />
                </div>
              )}
              {activeText === 3 && (
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    exit={{ y: 200 }}
                  >
                    <img src="/asset2.png" alt="" />
                  </motion.div>
                </div>
              )}
              {activeText === 4 && (
                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                  <motion.div
                    initial={{ y: 600, rotate: -10, opacity: 0.4, scale: 0.8 }}
                    animate={{
                      y: 0,
                      rotate: [-8, -6, 0],
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className="max-w-[260px] relative overflow-hidden font-inter mx-auto w-full p-3 rounded-3xl h-[300px] bg-white"
                  >
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <img
                        src="https://spoil.me/images/meta/og-image-1200-630-v4.png"
                        alt=""
                        className="w-full object-cover rounded-3xl border border-neutral-200"
                      />
                      <div className="flex px-2 flex-col mt-4">
                        <h2 className=" font-medium tracking-tight leading-tight">
                          Spoil Me - Your luxury wishlist in one link
                        </h2>
                        <p className=" text-neutral-600 leading-tight text-sm mt-2">
                          Let your circle spoil you and send you gifts. Receive
                          and send gifts fast and safely.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.5,
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="h-16 mt-4 w-[160px]"
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 407 115"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="114.5"
                        width="114"
                        height="406"
                        rx="57"
                        transform="rotate(-90 0.5 114.5)"
                        fill="white"
                        stroke="#E2E2E2"
                      />
                      <path
                        d="M291.167 45.1001C291.167 40.3397 291.167 37.9594 292.093 36.1412C292.908 34.5418 294.208 33.2415 295.808 32.4266C297.626 31.5001 300.006 31.5001 304.767 31.5001L317.233 31.5001C321.994 31.5001 324.374 31.5001 326.192 32.4266C327.792 33.2415 329.092 34.5418 329.907 36.1412C330.833 37.9594 330.833 40.3397 330.833 45.1001V82.5001L311 71.1668L291.167 82.5001V45.1001Z"
                        stroke="black"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M106.648 31.5C116.628 31.5 123.333 40.9988 123.333 49.86C123.333 67.8058 95.5039 82.5 95.0001 82.5C94.4963 82.5 66.6667 67.8058 66.6667 49.86C66.6667 40.9988 73.3723 31.5 83.3519 31.5C89.0816 31.5 92.8278 34.4006 95.0001 36.9506C97.1724 34.4006 100.919 31.5 106.648 31.5Z"
                        stroke="black"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M228.5 57C228.5 71.0834 217.083 82.5 203 82.5C199.608 82.5 196.371 81.8379 193.411 80.6354C192.844 80.4053 192.561 80.2903 192.332 80.239C192.108 80.1889 191.942 80.1704 191.712 80.1704C191.478 80.1704 191.222 80.2129 190.711 80.2982L180.63 81.9784C179.575 82.1543 179.047 82.2422 178.665 82.0784C178.331 81.9353 178.065 81.669 177.921 81.3349C177.758 80.9533 177.846 80.4254 178.022 79.3697L179.702 69.2893C179.787 68.7779 179.83 68.5223 179.83 68.2877C179.83 68.0579 179.811 67.8922 179.761 67.6684C179.71 67.4394 179.595 67.1561 179.365 66.5894C178.162 63.6292 177.5 60.3918 177.5 57C177.5 42.9167 188.917 31.5 203 31.5C217.083 31.5 228.5 42.9167 228.5 57Z"
                        stroke="black"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <Features1 />
      {/* <section className="max-w-5xl px-4 py-10  mx-auto min-h-screen">
        <h3 className="font-3xl lg:text-4xl xl:text-5xl font-semibold text-black text-center tracking-tighter font-inter leading-tight">
          Collect the best bits
          <br />
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-orange-500 via-orange-600 to-orange-400">
            of the Internet.
          </span>
        </h3>
        <div className="w-full grid gap-6 mt-8 grid-cols-5 ">
          {feats.map((feat, i) => {
            return (
              <div
                key={i}
                className={cn(
                  "h-[340px] w-full bg-neutral-100 overflow-hidden relative rounded-3xl",
                  i === 0 || i === 3 ? "col-span-2" : "col-span-3"
                )}
              >
                <div className="flex items-center justify-center p-6">
                  <h4 className="text-lg font-medium">{feat?.title}</h4>
                </div>
                <div className=" w-full h-full ">
                  {i === 1 && (
                    <>
                      <div className="absolute -top-6 left-2 flex flex-col space-y-4 px-4">
                        {Array.from({ length: 12 })?.map((_, i) => {
                          return (
                            <div
                              key={i}
                              className="size-14 rounded-full bg-neutral-300"
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section> */}
      <Features />
      <section className="w-full px-4   mx-auto py-10">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium md:font-semibold text-black text-center tracking-tighter font-inter leading-tight">
          Curious people are curating.
          <br />
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-orange-500 via-orange-600 to-orange-400">
            Just follow along.
          </span>
          <div className="w-full max-w-5xl mx-auto mt-8 flex justify-center items-center">
            {Array.from({ length: 4 })?.map((_, i) => {
              return (
                <div key={i} className="w-full ">
                  <img
                    style={{
                      scale: i <= 1 ? (i == 1 ? 0.5 : 0.55) : 0.6,
                    }}
                    src={`/f${i + 1}.avif`}
                  />
                </div>
              );
            })}
          </div>
        </h3>
      </section>
      <Testimonials />
      <Component />
      <div className="relative w-full  py-20 px-4 md:h-screen z-10 bg-gradient-to-t from-white via-white/60 to-transparent">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-80 md:w-96 h-80 md:h-96 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
        </div>
        <h2 className="text-8xl md:text-9xl font-aspekta text-center w-full absolute -bottom-8 lg:text-[12rem] xl:text-[18.8rem] font-black bg-gradient-to-t from-white/80 via-black/20 inset-x-0 to-transparent bg-clip-text text-transparent leading-none tracking-tighter">
          Endless <br className="flex lg:hidden" /> WTF's
        </h2>
      </div>
    </motion.div>
  );
}

const Step = ({
  step,
  i,
  setActiveText,
}: {
  step: any;
  i: number;
  setActiveText: (i: number) => void;
}) => {
  const stepRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start end", "end start"], // Triggers between 40% and 60% of viewport
  });
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.4 && latest < 0.6) {
      setActiveText(i + 1);
    }
  });

  // Create smooth transition values with narrower peak
  const colorProgress = useTransform(
    scrollYProgress,
    [0.4, 0.5, 0.62], // Narrower peak - only fully white at exact center
    [0, 1, 0] // 0 = dimmed, 1 = bright, 0 = dimmed
  );

  const blurProgress = useTransform(
    scrollYProgress,
    [0.1, 0.5, 0.9],
    [1, 0, 1] // 1 = blurred, 0 = sharp, 1 = blurred
  );

  return (
    <motion.div
      key={i}
      ref={stepRef}
      style={{
        color: useTransform(
          colorProgress,
          [0, 1],
          ["rgba(0,0,0,0.2)", "black"]
        ),
        filter: useTransform(
          blurProgress,
          [1, 0.5, 0],
          ["blur(6px)", "blur(2px)", "blur(0px)"]
        ),
      }}
      className="flex my-20 items-center justify-center"
    >
      <h2 className={cn("text-3xl font-inter font-bold tracking-tight")}>
        {step.title}
      </h2>
    </motion.div>
  );
};
