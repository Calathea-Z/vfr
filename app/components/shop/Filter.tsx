"use client";
//---Framework---//
import { useState, useEffect } from "react";
//---Packages---//
import { Plus, Minus, X } from "@phosphor-icons/react";
//---Fonts---//
import { lato } from "../../fonts/fonts";

interface FilterProps {
	productTypes: string[];
	selectedCategory?: string;
	onFilterChange: (filters: string[]) => void;
}

interface CheckedStates {
	[key: string]: boolean;
}

const Filter: React.FC<FilterProps> = ({
	productTypes = [],
	selectedCategory,
	onFilterChange = () => {},
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [checkedStates, setCheckedStates] = useState<CheckedStates>(() =>
		productTypes.reduce((acc: CheckedStates, type: string) => {
			acc[type] = selectedCategory ? type === selectedCategory : true; // Initialize based on selectedCategory
			return acc;
		}, {})
	);
	const [selectedFilters, setSelectedFilters] = useState<string[]>(() =>
		selectedCategory ? [selectedCategory] : productTypes
	);
	const [selectedPriceRange, setSelectedPriceRange] =
		useState<string>("All Prices");
	const [excludeOutOfStock, setExcludeOutOfStock] = useState<boolean>(false);

	useEffect(() => {
		if (selectedCategory) {
			// Initialize the selected filters with the selected category
			setSelectedFilters([selectedCategory]);
		}
	}, [selectedCategory]);

	useEffect(() => {
		onFilterChange(selectedFilters);
	}, [selectedFilters, onFilterChange]); // Effect to propagate changes

	const handleCheckboxChange = (type: string) => {
		setCheckedStates((prevStates) => ({
			...prevStates,
			[type]: !prevStates[type],
		}));

		setSelectedFilters((prevFilters) => {
			const newFilters = prevFilters.includes(type)
				? prevFilters.filter((filter) => filter !== type)
				: [...prevFilters, type];
			return newFilters;
		});
	};

	const handlePriceRangeChange = (price: string) => {
		console.log(`Changing price range to: ${price}`); // Debugging
		setSelectedPriceRange(price);

		// Filter out any existing price range from the selectedFilters
		const filteredFilters = selectedFilters.filter(
			(filter) =>
				!["Under 25", "25-50", "Over 50", "All Prices"].includes(filter)
		);

		// Add the new price range to the filter list unless it's "All Prices"
		if (price !== "All Prices") {
			filteredFilters.push(price);
		}

		setSelectedFilters(filteredFilters);
	};

	const handleExcludeOutOfStockChange = (exclude: boolean) => {
		setExcludeOutOfStock(exclude);
		// Update the selectedFilters state to include or exclude the out-of-stock filter
		setSelectedFilters((prevFilters) => {
			const newFilters = exclude
				? [...prevFilters, "Exclude Out Of Stock"]
				: prevFilters.filter((filter) => filter !== "Exclude Out Of Stock");
			return newFilters;
		});
	};

	const clearFilter = (filter: string) => {
		setSelectedFilters(selectedFilters.filter((f) => f !== filter));
		if (filter === selectedPriceRange) {
			setSelectedPriceRange("All Prices");
			// Ensure "All Prices" is added back to the filters when other selections are cleared
			const index = selectedFilters.indexOf(filter);
			if (index > -1) {
				let newFilters = [...selectedFilters];
				newFilters.splice(index, 1, "All Prices");
				setSelectedFilters(newFilters);
			}
		} else if (
			filter === "Exclude Out Of Stock" ||
			filter === "Include Out Of Stock"
		) {
			setExcludeOutOfStock(false);
		} else {
			setCheckedStates({ ...checkedStates, [filter]: false });
		}
	};

	return (
		<div className={lato.className}>
			<div className="flex gap-2 mt-2 w-screen">
				<div
					className={`w-[8rem] flex justify-center items-center py-1 px-2 gap-1 rounded-md ${
						isOpen ? "bg-emerald-300" : "bg-transparent"
					} cursor-pointer hover:bg-emerald-300 focus:bg-emerald-300`}
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? (
						<Minus className="w-4 h-4" />
					) : (
						<Plus className="w-4 h-4" />
					)}
					<span className="text-black font-bold text-sm">
						{isOpen ? "Hide Filters" : "Show Filters"}
					</span>
				</div>
				{/* Badges for selected filters */}
				<div className="flex flex-wrap gap-1">
					{selectedFilters.map((filter) => (
						<div
							key={filter}
							className="flex items-center bg-emerald-300 px-1 py-0.5 rounded-md"
						>
							<span className=" text-black text-[.6rem] font-bold mr-1">
								{filter}
							</span>
							<X
								className="w-3 h-3 cursor-pointer"
								onClick={() => clearFilter(filter)}
							/>
						</div>
					))}
				</div>
			</div>
			{isOpen && (
				<div className="bg-primary py-4 w-screen">
					<div className="flex gap-[3rem] sm:gap-[8rem] md:gap-[12rem] lg:gap-[19rem] px-4">
						<div className="flex flex-col gap-1">
							<span className="text-xs md:text-sm font-semibold">
								Product Type
							</span>
							{productTypes.map((type, index) => (
								<label key={index} className="inline-flex items-center mt-1">
									<input
										type="checkbox"
										className="form-checkbox bg-emerald-300"
										checked={checkedStates[type] || false}
										onChange={() => handleCheckboxChange(type)}
										disabled={
											selectedCategory === type ||
											(checkedStates[type] &&
												Object.values(checkedStates).filter(Boolean).length ===
													1)
										}
									/>
									<span className="ml-2 font-bold text-[.6rem]">{type}</span>
								</label>
							))}
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs md:text-sm font-semibold">Price</span>
							{["All Prices", "Under 25", "25-50", "Over 50"].map(
								(price, index) => (
									<label key={index} className="inline-flex items-center mt-2">
										<input
											type="radio"
											name="price"
											className="form-radio"
											checked={selectedPriceRange === price}
											onChange={() => handlePriceRangeChange(price)}
										/>
										<span className="ml-2 text-[.6rem] font-bold min-w-full">
											{price}
										</span>
									</label>
								)
							)}
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs md:text-sm font-bold">
								Exclude Out Of Stock
							</span>
							<label className="inline-flex items-center mt-2">
								<input
									type="checkbox"
									className="form-checkbox"
									checked={excludeOutOfStock}
									onChange={(e) =>
										handleExcludeOutOfStockChange(e.target.checked)
									}
								/>
								<span className="ml-2 text-[.6rem] font-semibold">Yes</span>
							</label>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default Filter;
