import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb } from "lucide-react";
import imgLanding from "@/assets/img/img-landing1.avif";
import landingImg from "@/assets/img/img-landing2.avif";
import imglan from "@/assets/img/img-landing3.avif";
import lanimg from "@/assets/img/img-landing4.avif";

export const LandingPage = () => {
  return (
    <main className="pt-20 bg-green-900 min-h-screen flex flex-col">
      <div className="px-6 mx-auto max-w-7xl flex-grow flex flex-col justify-center">
        <div className="w-full mx-auto text-center md:w-9/12 xl:w-7/12">
          {/* Single H1 only */}
          <h1 className="mb-6 font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 to-yellow-300 text-5xl md:text-7xl">
            Moxxa Coffee
          </h1>
          <h2 className="mb-8 font-semibold text-yellow-300 text-lg md:text-2xl">
            Good Coffee | Good Food
          </h2>

          <div className="mb-10 flex justify-center gap-4 flex-wrap">
            <Button className="bg-white text-green-900 hover:bg-gray-300" asChild>
              <Link to="/login" className="flex items-center gap-2">
                Get Started <ArrowRight />
              </Link>
            </Button>
            <Button className="bg-white text-green-900 hover:bg-gray-300" asChild>
              <Link to="/register" className="flex items-center gap-2">
                Sign Up <Lightbulb />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {[imglan, landingImg, imgLanding, lanimg].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Landing ${i + 1}`}
              className="w-40 h-56 md:w-52 md:h-72 rounded-lg shadow-lg object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
