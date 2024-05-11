"use client";

import { useState } from "react";

export default function Home() {
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get("url");
    if (!url) {
      return;
    }
    setTime(0);
    const timePoint = Date.now();
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
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-4xl text-black bg-gradient-to-tr from-gray-300 via-slate-200 to-slate-200">
      <div className="mb-5 max-w-md px-2">
        <h3>Try screenshot</h3>
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
          <label htmlFor="url">Site url {time ? `(${time}s)` : ""}</label>
          <input
            type="text"
            name="url"
            id="url"
            placeholder="https://example.com"
            className="border border-gray-300 rounded-xl px-4 py-2"
          />
        </div>
        <button
          type="submit"
          className="border border-gray-300 rounded-xl px-4 py-2 bg-slate-950 text-white hover:bg-slate-800 mt-4"
          disabled={loading}
        >
          {loading ? "Loading..." : "Screenshot"}
        </button>
      </form>
      {imgUrl && (
        <div className="border border-gray-100 mt-4 max-w-4xl">
          <img src={imgUrl} alt="screenshot" />
        </div>
      )}
    </div>
  );
}
