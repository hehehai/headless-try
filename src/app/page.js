"use client";

import { useState } from "react";
import { Spotlight } from "@/app/components/Spotlight";
import { LineMdGithubLoop } from "@/app/components/github-icon";

export default function Home() {
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get("url");
    if (!url) {
      return;
    }

    setDuration(0);
    setTime(0);
    const timePoint = Date.now();
    const intervalTimer = startDuration();
    try {
      setLoading(true);
      const res = await fetch(`/try?url=${url}`, {
        next: { revalidate: 10 },
      });
      const data = await res.blob();
      setImgUrl(URL.createObjectURL(data));
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      // 秒
      setTime((Date.now() - timePoint) / 1000);
      intervalTimer && clearInterval(intervalTimer);
      setLoading(false);
    }
  };

  function startDuration() {
    return setInterval(() => {
      setDuration((prev) => Number((prev + 0.2).toFixed(1)));
    }, 200);
  }

  return (
    <div className="relative w-screen h-screen bg-grid-white/[0.2] bg-black">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="w-full h-full relative z-20 flex flex-col items-center justify-center text-white">
        <div className="mb-16 max-w-lg text-center">
          <h3 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Try screenshot
          </h3>
          <p className="text-md mt-3">
            Thursday, May 9th 2024 Vercel Functions for Hobby can now run up to
            60 seconds{" "}
            <a
              href="https://vercel.com/changelog/vercel-functions-for-hobby-can-now-run-up-to-60-seconds"
              className="text-blue-500 underline"
            >
              detail
            </a>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3">
            <label htmlFor="url" className="text-2xl">
              Site url{" "}
              <span>{time ? `${time}s` : duration ? `${duration}s` : ""}</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                name="url"
                id="url"
                placeholder="https://example.com"
                className="border border-neutral-800 rounded-xl px-4 py-2.5 transition-colors duration-200 bg-transparent text-neutral-300 text-lg min-w-[366px] bg-black"
              />
              <button
                type="submit"
                className="group relative grid overflow-hidden rounded-xl px-5 py-2.5 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200"
                disabled={loading}
              >
                <span>
                  <span className="spark mask-gradient animate-flip before:animate-rotate absolute inset-0 h-[100%] w-[100%] overflow-hidden rounded-xl [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                </span>
                <span className="backdrop absolute inset-px rounded-[11px] bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                <span className="z-10 text-neutral-300 text-lg">
                  {loading && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#000"
                      viewBox="0 0 256 256"
                      className="animate-spin"
                    >
                      <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"></path>
                    </svg>
                  )}
                  {loading ? "Loading..." : "Screenshot"}
                </span>
              </button>
            </div>
          </div>
        </form>
        {imgUrl && (
          <div className="border border-gray-100 mt-4 max-w-4xl">
            <img src={imgUrl} alt="screenshot" />
          </div>
        )}
      </div>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_-40%,black)]"></div>
      <div className="fixed z-30 right-4 top-4 flex items-center space-x-3">
        <a href="https://github.com/hehehai/headless-try" target="_blank" className="relative inline-flex overflow-hidden rounded-xl p-px">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c2c2c2_0%,#505050_50%,#bebebe_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[11px] bg-neutral-950 px-4 py-2 text-sm font-medium text-gray-50 backdrop-blur-3xl">
            <LineMdGithubLoop />
            <span className="ml-2">Github</span>
          </span>
        </a>
      </div>
    </div>
  );
}
