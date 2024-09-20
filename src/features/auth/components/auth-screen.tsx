"use client";
import React, { useState } from "react";
import { SignInFlow } from "../types";
import SignInCard from "./signin-card";
import SignUpCard from "./signup-card";

const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="w-full h-full flex justify-center items-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
