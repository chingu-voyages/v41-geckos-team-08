import React from "react";

export const Pagination = (props) => {
	return (
		<nav
			aria-label="Page navigation example"
			className="flex justify-center pt-10 mb-4">
			<ul className="inline-flex items-center -space-x-px">
				<li>
				</li>
				<li>
				</li>
				<li>
				</li>
				<li>
				</li>
				<li>
				</li>
				<li>
				</li>
				<li>
						<span className="sr-only">Next</span>
						<svg
							aria-hidden="true"
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fillRule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clipRule="evenodd"></path>
						</svg>
				</li>
			</ul>
		</nav>
	);
};
