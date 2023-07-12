import type { PageConfig } from 'dans-wrapper'

import React from 'react'
import { createRoot } from 'react-dom/client'

import { FacetedSearch } from './search'
import { DansWrapper, GenericPageWrapper } from 'dans-wrapper'

import './index.css'
import 'dans-wrapper/build/index.css'

declare global {
	const ELASTIC_SEARCH_URL: string
	// const ELASTIC_REACTIVESEARCH_URL: string
}

export enum Indices {
	// DansDataCite = 'dans-search-and-discovery',
	DansRDA = 'dans-rda'
}

document.addEventListener('DOMContentLoaded', () => {
	const root = createRoot(document.getElementById('container')!)
	root.render(
		<DansWrapper pages={pages} />
	)
})

const pages: PageConfig[] = [
	{
		Component: props =>
			<GenericPageWrapper {...props} noTitle>
				<div style={{ textAlign: 'center' }}>
					<img src="https://www.rd-alliance.org/sites/default/files/RDA_Logotype_Low.jpg" alt="RDA Logo" />	
				</div>
			</GenericPageWrapper>,
		id: 'home',
		path: ['/', '/home'],
	},
	{
		Component: () => 
			<FacetedSearch index={Indices.DansRDA} />,
		id: 'search',
	},
	{
		Component: props =>
			<GenericPageWrapper {...props}><div>About</div></GenericPageWrapper>,
		id: 'about',
	},
]
