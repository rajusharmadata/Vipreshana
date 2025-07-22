import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="pt-6 pb-6 px-4 md:px-12 bg-gray-800 text-gray-300">
            <div className="max-w-6xl mx-auto relative flex flex-col items-center md:items-stretch">
                <p className="text-sm text-center w-full">
                    &copy; {new Date().getFullYear()} Vipreshana. All rights reserved.
                </p>
                <div className="flex space-x-6 text-xl mt-0 md:mt-3 md:absolute md:top-1/2 md:right-0 md:transform md:-translate-y-1/2">
                    <a
                        href="https://github.com/sailaja-adapa/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200"
                    >
                        <FaGithub />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/sailaja-adapa-770167291/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="mailto:adapasailaja17@gmail.com"
                        className="hover:text-white transition-colors duration-200"
                    >
                        <FaEnvelope />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
