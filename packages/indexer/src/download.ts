/**
 * This script downloads the RDA documents from Zenodo to `folder`.
 * Everytime the docs need ES indexing, we don't need to download them again.
 */
// import fs from 'fs'
import path from 'path'
import fs from "fs-extra"
import { pathToDownloadDir } from './common'

const communities = ['rda', 'rda-related']
const baseURL = 'https://zenodo.org/api/records/?communities='
const maxPages = 10

export async function downloadRDADocs() {
	await fs.emptyDir(pathToDownloadDir)

	for (const community of communities) {
		// Concatenate the base URL with the community name
		let url = baseURL + community

		let page = 0

		while (page < maxPages && url != null) {
			let json: { links: any } | undefined 
			try {
				const result = await fetch(url)
				json = await result.json()
			} catch (error) {
				console.log('[ERROR] fetch', error)
			}

			const pathToJsonFile = path.resolve(pathToDownloadDir, `${community}-${page}.json`)

			await fs.writeJSON(pathToJsonFile, json, { spaces: 2 })

			console.log('[download]', pathToJsonFile)

			url = json?.links.next

			page++
		}
	}
}

downloadRDADocs()
