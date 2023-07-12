/**
 * This script indexes the downloaded RDA documents from Zenodo.
 * Because RDA doesn't have a lot of documents (164 atm), we can index them all in one go
 */
import fs from 'fs-extra'
import path from 'path'
import { MappingTypeMapping } from 'es7/api/types'
import { esClient, initIndex } from './elasticsearch/client'
import { pathToDownloadDir } from './common'

export const indexName = `dans-rda`

const mappings: MappingTypeMapping = {
	properties: {
		stats: {
			type: 'nested',
			properties: {
				unique_views: {
					type: 'integer',
				},
			}
		},
		community: {
			type: 'keyword',
		},
	}
}

async function indexRDA() {
	await initIndex(indexName, mappings)

	const files = await fs.readdir(pathToDownloadDir)

	for (const file of files) {
		const contents = await fs.readFile(path.resolve(pathToDownloadDir, file), 'utf-8')
		const json = JSON.parse(contents)

		for (const hit of json.hits.hits) {
			const community = hit.metadata.communities.map((c: { id: string }) => c.id)
			hit.community = community

			try {
				await esClient.index({
					index: indexName,
					body: hit,
					id: hit.id
				})
				console.log('[indexed]', hit.id)
			} catch (err) {
				console.log('[ERROR] indexDocument', err)
			}
		}
	}
}

indexRDA()