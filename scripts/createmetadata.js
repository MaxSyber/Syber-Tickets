const fs = require("fs")
const path = require("path")
const outputDir = "./public/ticketMetadata"
const numFiles = 10

const generateJSONFiles = () => {
	if(!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir)
	}
}

generateJSONFiles();

for (let i = 0; i < numFiles; i++) {
	const tokenId = i
	const attributes = {
		tokenId: `${tokenId}`,
		name: "Max Fosh Comedy",
		date: "21 December 2023",
		time: "8:00PM EST",
		location: "Atticus Center",
		city: "Washington, DC",
	}

	const filename = `${tokenId}.json`
	const outputPath = path.join(outputDir, filename)

	fs.writeFileSync(outputPath, JSON.stringify(attributes, null, 2))
}

generateJSONFiles()
