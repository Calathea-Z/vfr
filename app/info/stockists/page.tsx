"use client";
import GoogleMapCustomOverlay from "../../components/googleMaps/GoogleMapCustomOverlay";
import client from "../../../sanity/lib/client";
//---Framework---//
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
//---Packages---//
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { motion } from "framer-motion";

interface Stockist {
	name: string;
	description: string;
	addressLineOne: string;
	addressLineTwo: string;
	keywords: string[];
	latitude: number;
	longitude: number;
	url: string;
}

const Stockists: React.FC = () => {
	const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#059669" stroke="#ffffff" stroke-width="6" d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"/></svg>`;

	const svgIconUrlEncoded = encodeURIComponent(svgIcon);
	const dataUrl = `data:image/svg+xml,${svgIconUrlEncoded}`;

	const [stockists, setStockists] = useState<Stockist[]>([]);
	const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
		lat: 35.542613827211696, // Default center of the map (12 Bones, Asheville, NC)
		lng: -82.51833478527368,
	});

	const [zoomLevel, setZoomLevel] = useState<number>(11);
	const [selectedStockist, setSelectedStockist] = useState<Stockist | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [isMapsScriptLoaded, setIsMapsScriptLoaded] = useState<boolean>(false);
	const loadScriptRef = useRef<boolean | null>(null); // useRef to manage LoadScriptNext component
	const mapRef = useRef<GoogleMap | null>(null); // useRef for GoogleMap instance

	const fetchData = async () => {
		try {
			const response = await client.fetch<Stockist[]>(
				`*[_type == "stockist"]{
			name,
			description,
			"addressLineOne": address.street,
			"addressLineTwo": address.city + ", " + address.state + " " + address.zipCode,
			keywords,
			latitude,
			longitude,
			url
		}`
			);
			const sortedResponse = response.sort((a, b) =>
				a.name.localeCompare(b.name)
			);
			setStockists(sortedResponse);
		} catch (error) {
			console.error(error);
			setError("Failed to fetch stockists. Please try again later.");
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (!loadScriptRef.current) {
			loadScriptRef.current = true;
		}
	}, []);

	if (error) {
		return (
			<div className="bg-primary flex flex-col min-h-screen">
				<main className="flex-grow p-8 mt-32 flex justify-center items-center">
					<h1 className="text-4xl font-bold mb-8 text-red-500">{error}</h1>
					<button onClick={fetchData} className="mt-4 btn btn-primary">
						Retry
					</button>
				</main>
			</div>
		);
	}
	const mapContainerStyle = {
		width: "100%",
		height: "100%",
	};

	const handleCardClick = useCallback(
		(latitude: number, longitude: number, stockist: Stockist) => {
			setMapCenter({ lat: latitude, lng: longitude });
			setZoomLevel(19); // Zoom in closer when a card is clicked
			setSelectedStockist(stockist); // Automatically select the stockist to show its info window
		},
		[]
	);
	const renderMap = () => (
		<LoadScriptNext
			googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
			onLoad={() => setIsMapsScriptLoaded(true)}
		>
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				center={mapCenter}
				zoom={zoomLevel}
				options={{
					fullscreenControl: true,
					disableDefaultUI: true,
					gestureHandling: "cooperative",
					styles: [
						{
							featureType: "poi.business",
							elementType: "labels",
							stylers: [{ visibility: "off" }],
						},
					],
				}}
				onLoad={(map: google.maps.Map) => {
					mapRef.current = map as unknown as GoogleMap; // Assign the map instance to mapRef with type casting
				}} // Assign the map instance to mapRef
			>
				{stockists.map((stockist) => (
					<Marker
						key={stockist.name}
						position={{
							lat: stockist.latitude,
							lng: stockist.longitude,
						}}
						label={{
							text: stockist.name,
							color: "#ffffff",
							fontSize: "10px",
							fontWeight: "bold",
							className: "bg-[#008080] rounded px-1 py-0.5", // Custom class for label styling
						}}
						icon={{
							url: dataUrl, //svgIcon
							scaledSize: new window.google.maps.Size(35, 35),
							labelOrigin: new window.google.maps.Point(0, -20), // Position label above the icon
						}}
						onClick={() =>
							handleCardClick(stockist.latitude, stockist.longitude, stockist)
						}
					/>
				))}
				{selectedStockist && (
					<GoogleMapCustomOverlay
						map={mapRef.current} // Use the map instance from mapRef
						google={window.google}
						position={{
							lat: selectedStockist.latitude,
							lng: selectedStockist.longitude,
						}}
						onClose={() => setSelectedStockist(null)}
					>
						<div className="bg-[#f5f5f5] p-2 rounded-lg shadow-md text-center">
							<h2 className="text-[#3a7ca5] font-bold">
								{selectedStockist.name}
							</h2>
							<p className="font-bold text-gray-800">
								{selectedStockist.description}
							</p>
							<p className="italic text-[#333333]">
								{selectedStockist.addressLineOne}
							</p>
							<p className="italic text-[#333333]">
								{selectedStockist.addressLineTwo}
							</p>
							{selectedStockist.url && (
								<Link
									href={selectedStockist.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#008080] hover:underline"
								>
									Visit Website
								</Link>
							)}
							<Link
								href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
									selectedStockist.addressLineOne +
										" " +
										selectedStockist.addressLineTwo
								)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="block mt-2 text-[#008080] hover:underline"
							>
								Get Directions
							</Link>
						</div>
					</GoogleMapCustomOverlay>
				)}
			</GoogleMap>
		</LoadScriptNext>
	);
	return (
		<div className="bg-primary flex flex-col min-h-screen p-0">
			<div className="grid grid-cols-1 lg:grid-cols-4 justify-center gap-0 p-0">
				{" "}
				{/* Removed gap between columns */}
				<div className="col-span-2 xl:col-span-1 order-2 lg:order-1 w-full bg-slate-200 overflow-y-auto max-h-screen">
					{stockists.map((stockist) => (
						<div
							key={stockist.name}
							className="bg-white p-6 border-b-[.1rem] border-b-gray-300  cursor-pointer"
							onClick={() =>
								handleCardClick(stockist.latitude, stockist.longitude, stockist)
							}
						>
							<h2 className="text-2xl font-bold mb-4 hover:text-gray-800 hover:underline hover:underline-offset-2">
								{stockist.url ? (
									<Link
										href={stockist.url}
										target="_blank"
										rel="noopener noreferrer"
										className="hover:text-gray-800"
									>
										{stockist.name}
									</Link>
								) : (
									<span className="hover:text-gray-800">{stockist.name}</span>
								)}
							</h2>
							<p className="text-sm italic mb-4 text-emerald-600">
								{stockist.keywords ? stockist.keywords.join(", ") : "N/A"}
							</p>
							<p className="mb-4 text-base">{stockist.description}</p>
							<p className="text-base">{stockist.addressLineOne}</p>
							<p className="text-base">{stockist.addressLineTwo}</p>
						</div>
					))}
				</div>
				<div className="col-span-2 xl:col-span-3 order-1 lg:order-2 p-0">
					<div className="sticky top-0 bg-white lg:rounded-md shadow-sm flex justify-center p-3 h-[500px] md:h-[500px] lg:h-[850px]">
						{renderMap()}
					</div>
				</div>
			</div>
		</div>
	);
};
export default Stockists;
