import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      Landing page <Link href={"/in"}> go in Home</Link>
    </div>
  );
}
