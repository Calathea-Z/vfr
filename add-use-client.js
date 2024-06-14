const fs = require("fs");
const path = require("path");

const filePath = path.join(
	__dirname,
	"node_modules",
	"notistack",
	"dist",
	"index.js"
);

fs.readFile(filePath, "utf8", (err, data) => {
	if (err) {
		console.error(`Error reading file: ${err}`);
		return;
	}

	if (!data.startsWith('"use client";')) {
		const updatedData = '"use client";\n' + data;
		fs.writeFile(filePath, updatedData, "utf8", (err) => {
			if (err) {
				console.error(`Error writing file: ${err}`);
			} else {
				console.log(`Successfully added "use client" directive to ${filePath}`);
			}
		});
	} else {
		console.log(`"use client" directive already present in ${filePath}`);
	}
});
