"use client";
import { useRouter } from "next/navigation";
import Spline from "@splinetool/react-spline";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-orange-100 overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center text-center md:text-left px-6 md:px-12">

        {/* Left Side - Text and Button */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Welcome to AceMock
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mt-2">
          Enhance skills with AI-driven mock interview feedback.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 px-6 py-3 bg-green-500 text-white text-lg rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Get Started
          </button>
        </div>

        {/* Right Side - Spline 3D Model */}
        <div className="md:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-[600px] h-[500px] flex justify-center items-center">
          <Spline scene="https://prod.spline.design/2HNnWZeEu7QY5R6X/scene.splinecode" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
