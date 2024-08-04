const navigateWithDelay = async (router, url, delay = 100) => {
	console.log("Navigating to URL:", url);
	await new Promise((resolve) => setTimeout(resolve, delay));

	try {
		await router.push(url);
		console.log("Navigation successful");
	} catch (err) {
		console.error("Navigation error:", err);
		window.location.href = url;
	}
};

export default navigateWithDelay;
