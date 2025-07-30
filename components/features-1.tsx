import { cn } from "@/lib/utils";
import {
  motion,
  MotionValue,
  useAnimation,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Ripple } from "./magicui/ripple";
import { Button } from "./ui/button";

const features = [
  {
    title: "Swipe Your way \n Through the Web",
    tagline: "One gesture discovery",
    content:
      "Discover the most fascinating corners of the internet by simply swiping. No search box, no followers, just a feed that gets you.",
    animation: "Card swipe with spring transition and fade in next",
    points: [
      "Endless discovery with a single swipe",
      "No login, no social graph needed",
      "Instant dopamine for curious minds",
    ],
  },
  {
    title: "Your Browser,\n Reimagined",
    points: [
      "Turn new tabs into inspiration surfaces",
      "Swipe the web natively in your browser",
      "Uncover daily gems from the indie web",
    ],
    tagline: "Not just a tool. A vibe.",
    content:
      "Turn your browser into a discovery canvas. Discover.wtf reclaims the new tab, transforming it into a daily dose of curiosity, color, and culture.",
    animation: "Tab transforms into moodboard with staggered tiles",
  },
  {
    title: "Curated by Creators,\n Not Algorithms Alone",
    tagline: "Playlists of the internet",
    content:
      "Discover themed collections made by creators like you. Think Web Playlists, Link Reels, and Moodboards built to explore ideas, not just trends.",
    points: [
      "Follow curators instead of algorithms",
      "Explore themed Link Reels & Web Playlists",
      "Internet as cultural experience",
    ],
    animation: "Horizontal scroll with expanding playlists on hover",
  },
];
const Features1 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    axis: "y",
    target: ref,
    offset: ["start start", "end end"],
  });

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scaledIndex, setScaledIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="max-w-5xl font-inter w-full relative mx-auto px-4 pt-20 pb-10 space-y-16"
    >
      {features.map((feature, index) => {
        return (
          <FeatCard
            key={index}
            scrollYProgress={scrollYProgress}
            isScaled={scaledIndex === index}
            ref={(el) => (cardRefs.current![index] = el!) as any}
            content={feature.content}
            index={index}
            tagline={feature.tagline}
            points={feature.points}
            title={feature.title}
          />
        );
      })}
      {/* </div> */}
      {/* <div className="absolute -z-10 w-96 h-96 bg-gradient-to-r from-indigo-200 to-blue-300 rounded-full blur-[80px] "></div>
      <div className="absolute -z-10 w-80 h-80 bg-gradient-to-r from-pink-200 to-violet-300 rounded-full blur-[80px] top-10 right-0"></div> */}
    </section>
  );
};

export default Features1;

type Feature = {
  title: string;
  content: string;
  tagline: string;
  index: number;
  isScaled: boolean;
  points: string[];
  scrollYProgress: MotionValue<number>;
};
const FeatCard = forwardRef<HTMLDivElement, Feature>(
  ({ content, index, points, title, scrollYProgress }, ref) => {
    const targetScale = 1 - (features.length - index) * 0.05;
    const scale = useTransform(
      scrollYProgress,
      [index * 0.5, 1],
      [1, targetScale]
    );

    return (
      <motion.div
        key={index}
        ref={ref}
        style={{
          top: 100 + index * 30,
          scale: scale,
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.2,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className={cn(
          "flex items-center   flex-col md:flex-row rounded-3xl border  sticky  md:even:flex-row-reverse overflow-hidden group justify-between w-full h-[700px]  md:h-[400px] bg-white border-neutral-300"
          // index === 0 && "bg-yellow-50",
          // index === 1 && "bg-blue-50",
          // index === 2 && "bg-pink-50"
        )}
      >
        <motion.div
          // style={{ opacity }}
          className="flex flex-1 p-6 md:py-6 md:px-10 md:mt-6 flex-col justify-start h-full  items-start md:mr-10 md:group-even:ml-10"
        >
          <h3 className="text-2xl font-inter font-semibold md:font-medium mt-4 text-left tracking-tight leading-tight">
            {title.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h3>
          <p className="mt-4 md:text-lg font-inter font-medium text-neutral-700 dark:text-neutral-400 leading-tight tracking-tight">
            {content}
          </p>
          <div className="mt-2 font-inter">
            {points.map((point, i) => {
              return (
                <div key={i} className="flex items-center mt-2">
                  <Check className="inline bg-green-500 w-5 h-5 stroke-white rounded-full p-1 mr-2" />
                  <span className=" font-medium text-neutral-800 dark:text-neutral-400 leading-snug tracking-tight">
                    {point}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
        {/* <div className=" ml-10"> */}
        <motion.div
          // style={{ opacity }}
          className=" mt-6 md:mt-0 rounded-3xl relative   md:max-w-md w-full h-full "
        >
          {index === 0 && <Box1 />}
          {index === 1 && (
            <>
              {/* <div className="bg-gradient-to-br z-0 from-blue-300 via-blue-100 to-transparent absolute -top-6 -left-6 size-[400px] blur-3xl" /> */}
              <Box3 />
            </>
          )}
          {index === 2 && (
            <>
              {/* <div className="bg-gradient-to-tl from-green-300 to-lime-200 absolute -bottom-6 -right-6 size-[400px] blur-3xl" /> */}
              <Ripple className="absolute text-lime-600 inset-0 z-0" />
              <Box2 />
            </>
          )}
        </motion.div>
        {/* </div> */}
      </motion.div>
    );
  }
);

const Box1 = () => {
  const cards = [
    {
      title: "Do you suffer from Decision Fatigue?",
      content:
        "Discover.wtf is a browser extension that helps you discover new content without the hassle of decision fatigue. Swipe through a curated feed of interesting links and find your next obsession.",
    },
    {
      title: "Interaction Design 101",
      content:
        "Discover.wtf is designed to be intuitive and easy to use. Simply swipe left or right to discover new content, and click on a link to open it in a new tab. No more endless scrolling or decision fatigue.",
    },
    {
      title: "A New Way to Discover",
      content:
        "Discover.wtf is a new way to discover content on the web. It’s like Tinder for the internet, but without the swiping left or right. Just swipe through a feed of interesting links and find your next obsession.",
    },
    {
      title: "Inside the Mind of the greats",
      content:
        "Discover.wtf is inspired by the greats of the past. It’s a tribute to the pioneers of the internet, and a celebration of the creativity and innovation that has made the web what it is today.",
    },
    {
      title: "A New Way to Discover",
      content:
        "Discover.wtf is a new way to discover content on the web. It’s like Tinder for the internet, but without the swiping left or right. Just swipe through a feed of interesting links and find your next obsession.",
    },
  ];
  return (
    <div className="w-full h-full flex items-center  justify-center relative overflow-hidden">
      {cards.map((card, i) => {
        const isEven = i % 2 === 0;
        return (
          <motion.div
            key={i}
            style={{
              zIndex: 6 - i,
            }}
            className={cn(
              "absolute flex flex-col h-[260px] p-3 bottom-28 bg-white border border-neutral-200 w-[240px]  rounded-3xl",
              i < 3 && "shadow-lg"
            )}
            initial={{
              x: isEven ? -400 : 400,
              rotate: isEven ? -12 : 12,
              opacity: 0,
            }}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            animate={{ x: 0, rotate: isEven ? -6 : 6, opacity: 1 }}
            transition={{
              duration: 1,
              delay: i * 0.3,
              type: "spring",
              ease: [0.4, 0, 0.2, 1],
              stiffness: 100,
              damping: 20,
            }}
          >
            {i === 0 && (
              <motion.div className="">
                <div className="border-2 border-neutral-200 rounded-2xl overflow-hidden">
                  <img
                    src="https://framerusercontent.com/images/aN9Tbj16rkWbBsWmnUlDK2kA6Po.png"
                    alt=""
                  />
                  {/* <img src={"/gradient.png"} /> */}
                </div>
                <div className="flex px-2 flex-col gap-y-2 mt-2">
                  <h2 className="text-sm font-medium tracking-tight leading-tight">
                    Fabric – your self-organizing workspace and file explorer
                  </h2>
                  <p className="text-sm text-neutral-500 leading-tight  line-clamp-3">
                    One home for your digital world. Your second brain. A file
                    explorer and workspace for the internet age. All your
                    drives, clouds, notes, screenshots, links, and files in one
                    calm, minimal app. No organizing required. Never forget
                    anything again.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
      {/* <motion.div className="absolute bottom-8 flex items-center justify-center gap-x-3  rounded-full px-4 py-2 ">
        <Button
          className="shadow-xl rounded-full [&_svg]:size-5"
          size={"icon"}
          variant={"outline"}
        >
          <ChevronLeft className="size-6 opacity-80" />
        </Button>
        <Button
          className="shadow-xl rounded-full [&_svg]:size-5"
          size={"icon"}
          variant={"outline"}
        >
          <ChevronRight className="size-6 opacity-80" />
        </Button>
        <Button
          className="shadow-xl rounded-full [&_svg]:size-5"
          size={"icon"}
          variant={"outline"}
        >
          <Heart className="size-6 opacity-80" />
        </Button>
        <Button
          className="shadow-xl rounded-full [&_svg]:size-5"
          size={"icon"}
          variant={"outline"}
        >
          <Bookmark className="size-6 opacity-80" />
        </Button>
      </motion.div> */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.5,
          duration: 0.4,
          ease: "easeInOut",
        }}
        className=" mt-4 rounded-full border border-neutral-200 absolute bottom-8  w-[160px]"
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
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M106.648 31.5C116.628 31.5 123.333 40.9988 123.333 49.86C123.333 67.8058 95.5039 82.5 95.0001 82.5C94.4963 82.5 66.6667 67.8058 66.6667 49.86C66.6667 40.9988 73.3723 31.5 83.3519 31.5C89.0816 31.5 92.8278 34.4006 95.0001 36.9506C97.1724 34.4006 100.919 31.5 106.648 31.5Z"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M228.5 57C228.5 71.0834 217.083 82.5 203 82.5C199.608 82.5 196.371 81.8379 193.411 80.6354C192.844 80.4053 192.561 80.2903 192.332 80.239C192.108 80.1889 191.942 80.1704 191.712 80.1704C191.478 80.1704 191.222 80.2129 190.711 80.2982L180.63 81.9784C179.575 82.1543 179.047 82.2422 178.665 82.0784C178.331 81.9353 178.065 81.669 177.921 81.3349C177.758 80.9533 177.846 80.4254 178.022 79.3697L179.702 69.2893C179.787 68.7779 179.83 68.5223 179.83 68.2877C179.83 68.0579 179.811 67.8922 179.761 67.6684C179.71 67.4394 179.595 67.1561 179.365 66.5894C178.162 63.6292 177.5 60.3918 177.5 57C177.5 42.9167 188.917 31.5 203 31.5C217.083 31.5 228.5 42.9167 228.5 57Z"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
};
const Box2 = () => {
  const containerRef = useRef(null);

  // Get scroll progress relative to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end 400px"],
  });
  const imgs = [
    "/avatar-1.png",
    "/avatar-2.png",
    // "/avatar-3.png",
    "/avatar-4.png",
  ];
  const positons = [
    {
      initial: { x: -300, y: -500, rotate: -6 },
      animate: { x: -130, y: -120, rotate: -12 },
    },
    {
      initial: { x: -300, y: 500 },
      animate: { x: -170, y: 150 },
    },
    {
      initial: { x: 300, y: 500, rotate: 6 },
      animate: { x: 160, y: 100, rotate: 12 },
    },
  ];

  const cards = [
    {
      link: "https://dub.sh",
      title: "Dub.sh",
      content:
        "Dub.sh is a link shortener that allows you to create short links for your website.",
      image:
        "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/c0d4398d-50f4-46d3-ba1d-eb97d0e1b07c/3.png",
    },
    {
      link: "https://potrait.so",
      title: "Potrait",
      content: "Your forever space for everything you are.",
      image:
        "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/0a1cf565-6255-4aae-97f3-3e09af357a4e/3.png",
    },
    {
      link: "https://chester.how",
      title: "🍃Chester's Garden",
      content:
        "Chester's Garden is a collection of links to Chester's favorite websites.",
      image:
        "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/4d7df8f6-7af3-4fbb-b310-164b04330c35/4.png",
    },
  ];

  const y = useTransform(scrollYProgress, [0, 1], [20, -250]);
  return (
    <div className="w-full gap-4 h-full flex px-2 pt-2 items-center  justify-center relative overflow-hidden">
      {imgs.map((img, i) => {
        const x = useTransform(
          scrollYProgress,
          [0, 0.5],
          [positons[i].initial.x, positons[i].animate.x]
        );
        const y = useTransform(
          scrollYProgress,
          [0, 0.5],
          [positons[i].initial.y, positons[i].animate.y]
        );
        const rotate = useTransform(
          scrollYProgress,
          [0, 0.5],
          [positons[i].initial.rotate || 0, positons[i].animate.rotate || 0]
        );
        const spring = {
          x,
          y,
          rotate: useSpring(rotate, {
            stiffness: 100,
            damping: 50,
          }),
        };
        return (
          <motion.div
            key={i}
            style={{ ...spring, zIndex: 50 }}
            className="size-20 flex items-center overflow-hidden z-[1] justify-center absolute"
          >
            <Image fill style={{ objectFit: "cover" }} src={img} alt="" />
          </motion.div>
        );
      })}
      <motion.div
        ref={containerRef}
        style={{ borderRadius: "50px" }}
        initial={{ bottom: -260 }}
        whileInView={{ bottom: -200 }}
        className="max-w-xs border-[12px] aspect-[9/16] overflow-hidden bg-neutral-100  border-black h-[520px] absolute  w-full"
      >
        <motion.div
          style={{ y: useSpring(y, { stiffness: 200, damping: 50 }) }}
          className="flex flex-col w-full h-full px-6  items-center justify-start gap-y-6 "
        >
          {[...cards, ...cards, ...cards, ...cards, ...cards, ...cards].map(
            (card, i) => {
              return (
                <motion.div
                  key={i}
                  style={{
                    width: "240px",
                    // height: "220px",
                  }}
                  className=" w-full bg-white border-2 shadow-xl rounded-3xl border-neutral-200 p-3 flex flex-col justify-between flex-shrink-0"
                >
                  <img
                    src={card.image}
                    className=" w-full border border-neutral-200 rounded-3xl"
                    alt=""
                  />
                  {/* {i} */}
                </motion.div>
              );
            }
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Box3 = () => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: false,
    margin: "0px 0px -300px 0px",
  }); // set once: true if you want it to happen only once
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      (async () => {
        await controls.start({
          y: 0,
          scale: 1,
          opacity: 1,
        });
        await controls.start({
          x: -100,
          y: 100,
          scale: 1.6,
          transition: {
            duration: 0.8,
          },
        });
      })();
    } else {
      controls.start({
        y: 400,
        x: 0,
        scale: 0.8,
        opacity: 0.8,
      });
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
    >
      <motion.div
        initial={{
          y: 400,
          scale: 0.8,
          opacity: 0.8,
        }}
        animate={controls}
        className="absolute max-w-[280px] h-[220px] shadow-xl w-full bg-white border border-neutral-200 rounded-3xl py-3 z-10"
      >
        <div className="flex px-4 items-center justify-end gap-x-2">
          {Array.from({ length: 3 }).map((_, i) => {
            return (
              <div key={i} className="size-4 bg-neutral-200 rounded-full" />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
