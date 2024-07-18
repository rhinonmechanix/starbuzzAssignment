"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthData } from "@/Utils/utils";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authData = getAuthData();
    const token = authData?.token;

    if (token) {
      router.push("/blogs");
    } else {
      router.push("/signin");
    }
  }, []);

  return (
    <main className="flex items-center justify-center w-full h-screen bg-background">
      loading...
    </main>
  );
}
