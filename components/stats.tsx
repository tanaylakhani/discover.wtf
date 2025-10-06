import React, { Fragment } from "react";

const Stats = () => {
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
    <section className="w-full relative  mt-20  font-inter flex flex-col items-center justify-start min-screen ">
      <div className="max-w-5xl flex  flex-col py-10 rounded-3xl  items-center justify-evenly w-full mx-auto">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium md:font-semibold text-black text-center tracking-tight font-inter leading-tight">
          Unlock your real discovery <br />
          Potential with
          <span className="bg-gradient-to-t ml-2 font-instrument-serif lg:text-6xl bg-clip-text text-transparent from-orange-500 font-light via-orange-600 to-orange-400">
            Discover.wtf
          </span>{" "}
        </h3>
        <div className="flex rounded-3xl max-w-md md:max-w-5xl flex-col border border-neutral-200 p-2 gap-4 md:gap-6 md:flex-row  items-center justify-evenly mt-16 w-full ">
          {discoverStats?.map((stat, i) => {
            return (
              <Fragment key={i}>
                <div className="w-full border h-full border-neutral-200 rounded-2xl flex flex-col p-8 items-center justify-center relative">
                  <div className="md:h-1 md:w-10 h-10 w-1 rounded-full bg-orange-500 absolute md:-top-0.5 md:right-0 md:left-0 -left-0.5 mx-auto" />
                  <div className="md:h-1 md:w-10 h-10 w-1 rounded-full bg-orange-500 absolute md:-bottom-0.5 md:right-0 md:left-0 -right-0.5 mx-auto" />
                  <div className="absolute inset-0 -z-10 h-full w-full bg-neutral-50 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.2px)] [background-size:16px_16px]"></div>
                  <h3 className="tracking-tight text-4xl text-neutral-800 font-semibold ">
                    {stat?.value}
                  </h3>
                  <span className="text-base mt-2 text-neutral-600 font-medium ">
                    {stat?.label}
                  </span>
                </div>
                <div className="md:h-12 h-0.5 w-16 md:w-1.5 rounded-full bg-neutral-200 last:hidden mx-auto" />
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
