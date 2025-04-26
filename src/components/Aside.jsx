import React from 'react'
import Logo from '../assets/img/caffe.png'
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Aside = () => {
  return (
    <div className="relative overflow-hidden md:flex  w-1/2 bg-green-900  flex-col justify-between p-10">
      <div className="flex justify-between items-center">
        <img
          src={Logo}
          alt="Moxxa Caffe"
          className="w-60 rounded-sm h-30"
        ></img>
        <div>
          <h1 className="text-white  text-3xl font-serif">
            Welcome to Moxxa Caffe
          </h1>
        </div>
      </div>
      <div className="text-center mb-20">
        <p className="text-white text-base">
          At moxxa.caffè, we combine traditional roasting techniques with the
          finest qualities of green coffee to create a unique product. The high
          quality of our premium coffee would not be possible without the care
          and dedication of the coffee farmers. Therefore, close contact with
          them is an important part of our work. Thanks to long-standing trading
          relationships in the coffee-growing countries and with specialized
          coffee traders, we can guarantee that the coffee farmers receive fair
          payment for their work and deliver exceptional quality.
        </p>
      </div>
    </div>
  );
}

export default Aside