"use client";

import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

export default function Navbar({ userSession, userData, setUserData }) {
  return (
    <nav class=" block w-full border border-white/80 bg-white bg-opacity-80 py-2 px-4 text-white shadow-md backdrop-blur-2xl backdrop-saturate-200 ">
      <div>
        <div class="container mx-auto flex items-center justify-between text-gray-900">
          <div class="mr-4 block cursor-pointer py-1.5 font-sans font-extrabold text-3xl leading-normal text-inherit antialiased">
            <span className="text-orange-400 ">SBTC</span>
          </div>

          <ul class="flex items-center gap-6">
            <li class="block p-1 font-sans text-lg font-normal leading-normal text-inherit antialiased">
              <a class="flex items-center bg-transparent rounded-xl px-4 py-2 h-auto hover:bg-gray-200" href="/deposit">
                Deposit
              </a>
            </li>
            <li class="block p-1 font-sans text-lg font-normal leading-normal text-inherit antialiased">
              <a class="flex items-center bg-transparent rounded-xl px-4 py-2 h-full hover:bg-gray-200" href="/withdraw">
                Withdraw
              </a>
            </li>
          </ul>
          
          {userData ? (
              <ConnectWallet
                userSession={userSession}
                userData={userData}
                setUserData={setUserData}
              />
            ) : (
              ""
            )}
        </div>
      </div>


    </nav>
  );
}
