import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Link2,
  MoreVertical,
  Plug,
  RefreshCcw,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const Features = () => {
  interface Feature {
    title: string;
    description: string;

    visualHint?: string; // quick description of intended visual (for dev notes)
  }

  const features = [
    {
      title: "Aggregated Across the Internet",
      description:
        "From idea-stage builds to polished indie tools — surfaced by intent, not influence.",
      icon: "🌱",
    },
    {
      title: "Link is the New Content",
      description: "Links aren’t dead — they just needed a glow-up.",
      icon: "🚫📈",
    },
    {
      title: "Play with Lists. Playlists.",
      icon: "🤙",
      description: "Discover themed collections made by creators like you..",
    },
    {
      title: "Sharing is caring",
      icon: "🍀",
      description:
        "Discover themed collections made by creators like you. Think Web Playlists, Link Reels, and Moodboards built to explore ideas, not just trends.",
    },
    {
      title: "Discover Extension",
      subtitle: "Interact with the web. Not just the platform.",
      description:
        "Highlight text, click images, or open any site — and get context, summaries, or AI convos directly.",
      icon: "🧠",
    },
  ];

  const features2 = [
    {
      title: "Swipe Into Serendipity",
      content:
        "Discover.wtf replaces search with swipe — feeding you the coolest sites you didn’t know you needed.",
    },
    {
      title: "Real Websites. Not Previews.",
      content:
        "Unlike social feeds, every swipe takes you to the actual site — no iframes, no previews, just the real open web.",
    },
    {
      title: "Link is the New Content",
      content:
        "Discover treats links as atomic content units — beautifully rendered, context-rich, and saveable.",
    },
    {
      title: "Find What Algorithms Can’t",
      content:
        "Our feed surfaces weird, fresh, indie web content — not SEO traps or trending echo chambers.",
    },
    {
      title: "Built by Curators, Not Corporations",
      content:
        "Explore collections made by internet explorers like you. Follow curators, not follower counts.",
    },
    {
      title: "Your Browser, Reimagined",
      content:
        "Discover transforms your new tab into a vibrant feed of internet gems — tailored to your curiosity.",
    },
    {
      title: "AI That Finds What You Feel",
      content:
        "Pull up our extension on any page and use natural language to explore, compare, and extract insights instantly.",
    },
    {
      title: "Save, Like, Comment Anywhere",
      content:
        "React to any site you visit, leave notes, save links, and chat with others — directly from the browser.",
    },
    {
      title: "Moodboards for Your Mind",
      content:
        "Organize discoveries into moodboards that are shareable, aesthetic, and idea-driven.",
    },
    {
      title: "Reclaim Your Feed",
      content:
        "Discover gives you back control of what you see — and what you never want to see again.",
    },
  ];

  const [hoveredFeature, setHoveredFeature] = React.useState<number | null>(
    null
  );
  const tabs = ["All", "Collections", "Archived", "Shared"];
  return (
    <section className="font-inter max-w-5xl mx-auto px-4 py-16">
      {/* <motion.h2
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl lg:text-5xl font-medium md:font-semibold text-black text-center tracking-tighter font-inter leading-tight"
      >
        Discovery Isn’t a Feature
        <br />
        <span className="bg-gradient-to-t bg-clip-text text-transparent from-orange-500 via-orange-600 to-orange-400">
          It's the Product.
        </span>
      </motion.h2> */}
      <motion.h2
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="font-3xl lg:text-4xl xl:text-5xl font-semibold text-black text-center tracking-tighter font-inter leading-tight"
      >
        Collect the best bits
        <br />
        <span className="bg-gradient-to-t bg-clip-text text-transparent from-orange-500 via-orange-600 to-orange-400">
          of the Internet.
        </span>
      </motion.h2>
      {/* <motion.h2
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl font-medium text-neutral-900 text-center tracking-tighter font-inter leading-tight"
      >
        <span>
          {" "}
          <span className="font-instrument-serif font-thin text-4xl italic mr-1  tracking-normal">
            Discovery
          </span>{" "}
          Isn’t a Feature
        </span>

        <br />
        <span>It's the Product.</span>
      </motion.h2> */}
      {/* <h3 className="font-3xl lg:text-4xl xl:text-5xl font-semibold text-black text-center tracking-tighter font-inter leading-tight">
        Collect the best bits
        <br />
        <span className="bg-gradient-to-t bg-clip-text text-transparent from-orange-500 via-orange-600 to-orange-400">
          of the Internet.
        </span>
      </h3> */}
      <motion.div
        initial={{ y: 160, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-7 gap-y-6 md:gap-4 h-full mt-12"
      >
        {features.map((feat, index) => (
          <motion.div
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
            key={index}
            className={cn(
              "bg-gradient-to-t",
              index === 0 && "md:col-span-4 ",
              index === 1 && "md:col-span-3 ",
              index === 2 && "md:col-span-3 ",
              index === 3 && "md:col-span-4 ",
              index === 4 && "md:col-span-7 ",
              "h-[500px] md:h-[500px] relative border bg-gray-100 border-neutral-200 overflow-hidden shadow-md flex flex-col   rounded-3xl dark:border-neutral-800 "
            )}
          >
            <div
              className={cn(
                "z-0 flex font-inter flex-col items-start justify-start px-8 py-8 ",
                index === 4 && "md:mx-auto md:max-w-2xl "
              )}
            >
              <h3 className="text-2xl tracking-tight font-medium text-neutral-900 ">
                {feat?.title} {feat?.icon}
              </h3>
              <p className="mt-2 tracking-tight leading-snug text-neutral-700 dark:text-neutral-300">
                {feat?.description}
              </p>
            </div>
            <div className="h-full flex items-center justify-center flex-1 z-0  relative  w-full">
              {/* {index === 3 && (
                <BeyondFeed isHovered={hoveredFeature === index} />
              )} */}
              {index === 0 && (
                <DiscoverBeyond isHovered={hoveredFeature === index} />
              )}
              {index === 1 && <Card1 isHovered={hoveredFeature === index} />}
              {index === 4 && <Card2 isHovered={hoveredFeature === index} />}
              {index === 2 && (
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                  <motion.div
                    initial={{ y: 200, opacity: 0.8, scale: 0.9 }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    className="border-[12px] max-w-xs border-neutral-400 rounded-[3rem] absolute -bottom-[70%] overflow-hidden mx-auto"
                  >
                    <img
                      src="/asset4.avif"
                      style={{ objectFit: "fill" }}
                      alt=""
                    />
                  </motion.div>
                </div>
              )}
              {index === 3 && (
                <div className="w-full h-full relative overflow-hidden flex flex-col  items-center justify-center">
                  <motion.div
                    initial={{ y: 40, opacity: 0.8, scale: 0.9 }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    className="h-10 flex items-center justify-center gap-1 bg-white border px-2 rounded-full border-neutral-200"
                  >
                    {tabs.map((tab, i) => {
                      return (
                        <div
                          key={i}
                          className="px-6 py-1 first:bg-orange-500 text-sm first:text-white text-neutral-700 rounded-full font-medium tracking-tight"
                        >
                          {tab}
                        </div>
                      );
                    })}
                  </motion.div>
                  <div className="flex items-end justify-center w-full h-full">
                    <div className="w-full flex absolute -bottom-10 gap-2 items-center justify-center ">
                      {Array.from({ length: 4 }).map((_, i) => {
                        return (
                          <motion.div
                            key={i}
                            whileHover={{
                              margin: 10,
                              y: -50,
                              scale: 1.05,
                            }}
                            className=" w-[200px] bg-white obje flex-shrink-0 border h-[250px] rounded-2xl"
                          >
                            <img
                              className="object-cover"
                              src={`/link${i + 1}.avif`}
                              alt=""
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

type FeatureProps = {
  isHovered: boolean;
};
function Card1({ isHovered }: FeatureProps) {
  const [hovered, setHovered] = useState(isHovered);
  useEffect(() => {
    let interval = setInterval(() => {
      setHovered((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <motion.div
        initial={false}
        animate={
          hovered
            ? {
                width: "240px",
                height: "220px",
                rotate: [-6, 16, -12, 0],
              }
            : {
                width: "180px",
                height: "50px",
              }
        }
        className={cn(
          "border border-neutral-300 flex items-center mb-14 justify-center bg-white shadow-xl",
          hovered
            ? "rounded-3xl p-3 flex flex-col"
            : " px-4 py-2 text-xl font-semibold tracking-tight rounded-3xl"
        )}
        transition={{
          duration: 0.3,
        }}
      >
        <AnimatePresence>
          {hovered ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                delay: 0.2,
              }}
              className="flex flex-col h-full"
            >
              <div className="border border-neutral-200 rounded-xl">
                <img
                  className="rounded-xl aspect-video object-cover"
                  src="https://cdn.prod.website-files.com/65240dac30f703b7a711b7c2/653c3536bdeacd544a90d764_Gift%20more%20Smiles!2%20(1).png"
                  alt=""
                />
              </div>
              <div className="h-full font-inter mt-2 px-2">
                <h2 className=" font-semibold tracking-tight leading-tight text-neutral-900 text-lg">
                  Givingli - Corporate Gifting for Humans
                </h2>
              </div>
            </motion.div>
          ) : (
            <>
              <Link2 className="" />
              <span className="ml-2">discover.wtf</span>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
function Card2({ isHovered }: FeatureProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false }); // set once: true if you want it to happen only once
  const controls = useAnimation();
  const menuControls = useAnimation();
  const [dynamic, setDynamic] = useState(inView);

  useEffect(() => {
    if (!inView) return;
    let interval = setInterval(() => {
      setDynamic((prev) => !prev);
    }, 3200);
    return () => clearInterval(interval);
  }, [inView, setDynamic]);

  useEffect(() => {
    const sequence = async () => {
      if (dynamic) {
        // First animate x, y, scale
        await controls.start({
          x: 0,
          y: 0,

          transition: {
            duration: 1,
            ease: "easeOut",
          },
        });
        await controls.start({
          scale: [0.7, 1.2, 1],
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        });

        // Then fade the opacity
        await controls.start({
          opacity: 0,
          transition: {
            duration: 0.2,
          },
        });

        await menuControls.start({
          y: 40,
          opacity: 1,
          scale: 0.9,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
        await menuControls.start({
          y: 400,
          opacity: 0,
          scale: 0.8,
        });
      } else {
        // Reset if out of view (optional)
        controls.set({
          x: 400,
          y: 500,
          opacity: 1,
        });
      }
    };

    sequence();
  }, [dynamic, controls, menuControls]);

  return (
    <div
      ref={ref}
      className="w-full h-full  relative  flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        whileInView={{ y: 100, opacity: 1 }}
        animate={menuControls}
        className="absolute z-50 h-56 w-16 right-10"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 135 458"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className="shadow-2xl shadow-black"
            x="0.5"
            y="0.5"
            width="134"
            height="457"
            rx="67"
            fill="white"
            stroke="#c9c9c9"
          />
          <path
            d="M48.1667 346.1C48.1667 341.34 48.1667 338.959 49.0932 337.141C49.9081 335.542 51.2084 334.241 52.8078 333.426C54.6261 332.5 57.0063 332.5 61.7667 332.5H74.2334C78.994 332.5 81.374 332.5 83.1924 333.426C84.7918 334.241 86.092 335.542 86.9069 337.141C87.8334 338.959 87.8334 341.34 87.8334 346.1V383.5L68.0001 372.167L48.1667 383.5V346.1Z"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M79.6482 68.5C89.6278 68.5 96.3334 77.9987 96.3334 86.86C96.3334 104.806 68.5038 119.5 68.0001 119.5C67.4963 119.5 39.6667 104.806 39.6667 86.86C39.6667 77.9987 46.3723 68.5 56.3519 68.5C62.0816 68.5 65.8278 71.4006 68.0001 73.9506C70.1724 71.4006 73.9186 68.5 79.6482 68.5Z"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M85 264.333L73.6667 253M41.0833 296.917L50.6723 295.851C51.8439 295.721 52.4296 295.656 52.9772 295.479C53.4629 295.322 53.9252 295.099 54.3514 294.818C54.8319 294.501 55.2486 294.085 56.0822 293.251L93.5 255.833C96.6297 252.704 96.6297 247.63 93.5 244.5C90.3703 241.37 85.2964 241.37 82.1667 244.5L44.7488 281.918C43.9153 282.751 43.4985 283.168 43.1817 283.648C42.9006 284.075 42.6784 284.537 42.5212 285.023C42.344 285.57 42.2789 286.156 42.1487 287.328L41.0833 296.917Z"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M93.5 182C93.5 196.083 82.0834 207.5 68 207.5C64.6082 207.5 61.3708 206.838 58.4106 205.635C57.844 205.405 57.5607 205.29 57.3317 205.239C57.1077 205.189 56.9419 205.17 56.7124 205.17C56.4777 205.17 56.2221 205.213 55.7108 205.298L45.6302 206.978C44.5745 207.154 44.0467 207.242 43.665 207.078C43.331 206.935 43.0648 206.669 42.9215 206.335C42.7578 205.953 42.8458 205.425 43.0217 204.37L44.7018 194.289C44.787 193.778 44.8296 193.522 44.8296 193.288C44.8296 193.058 44.8112 192.892 44.761 192.668C44.7097 192.439 44.5946 192.156 44.3645 191.589C43.1623 188.629 42.5 185.392 42.5 182C42.5 167.917 53.9167 156.5 68 156.5C82.0834 156.5 93.5 167.917 93.5 182Z"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <motion.div
        initial={{ y: 100 }}
        whileInView={{ y: 60 }}
        className="max-w-sm md:max-w-2xl w-full h-[460px] aspect-video z-20 rounded-3xl absolute border border-neutral-200 flex flex-col shadow-xl bg-white py-3"
      >
        <div className="flex items-center h-6 justify-end w-full gap-2 px-4 border-b border-neutral-200 pb-2 ">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="size-4 bg-neutral-200 rounded-full" />
          ))}
        </div>
        <div className="flex items-center justify-center flex-row-reverse w-full gap-2 px-3 border-b border-neutral-200 py-2 ">
          <div className="flex items-center justify-center gap-x-2">
            <Button
              variant={"outline"}
              size="icon"
              className={cn("rounded-full size-8 ")}
            >
              <Plug className="text-neutral-400" />
            </Button>
            <motion.div
              initial={{ x: 400, y: 500, opacity: 1 }}
              animate={controls}
              className=" absolute size-6"
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9999 12.9999L18.9999 18.9999M17.964 10.7512L12.9533 12.4531C12.8163 12.4996 12.7478 12.5229 12.6908 12.562C12.6404 12.5967 12.5967 12.6404 12.562 12.6908C12.5229 12.7478 12.4996 12.8163 12.4531 12.9533L10.7512 17.964C10.5402 18.5854 10.4346 18.896 10.2696 18.99C10.1267 19.0713 9.95281 19.0772 9.80468 19.0056C9.63374 18.923 9.50756 18.6201 9.25521 18.0144L3.74699 4.79312C3.51283 4.23109 3.39576 3.95007 3.45272 3.77426C3.50214 3.62172 3.62172 3.50214 3.77426 3.45272C3.95007 3.39576 4.23109 3.51283 4.79312 3.74699L18.0144 9.25521C18.6201 9.50756 18.923 9.63374 19.0056 9.80468C19.0772 9.95281 19.0713 10.1267 18.99 10.2696C18.896 10.4346 18.5854 10.5402 17.964 10.7512Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <Button
              variant={"outline"}
              size="icon"
              className="rounded-full size-8"
            >
              <Download className="text-neutral-400" />
            </Button>
            <Button
              variant={"outline"}
              size="icon"
              className="rounded-full size-8"
            >
              <MoreVertical className="text-neutral-400" />
            </Button>
          </div>
          <div className="bg-neutral-100 flex items-center justify-start px-2 rounded-xl w-full h-6"></div>
          <div className="flex items-center justify-center gap-x-2">
            <Button
              variant={"outline"}
              size="icon"
              className={cn("rounded-full size-8 ")}
            >
              <ArrowLeft className="text-neutral-400" />
            </Button>
            <Button
              variant={"outline"}
              size="icon"
              className={cn("rounded-full size-8 ")}
            >
              <ArrowRight className="text-neutral-400" />
            </Button>
            <Button
              variant={"outline"}
              size="icon"
              className="rounded-full size-8"
            >
              <RefreshCcw className="text-neutral-400" />
            </Button>
          </div>
        </div>
        <img
          src="https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/5432d425-ce11-4ac8-9a9e-2ed0825d5103/5.png"
          className="z-0 opacity-20 w-full h-full object-cover "
          alt=""
        />
      </motion.div>
    </div>
  );
}
const BeyondFeed = ({ isHovered }: FeatureProps) => {
  return (
    <div className="w-full h-full  relative  overflow-hidden flex items-center justify-center">
      {[...Array(3)].map((_, i) => {
        const isCenter = i === 1;
        return (
          <motion.div
            key={i}
            initial={{ y: 200 }}
            whileInView={
              // isHovered
              //   ?
              {
                y: isCenter ? 100 : 140,
                x: isCenter ? 0 : i === 0 ? 60 : -60,
                rotate: isCenter ? 0 : i === 0 ? 6 : -6,
              }
              // :
            }
            style={{
              zIndex: isCenter ? 20 : 10,
            }}
            className="w-1/2 absolute z-[2] rounded-3xl  bg-white  border border-neutral-200 shadow-md   h-[340px]  overflow-hidden"
          >
            <div className="flex py-3 px-4 h-full flex-col items-center justify-start">
              {isCenter && (
                <div className="flex items-center justify-start w-full gap-2 ">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="size-4 bg-neutral-200 rounded-full"
                    />
                  ))}
                </div>
              )}
              <div className="items-center justify-center flex h-full w-full "></div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const Icons = {
  notion: () => (
    <svg
      viewBox="0 -4 48 48"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>Twitter-color</title> <desc>Created with Sketch.</desc>{" "}
        <defs> </defs>{" "}
        <g
          id="Icons"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          {" "}
          <g
            id="Color-"
            transform="translate(-300.000000, -164.000000)"
            fill="#00AAEC"
          >
            {" "}
            <path
              d="M348,168.735283 C346.236309,169.538462 344.337383,170.081618 342.345483,170.324305 C344.379644,169.076201 345.940482,167.097147 346.675823,164.739617 C344.771263,165.895269 342.666667,166.736006 340.418384,167.18671 C338.626519,165.224991 336.065504,164 333.231203,164 C327.796443,164 323.387216,168.521488 323.387216,174.097508 C323.387216,174.88913 323.471738,175.657638 323.640782,176.397255 C315.456242,175.975442 308.201444,171.959552 303.341433,165.843265 C302.493397,167.339834 302.008804,169.076201 302.008804,170.925244 C302.008804,174.426869 303.747139,177.518238 306.389857,179.329722 C304.778306,179.280607 303.256911,178.821235 301.9271,178.070061 L301.9271,178.194294 C301.9271,183.08848 305.322064,187.17082 309.8299,188.095341 C309.004402,188.33225 308.133826,188.450704 307.235077,188.450704 C306.601162,188.450704 305.981335,188.390033 305.381229,188.271578 C306.634971,192.28169 310.269414,195.2026 314.580032,195.280607 C311.210424,197.99061 306.961789,199.605634 302.349709,199.605634 C301.555203,199.605634 300.769149,199.559408 300,199.466956 C304.358514,202.327194 309.53689,204 315.095615,204 C333.211481,204 343.114633,188.615385 343.114633,175.270495 C343.114633,174.831347 343.106181,174.392199 343.089276,173.961719 C345.013559,172.537378 346.684275,170.760563 348,168.735283"
              id="Twitter"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  ),
  googleDrive: () => (
    <svg
      viewBox="-3 0 262 262"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          fill="#4285F4"
        ></path>
        <path
          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          fill="#34A853"
        ></path>
        <path
          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
          fill="#FBBC05"
        ></path>
        <path
          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          fill="#EB4335"
        ></path>
      </g>
    </svg>
  ),
  whatsapp: () => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M16 2C8.27812 2 2 8.27812 2 16C2 23.7219 8.27812 30 16 30C23.7219 30 30 23.7219 30 16C30 8.27812 23.7219 2 16 2Z"
          fill="#FC471E"
        ></path>{" "}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.0193 8.90951C20.0066 8.98984 20 9.07226 20 9.15626C20 10.0043 20.6716 10.6918 21.5 10.6918C22.3284 10.6918 23 10.0043 23 9.15626C23 8.30819 22.3284 7.6207 21.5 7.6207C21.1309 7.6207 20.7929 7.7572 20.5315 7.98359L16.6362 7L15.2283 12.7651C13.3554 12.8913 11.671 13.4719 10.4003 14.3485C10.0395 13.9863 9.54524 13.7629 9 13.7629C7.89543 13.7629 7 14.6796 7 15.8103C7 16.5973 7.43366 17.2805 8.06967 17.6232C8.02372 17.8674 8 18.1166 8 18.3696C8 21.4792 11.5817 24 16 24C20.4183 24 24 21.4792 24 18.3696C24 18.1166 23.9763 17.8674 23.9303 17.6232C24.5663 17.2805 25 16.5973 25 15.8103C25 14.6796 24.1046 13.7629 23 13.7629C22.4548 13.7629 21.9605 13.9863 21.5997 14.3485C20.2153 13.3935 18.3399 12.7897 16.2647 12.7423L17.3638 8.24143L20.0193 8.90951ZM12.5 18.8815C13.3284 18.8815 14 18.194 14 17.3459C14 16.4978 13.3284 15.8103 12.5 15.8103C11.6716 15.8103 11 16.4978 11 17.3459C11 18.194 11.6716 18.8815 12.5 18.8815ZM19.5 18.8815C20.3284 18.8815 21 18.194 21 17.3459C21 16.4978 20.3284 15.8103 19.5 15.8103C18.6716 15.8103 18 16.4978 18 17.3459C18 18.194 18.6716 18.8815 19.5 18.8815ZM12.7773 20.503C12.5476 20.3462 12.2372 20.4097 12.084 20.6449C11.9308 20.8802 11.9929 21.198 12.2226 21.3548C13.3107 22.0973 14.6554 22.4686 16 22.4686C17.3446 22.4686 18.6893 22.0973 19.7773 21.3548C20.0071 21.198 20.0692 20.8802 19.916 20.6449C19.7628 20.4097 19.4524 20.3462 19.2226 20.503C18.3025 21.1309 17.1513 21.4449 16 21.4449C15.3173 21.4449 14.6345 21.3345 14 21.1137C13.5646 20.9621 13.1518 20.7585 12.7773 20.503Z"
          fill="white"
        ></path>{" "}
      </g>
    </svg>
  ),
  googleDocs: () => (
    <svg
      viewBox="0 -2 44 44"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>LinkedIn-color</title> <desc>Created with Sketch.</desc>{" "}
        <defs> </defs>{" "}
        <g
          id="Icons"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          {" "}
          <g
            id="Color-"
            transform="translate(-702.000000, -265.000000)"
            fill="#007EBB"
          >
            {" "}
            <path
              d="M746,305 L736.2754,305 L736.2754,290.9384 C736.2754,287.257796 734.754233,284.74515 731.409219,284.74515 C728.850659,284.74515 727.427799,286.440738 726.765522,288.074854 C726.517168,288.661395 726.555974,289.478453 726.555974,290.295511 L726.555974,305 L716.921919,305 C716.921919,305 717.046096,280.091247 716.921919,277.827047 L726.555974,277.827047 L726.555974,282.091631 C727.125118,280.226996 730.203669,277.565794 735.116416,277.565794 C741.21143,277.565794 746,281.474355 746,289.890824 L746,305 L746,305 Z M707.17921,274.428187 L707.117121,274.428187 C704.0127,274.428187 702,272.350964 702,269.717936 C702,267.033681 704.072201,265 707.238711,265 C710.402634,265 712.348071,267.028559 712.41016,269.710252 C712.41016,272.34328 710.402634,274.428187 707.17921,274.428187 L707.17921,274.428187 L707.17921,274.428187 Z M703.109831,277.827047 L711.685795,277.827047 L711.685795,305 L703.109831,305 L703.109831,277.827047 L703.109831,277.827047 Z"
              id="LinkedIn"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  ),
  zapier: () => (
    <svg
      viewBox="0 -7 48 48"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>Youtube-color</title> <desc>Created with Sketch.</desc>{" "}
        <defs> </defs>{" "}
        <g
          id="Icons"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          {" "}
          <g
            id="Color-"
            transform="translate(-200.000000, -368.000000)"
            fill="#CE1312"
          >
            {" "}
            <path
              d="M219.044,391.269916 L219.0425,377.687742 L232.0115,384.502244 L219.044,391.269916 Z M247.52,375.334163 C247.52,375.334163 247.0505,372.003199 245.612,370.536366 C243.7865,368.610299 241.7405,368.601235 240.803,368.489448 C234.086,368 224.0105,368 224.0105,368 L223.9895,368 C223.9895,368 213.914,368 207.197,368.489448 C206.258,368.601235 204.2135,368.610299 202.3865,370.536366 C200.948,372.003199 200.48,375.334163 200.48,375.334163 C200.48,375.334163 200,379.246723 200,383.157773 L200,386.82561 C200,390.73817 200.48,394.64922 200.48,394.64922 C200.48,394.64922 200.948,397.980184 202.3865,399.447016 C204.2135,401.373084 206.612,401.312658 207.68,401.513574 C211.52,401.885191 224,402 224,402 C224,402 234.086,401.984894 240.803,401.495446 C241.7405,401.382148 243.7865,401.373084 245.612,399.447016 C247.0505,397.980184 247.52,394.64922 247.52,394.64922 C247.52,394.64922 248,390.73817 248,386.82561 L248,383.157773 C248,379.246723 247.52,375.334163 247.52,375.334163 L247.52,375.334163 Z"
              id="Youtube"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  ),
  messenger: () => (
    <svg
      viewBox="0 0 48 48"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>Pinterest-color</title> <desc>Created with Sketch.</desc>{" "}
        <defs> </defs>{" "}
        <g
          id="Icons"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          {" "}
          <g
            id="Color-"
            transform="translate(-300.000000, -260.000000)"
            fill="#CC2127"
          >
            {" "}
            <path
              d="M324.001411,260 C310.747575,260 300,270.744752 300,284.001411 C300,293.826072 305.910037,302.270594 314.368672,305.982007 C314.300935,304.308344 314.357382,302.293173 314.78356,300.469924 C315.246428,298.522491 317.871229,287.393897 317.871229,287.393897 C317.871229,287.393897 317.106368,285.861351 317.106368,283.59499 C317.106368,280.038808 319.169518,277.38296 321.73505,277.38296 C323.91674,277.38296 324.972306,279.022755 324.972306,280.987123 C324.972306,283.180102 323.572411,286.462515 322.852708,289.502205 C322.251543,292.050803 324.128418,294.125243 326.640325,294.125243 C331.187158,294.125243 334.249427,288.285765 334.249427,281.36532 C334.249427,276.10725 330.707356,272.170048 324.263891,272.170048 C316.985006,272.170048 312.449462,277.59746 312.449462,283.659905 C312.449462,285.754101 313.064738,287.227377 314.029988,288.367613 C314.475922,288.895396 314.535191,289.104251 314.374316,289.708238 C314.261422,290.145705 313.996119,291.21256 313.886047,291.633092 C313.725172,292.239901 313.23408,292.460046 312.686541,292.234256 C309.330746,290.865408 307.769977,287.193509 307.769977,283.064385 C307.769977,276.248368 313.519139,268.069148 324.921503,268.069148 C334.085729,268.069148 340.117128,274.704533 340.117128,281.819721 C340.117128,291.235138 334.884459,298.268478 327.165285,298.268478 C324.577174,298.268478 322.138649,296.868584 321.303228,295.279591 C321.303228,295.279591 319.908979,300.808608 319.615452,301.875463 C319.107426,303.724114 318.111131,305.575587 317.199506,307.014994 C319.358617,307.652849 321.63909,308 324.001411,308 C337.255248,308 348,297.255248 348,284.001411 C348,270.744752 337.255248,260 324.001411,260"
              id="Pinterest"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  ),
};

const DiscoverBeyond = ({ isHovered }: FeatureProps) => {
  const [cards, setCards] = useState(Object.entries(Icons));
  const [front, setFront] = useState(0);
  const [prev, setPrev] = useState(1);
  const [direction, setDirection] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setFront((prev) => {
        return (prev + 1) % cards.length;
      });

      setPrev((prev) => {
        return (prev + 1) % cards.length;
      });
      setDirection((prev) => (prev === 1 ? -1 : 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [cards.length]);
  return (
    <div className="w-full h-full relative overflow-hidden flex  items-center justify-center pb-12">
      {[...Array(4)].map((_, i) => {
        const scaleX = 1 - i * 0.04;
        return (
          <motion.div
            key={i}
            style={{
              scaleX,
              zIndex: 3 - i,
            }}
            initial={{ y: i * -10 }}
            animate={
              isHovered
                ? {
                    y: i * -24,
                  }
                : {
                    y: i * -10,
                  }
            }
            className="max-w-[280px] bottom-12 border border-neutral-200 py-3 w-full absolute rounded-3xl shadow-xl bg-white h-[200px]"
          >
            <div className="flex border-b border-neutral-200 px-3 pb-2 items-center justify-start gap-2 w-full ">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="size-4 bg-neutral-200 rounded-full " />
              ))}
            </div>
            <div className="flex items-center justify-center h-full w-full">
              <div className="relative size-12">{cards[prev]?.[1]()}</div>
            </div>
          </motion.div>
        );
      })}
      <AnimatePresence>
        <motion.div
          key={front}
          style={{ zIndex: 20 }}
          initial={{ x: 0, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          // animate={{
          //   scale: 1,
          // }}
          animate={{
            scale: 0.9,
            x: direction === 1 ? [0, -600] : [0, 600],
            y: 10,
            rotate: direction === 1 ? [0, -6, -10] : [0, 6, 10],
          }}
          className="max-w-xs bottom-12 border border-neutral-200 py-3 w-full absolute rounded-3xl shadow-xl bg-white h-[200px]"
        >
          <div className="flex border-b border-neutral-200 px-3 pb-2 items-center justify-start gap-2 w-full ">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="size-4 bg-neutral-200 rounded-full " />
            ))}
          </div>
          <div className="flex items-center justify-center h-full w-full">
            <div className="relative size-12">{cards[front]?.[1]()}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Features;
