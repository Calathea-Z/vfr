"use client";
//---Framework---//
import { useState, useEffect, useRef, useCallback, FC } from "react";
//---Packages---//
import { ArrowUp, ArrowDown } from "@phosphor-icons/react";

interface SortProps {
	onSortChange: (sortQuery: string) => void;
}

const Sort: FC<SortProps> = ({ onSortChange }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [sortSelected, setSortSelected] =
		useState<string>("Sort: Best Selling");
	const sortRef = useRef<HTMLDivElement>(null);

	const sortOptions: string[] = [
		"Sort: Alphabetically, A to Z",
		"Sort: Alphabetically, Z to A",
		"Sort: Best Selling",
		"Sort: Date, New to Old",
		"Sort: Date, Old to New",
		"Sort: Featured",
		"Sort: Price, High to Low",
		"Sort: Price, Low to High",
	];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [sortRef]);

	const handleSortSelection = useCallback(
		(option: string) => {
			setSortSelected(option);
			setIsOpen(false); // Close the dropdown when a new sort type is selected

			// Map the selected option to a GROQ query
			let sortQuery = "";
			switch (option) {
				case "Sort: Alphabetically, A to Z":
					sortQuery = "name asc";
					break;
				case "Sort: Alphabetically, Z to A":
					sortQuery = "name desc";
					break;
				case "Sort: Best Selling":
					sortQuery = "amountSold asc";
					break;
				case "Sort: Date, New to Old":
					sortQuery = "dateCreated desc";
					break;
				case "Sort: Date, Old to New":
					sortQuery = "dateCreated asc";
					break;
				case "Sort: Featured":
					sortQuery = "featuredProduct desc";
					break;
				case "Sort: Price, High to Low":
					sortQuery = "price desc";
					break;
				case "Sort: Price, Low to High":
					sortQuery = "price asc";
					break;
				default:
					sortQuery = "";
			}

			// Pass the sort query to the parent component
			onSortChange(sortQuery);
		},
		[onSortChange]
	);
	return (
		<div className="relative" ref={sortRef}>
			<div
				className={`w-[15rem] flex justify-between items-center mt-2 py-1 px-2 gap-2 border-[1px] border-black cursor-pointer hover:bg-emerald-300 rounded-t-md ${
					isOpen ? "border-b-[1px] border-slate-200" : "hover:border-b-black"
				}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="text-black font-amaticSC font-bold text-sm">
					{sortSelected}
				</span>
				{isOpen ? (
					<ArrowUp className="w-4 h-4" />
				) : (
					<ArrowDown className="w-4 h-4" />
				)}
			</div>
			{isOpen && (
				<div className="absolute z-10 bg-primary border-[1px] border-black border-t-0 pt-1 pb-2 px-2 w-[15rem] shadow-lg top-full rounded-b-md">
					{sortOptions.map((option, index) => (
						<div
							key={index}
							className="text-start font-bold text-xs font-amaticSC hover:bg-emerald-300 cursor-pointer rounded-sm px-1 mb-[.1rem]"
							onClick={() => handleSortSelection(option)}
						>
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Sort;
