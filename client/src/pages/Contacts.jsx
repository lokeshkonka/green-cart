import React from "react";
import { assets } from "../assets/assets";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center">
          Contact <span className="text-primary">Me</span>
        </h1>

        <p className="mt-3 text-center text-gray-500">
          Let’s connect — portfolio, resume, and socials below
        </p>

        {/* Divider */}
        <div className="my-8 h-px bg-gray-200" />

        {/* Content */}
        <div className="space-y-6">
          {/* Portfolio */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-gray-700 font-medium">Portfolio Website</p>
            <a
              href="https://lokeshkonka.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              lokeshkonka.vercel.app
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-gray-700 font-medium">Email</p>
            <a
              href="mailto:konkalokesh372@gmail.com"
              className="text-primary hover:underline"
            >
              konkalokesh372@gmail.com
            </a>
          </div>

          {/* GitHub */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-gray-700 font-medium">GitHub</p>
            <a
              href="https://github.com/lokeshkonka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              github.com/lokeshkonka
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Download Resume */}
          <a
            href="/resume.pdf"
            download
            className="
              px-6 py-3 rounded-lg
              bg-primary text-white font-medium
              hover:bg-primary-dull transition
              text-center
            "
          >
            Download Resume
          </a>

          {/* Visit Portfolio */}
          <a
            href="https://lokeshkonka.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-6 py-3 rounded-lg
              border border-primary/40
              text-primary font-medium
              hover:bg-primary/10 transition
              text-center
            "
          >
            Visit Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
