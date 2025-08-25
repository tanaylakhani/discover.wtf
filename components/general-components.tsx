import { cn } from "@/lib/utils";
import React from "react";

type HeadingProps = {
  children: React.ReactNode;
  className?: string;
};

const Heading = ({ children, className }: HeadingProps) => {
  return (
    <h1 className={cn("text-5xl font-instrument-serif font-thin", className)}>{children}</h1>
  );
};

export default Heading;
