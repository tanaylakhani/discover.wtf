import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const cards = [
  // ...same as before
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/c0d4398d-50f4-46d3-ba1d-eb97d0e1b07c/3.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/0a1cf565-6255-4aae-97f3-3e09af357a4e/3.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/4d7df8f6-7af3-4fbb-b310-164b04330c35/4.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/4f9a9ece-069e-4788-a62e-29a725510a9b/4.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/5432d425-ce11-4ac8-9a9e-2ed0825d5103/5.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/53b6769b-4c5b-4d35-8705-4876e8945026/4.png",
  },
];
const cards2 = [
  // ...same as before
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/d41fadc1-fe6b-4023-a78f-0e30d938dc3b/3.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/6a9cbd8d-a3e9-4f40-a8bd-f20c49e24726/3.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/ed22972a-cd5f-4c9f-833c-13b0a0f8484e/2.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/f9cbc1cd-74f0-4717-a811-f994c329b66c/2.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/e8165c7e-567c-4086-8a56-c31c30420a6f/Untitled_design__40_.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/b3c8e606-649c-4fa7-8cde-d671acd5123a/Untitled_design__18_.png",
  },
  {
    image:
      "https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/10fc969e-fd21-4ae8-b8e4-8087ade4baba/2.png",
  },
];

// Custom Marquee component
type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  duration?: number; // in seconds
};

const Marquee: React.FC<MarqueeProps> = ({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  duration = 60,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause on hover effect
  useEffect(() => {
    if (!pauseOnHover || !containerRef.current) return;
    const el = containerRef.current;
    const handleMouseEnter = () => {
      el.style.animationPlayState = "paused";
    };
    const handleMouseLeave = () => {
      el.style.animationPlayState = "running";
    };
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [pauseOnHover]);

  return (
    <div className={cn("w-full overflow-x-hidden", className)} style={{}}>
      <div
        ref={containerRef}
        className={cn(
          "flex gap-4 w-max",
          "marquee",
          reverse ? "marquee-reverse" : ""
        )}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {/* Duplicate children for seamless loop */}
        {children}
        {children}
      </div>
      <style jsx>{`
        .marquee {
          animation: marquee-scroll linear infinite;
          animation-play-state: running;
        }
        .marquee-reverse {
          animation-direction: reverse;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

const WebsitesMarqueeEffect = () => {
  return (
    <div className="relative z-[10] flex w-full flex-col items-center justify-center overflow-x-hidden">
      <Marquee pauseOnHover className="mb-2 gap-4" duration={60}>
        {cards.map((card, i) => (
          <div
            key={i}
            className={cn(
              "aspect-video h-44 max-w-md w-full border rounded-xl border-neutral-200 p-3 shadow-lg bg-neutral-50"
            )}
          >
            <img
              src={card.image}
              alt=""
              className="w-full h-full object-cover rounded-xl border border-neutral-200"
            />
          </div>
        ))}
      </Marquee>
      <Marquee
        pauseOnHover
        reverse
        className="gap-4 bg-transparent"
        duration={60}
      >
        {cards2.map((card, i) => (
          <div
            key={i}
            className="aspect-video h-44 max-w-md w-full shadow-lg border rounded-xl border-neutral-200 p-3 bg-neutral-50"
          >
            <img
              src={card.image}
              alt=""
              className="w-full h-full object-cover rounded-xl border border-neutral-200"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default WebsitesMarqueeEffect;
