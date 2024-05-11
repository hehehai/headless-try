"use client";

import { useState } from "react";

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
    <div className="w-screen h-screen flex flex-col items-center justify-center text-white bg-neutral-950">
      <div className="mb-10 max-w-lg">
        <h3 className="text-3xl">Try screenshot</h3>
        <p className="text-sm mt-3">
          Thursday, May 9th 2024 Vercel Functions for Hobby can now run up to 60
          seconds{" "}
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
            Site url <span>{time ? `${time}s` : duration ? `${duration}s` : ""}</span>
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              name="url"
              id="url"
              placeholder="https://example.com"
              className="border border-neutral-800 rounded-xl px-4 py-2.5 transition-colors duration-200 bg-transparent text-neutral-300 text-lg min-w-[366px]"
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
  );
}
