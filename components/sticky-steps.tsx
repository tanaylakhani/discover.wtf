import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const steps = [
  {
    title: "Open a Tab and Step Into a Curated Feed ",
    video: "/card1.mp4",
  },
  {
    title: "Swipe Through Sites No Followers Needed",
    video: "/card2.mp4",
  },
  {
    title: "Save What you like and Build your Internet Shelf",
    video: "/card3.mp4",
  },
  //   {
  //     title: "Open a New Tab and Step Into a Curated Feed of the Web",
  //     video: "/asset.mp4",
  //   },
  //   {
  //     title: "Swipe Through Surprisingly Good Sites — No Follower Graph Needed",
  //     video: "/asset1.mp4",
  //   },
  //   {
  //     title: "Save What Speaks to You and Build a Personal Internet Shelf",
  //     video: "/asset2.png",
  //   },
  //   {
  //     title:
  //       "React, Comment, and Rediscover Together with the Internet’s Curious Few",
  //     video: "/videos/step6-social.mp4",
  //   },
];

const StickySteps = () => {
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const offsets = stepRefs.current.map((ref) => {
        if (!ref) return Infinity;
        const rect = ref.getBoundingClientRect();
        return Math.abs(rect.top - 100);
      });
      const minOffset = Math.min(...offsets);
      const newStep = offsets.findIndex((offset) => offset === minOffset);
      if (newStep !== -1 && newStep !== currentStep) {
        setCurrentStep(newStep);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentStep]);

  const bgs = [
    "bg-blue-400",
    "bg-red-400",
    "bg-yellow-300",
    "bg-lime-400",
    "bg-indigo-500",
  ];
  return (
    <>
      <section className="w-full hidden md:flex flex-col-reverse max-w-5xl mx-auto md:flex-row py-[100px]  items-start justify-center h-[calc(1400px)]">
        <div className="md:w-1/2 w-full pl-10 mt-[200px]">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              className={cn(
                "h-[200px] w-[300px] flex items-center justify-center",
                currentStep === index
                  ? " text-black"
                  : "blur-[3px] text-neutral-600"
              )}
            >
              <div className="flex items-center justify-center h-full">
                <h3 className="text-3xl mx-auto font-bold tracking-tight">
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            transition: "background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className={cn(
            "md:w-1/2 w-full sticky top-10  overflow-hidden h-[600px] flex items-center justify-center border border-neutral-200 rounded-3xl"
          )}
        >
          <AnimatePresence key={currentStep}>
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="size-full flex relative items-center justify-center "
            >
              {steps[currentStep]?.video && (
                <video
                  src={steps[currentStep].video}
                  controls={false}
                  autoPlay
                  className="absolute "
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default StickySteps;
