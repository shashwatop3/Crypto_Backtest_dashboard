"use client";

export const Footer = () => {
  return (
    <footer
      className="pt-6 pb-6 lg:px-4 text-white shadow"
      style={{
        backgroundImage:
          "linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)", // Match header gradient
      }}
    >
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Left Section */}
        <div className="text-center lg:text-left">
          <p className="text-sm">&copy; {new Date().getFullYear()} IET Dashboard. All rights reserved.</p>
        </div>

        {/* Center Section */}
        <div className="flex gap-4">
          <a
            href="#"
            className="text-sm hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
        </div>

        {/* Right Section */}
        <div className="flex gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            Twitter
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};