import React from "react";

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
  );
};

export default Stats;
