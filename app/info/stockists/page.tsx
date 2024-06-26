"use client";
import GoogleMapCustomOverlay from "../../components/googleMaps/GoogleMapCustomOverlay";
import { Stockist } from "@/types/types";
import mapMarkerIcon from "../../../public/assets/mapMarkerIcon";
//---Framework---//
import { useState, useEffect, useRef, useCallback, FC } from "react";
import Link from "next/link";
//---Packages---//
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const Stockists: FC = () => {
	const svgIconUrlEncoded = encodeURIComponent(mapMarkerIcon);
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

	const fetchData = useCallback(async () => {
		try {
			const { data } = await axios.get("/api/stockists");
			setStockists(data);
		} catch (error) {
			console.error(error);
			setError("Failed to fetch stockists. Please try again later.");
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

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
			{isMapsScriptLoaded ? (
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
						mapRef.current = map as unknown as GoogleMap;
					}}
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
								className: "bg-[#008080] rounded px-1 py-0.5",
							}}
							icon={{
								url: dataUrl,
								scaledSize: new window.google.maps.Size(35, 35),
								labelOrigin: new window.google.maps.Point(0, -20),
							}}
							onClick={() =>
								handleCardClick(stockist.latitude, stockist.longitude, stockist)
							}
						/>
					))}
					{selectedStockist && isMapsScriptLoaded && (
						<GoogleMapCustomOverlay
							map={mapRef.current}
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
			) : (
				<div className="flex justify-center items-center h-full">
					<CircularProgress />
				</div>
			)}
		</LoadScriptNext>
	);

	return (
		<div className="bg-primary flex flex-col min-h-screen p-0">
			<div className="grid grid-cols-1 lg:grid-cols-4 justify-center gap-0 p-0">
				<div className="col-span-2 xl:col-span-1 order-2 lg:order-1 w-full bg-slate-200 overflow-y-auto max-h-screen">
					{stockists.map((stockist) => (
						<div
							key={stockist.name}
							className="bg-white p-6 border-b-[.1rem] border-b-gray-300 cursor-pointer"
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
