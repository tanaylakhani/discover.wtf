import { cn } from "@/lib/utils";
import React from "react";

type HeadingProps = {
  children: React.ReactNode;
  className?: string;
};

const Heading = ({ children, className }: HeadingProps) => {
  return (
    <div className={cn("text-5xl  font-inter  ", className)}>{children}</div>
  );
};

export default Heading;
