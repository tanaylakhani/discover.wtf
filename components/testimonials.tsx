import React, { FC, useState } from "react";
import { TweetCard } from "./magicui/tweet-card";
import { cn } from "@/lib/utils";
import { Marquee } from "./magicui/marquee";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import test from "node:test";
import { title } from "process";

const Testimonials = () => {
  type Testimonial = {
    name: string;
    content: string;
    image: string;
    subtitle: string;
  };

  const testimonials: Testimonial[] = [
    {
      name: "Aarav Shah",
      content:
        "discover.wtf helped me find indie tools I would've never stumbled across on Product Hunt. It's like a backstage pass to the maker world.",
      image: "/testimonials/aarav.jpg",
      subtitle: "Founder, SoloForge",
    },
    {
      name: "Neha Kapoor",
      content:
        "This platform surfaces raw, authentic software by passionate builders. It’s where creativity lives before it hits the mainstream.",
      image: "/testimonials/neha.jpg",
      subtitle: "Community Lead, MakersUnite",
    },
    {
      name: "Kabir Mehta",
      content:
        "As someone constantly exploring niche tools, discover.wtf feels like home. The algorithm-free discovery is a breath of fresh air.",
      image: "/testimonials/kabir.jpg",
      subtitle: "No-Code Educator",
    },
    {
      name: "Saanvi Iyer",
      content:
        "discover.wtf is where you go to *feel* the vibe of the internet again — crafted tools, unapologetically real.",
      image: "/testimonials/saanvi.jpg",
      subtitle: "Digital Minimalist & Curator",
    },
    {
      name: "Neha Kapoor",
      content:
        "This platform surfaces raw, authentic software by passionate builders. It’s where creativity lives before it hits the mainstream.",
      image: "/testimonials/neha.jpg",
      subtitle: "Community Lead, MakersUnite",
    },
    {
      name: "Ishaan Verma",
      content:
        "I’ve started using more meaningful apps since joining discover.wtf. It’s a space for software with soul.",
      image: "/testimonials/ishaan.jpg",
      subtitle: "Indie Dev & Blogger",
    },
  ];
  const imgs = [
    {
      img: "https://i.pinimg.com/736x/fd/49/bf/fd49bff8fa06fa1cbcc9e1e1d06151db.jpg",
      content:
        "Discover.wtf helped me find indie tools I would've never stumbled across on Product Hunt. It's like a backstage pass to the maker world.",
      name: "Aarav Shah",
      title: "Founder, SoloForge",
    },
    {
      img: "https://i.pinimg.com/736x/44/92/78/44927817ba391867639b989359d59482.jpg",
      content:
        "This platform surfaces raw, authentic software by passionate builders. It’s where creativity lives before it hits the mainstream.",
      name: "Natalie Tran",
      title: "Community Lead, MakersUnite",
    },
    {
      img: "https://i.pinimg.com/736x/d7/c3/08/d7c30844161b2dd0ce39693b1701c0ee.jpg",
      content:
        "As someone constantly exploring niche tools, discover.wtf feels like home. The algorithm-free discovery is a breath of fresh air.",
      name: "Jensen Wong",
      title: "Interaction Designer",
    },
  ];
  const [active, setActive] = useState<number[]>([]);

  return (
    <section className="w-full flex flex-row overflow-hidden relative  md:h-screen mx-auto px-4 py-16">
      <div className="max-w-5xl w-full px-4 md:mx-auto">
        {/* <h2 className="text-3xl font-inter font-medium tracking-tighter leading-tight text-center mb-12">
          Loved by People <br /> Who Hate{" "}
          <span className="font-instrument-serif font-thin text-4xl tracking-normal italic">
            Algorithms
          </span>
        </h2> */}
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium md:font-semibold text-black text-center tracking-tighter font-inter leading-tight">
          Loved by People
          <br />
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-orange-500 via-orange-600 to-orange-400">
            Who Hate Algorithms.
          </span>
        </h3>
        <div className="z-0 flex mt-16 flex-col  md:flex-row w-full gap-4">
          {imgs.map((testimonial, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                },
              }}
              key={index}
              className="w-full flex items-center justify-center h-full"
            >
              <TestimonialCard
                active={active.includes(index)}
                setActive={setActive}
                index={index}
                testimonial={testimonial}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

type TestimonialCardProps = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<number[]>>;
  index: number;
  testimonial: {
    img: string;
    name: string;
    title: string;
    content: string;
  };
};
const TestimonialCard: FC<TestimonialCardProps> = ({
  active,
  setActive,
  testimonial,
  index,
}) => {
  return (
    <div className="bg-white border border-neutral-200 md:max-w-sm w-full h-[460px] dark:bg-gray-800 overflow-hidden relative rounded-3xl ">
      <Image
        style={{ objectFit: "cover" }}
        fill
        src={testimonial?.img}
        alt=""
      />
      {active && (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          className={cn(
            "bg-gradient-to-t text-white font-inter flex p-6 flex-col justify-between  absolute inset-0",
            index === 0 && "from-blue-500/90 via-blue-400/90 to-blue-200/90",
            index === 1 &&
              "from-orange-500/90 via-orange-400/90 to-orange-200/90",
            index === 2 && "from-lime-500/90 via-lime-400/90 to-lime-200/80"
          )}
        >
          <div>
            <h4 className="tracking-tight text-xl font-semibold">
              {testimonial?.name}
            </h4>
            <span className="text-lg font-medium tracking-tight">
              {testimonial?.title}
            </span>
          </div>
          <div className="text-lg mb-12 tracking-tight leading-snug font-medium">
            {testimonial?.content}
          </div>
        </motion.div>
      )}
      <motion.div
        onClick={() => {
          setActive((prev) => {
            if (prev.includes(index)) {
              return prev.filter((i) => i !== index);
            } else {
              return [...prev, index];
            }
          });
        }}
        animate={active ? { rotate: -45 } : { rotate: 0 }}
        className="rounded-full p-2 size-10 cursor-pointer bg-white absolute z-[1] bottom-5 right-4"
      >
        <Plus className="size-6" />
      </motion.div>
    </div>
  );
};
export default Testimonials;
