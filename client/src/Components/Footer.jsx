import React from "react";
import Logo from "./Logo";

import { Link } from "react-router-dom";

export const Footer = () => {
	return (
		<footer className="py-6 dark:bg-quaternary-300 dark:text-gray-50 overflow-x-hidden absolute w-screen">
			<div className="container px-6 mx-auto space-y-6 divide-y divide-gray-400 md:space-y-12 divide-opacity-50">
				<div className="grid grid-cols-12">
					<div className="pb-6 col-span-full md:pb-0 md:col-span-6">
						<Link
							to="/"
							className="flex justify-center space-x-3 md:justify-start">
							<div className="flex items-center justify-right w-12 h-12 rounded-full dark:bg-violet-400">
								<Logo />
							</div>
							<span className="self-center text-2xl font-semibold">
								Handy Work
							</span>
						</Link>
					</div>

					<div className="col-span-full md:col-span-6 text-center md:text-right">
						<p className="pb-1 text-lg font-medium">Meet the Team</p>
						<ul className="flex justify-center flex-col sm:flex-row md:justify-end sm:gap-5">
							<li>
								<a
									rel="noopener noreferrer"
									href="https://github.com/alcb1310"
									target={"_blank"}
									className="hover:dark:text-primary-100">
									Andres
								</a>
							</li>
							<li>
								<a
									rel="noopener noreferrer"
									href="https://github.com/chingu-voyages/v41-geckos-team-08"
									target={"_blank"}
									className="hover:dark:text-primary-100">
									Fred
								</a>
							</li>
							<li>
								<a
									rel="noopener noreferrer"
									href="https://github.com/jonahBerlyne"
									target={"_blank"}
									className="hover:dark:text-primary-100">
									Jonah
								</a>
							</li>
							<li>
								<a
									rel="noopener noreferrer"
									href="https://github.com/lincoln1883"
									target={"_blank"}
									className="hover:dark:text-primary-100">
									Lincoln
								</a>
							</li>
							<li>
								<a
									rel="noopener noreferrer"
									href="https://github.com/HectorAgudelo"
									target={"_blank"}
									className="hover:dark:text-primary-100">
									Hector
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="grid justify-center pt-6 lg:justify-center">
					<div className="flex flex-col self-center text-sm text-center md:block lg:col-start-1 md:space-x-6">
						<span>©2022 All rights reserved</span>
					</div>
				</div>
			</div>
		</footer>
	);
};