import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'

import { FacetedSearch as RDTSearch, Label } from "rdt-search-ui"
import { MapFacet } from "rdt-search-ui/build/facets/map"
import { ListFacet } from "rdt-search-ui/build/facets/list"
import { HistogramFacet } from "rdt-search-ui/build/facets/histogram"
import { ChartFacet } from "rdt-search-ui/build/facets/chart"

import { Indices } from '.'

const SearchWrapper = styled.div`
	padding-top: 4rem;

	#rdt-search__result-header,
	#rdt-search__active-filters,
	#rdt-search__full-text {
		position: sticky;
		top: 52px;
		z-index: 1;
		padding-top: 1rem;
	}

	#rdt-search__active-filters {
		top: 120px;
	}

`

export const FacetedSearch = (props: { index: Indices }) => {
	const [result, setResult] = React.useState<any>()
	const navigate = useNavigate()
	const ResultBodyComponent = props.index === Indices.DansRDA ? RdaResult : Result
	const facets = props.index === Indices.DansRDA ? rdaConfig: dataCiteConfig

    return (
		<SearchWrapper>
			<Routes>
				<Route
					path=""
					element={
						<RDTSearch
							ResultBodyComponent={ResultBodyComponent}
							url={`${ELASTIC_SEARCH_URL}/${props.index}/_search`}
							facets={facets}
							onClickResult={(result: any) => {
								setResult(result)
								navigate(`/search/${encodeURIComponent(result.id)}`)
							}}
						/>
					}
				>
				</Route>
				<Route
					path=":id"
					element={
						<div>
							<pre>{JSON.stringify(result, undefined, 3)}</pre>
						</div>
					}
				/>
			</Routes>
		</SearchWrapper>
    )
}

const ResultWrapper = styled.div`
	box-shadow: 0 4px 10px #DDD;
	border: 1px solid #DDD;
	margin: 0 0 2rem 0;
	padding: 1rem;

	ul {
		list-style: none;
		margin: 0;
		padding: 0;

		&.titles {
			li {
				font-weight: bold;
				margin-bottom: 1rem;
			}
		}

		&.descriptions {
			li {
				font-size: 0.8rem;
				margin-bottom: 1rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		&.subjects {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 6px;
			margin-top: 10px;

			li {
			}
		}
	}
`

const ResultWrapperRDA = styled(ResultWrapper)`
	h3 {
		border-bottom: 1px solid #DDD;
		padding-bottom: 1rem;
	}

	ul.metadata > li {
		display: flex;
		align-items: center;

		& > div:first-of-type {
			color: gray;
			width: 120px;
			font-size: .85rem;
		}
	}
`

function RdaResult(props: any) {
	const { result: item } = props
	return (
		<ResultWrapperRDA>
				<h3>
					{item.metadata.title}
				</h3>
				<ul className="metadata">
					<li>
						<div>Communities</div>
						<div>{item.community.join(', ')}</div>
					</li>
					<li>
						<div>Resource type</div>
						<div>{item.metadata.resource_type.title}</div>
					</li>
				</ul>
				<div dangerouslySetInnerHTML={{ __html: item.metadata.description }} />


				{/* DOESN'T WORK, LINKING TO ZENODO WILL RENDER: 429 TOO MANY REQUEST, MAYBE ON DETAIL PAGE? */}
				{/* <a href={item.links.latest_html}>
					<img src={item.links.badge} alt="badge" />
				</a> */}
		</ResultWrapperRDA>
	)
}

function Result(props: any) {
	const { result: item } = props

    return (
        <ResultWrapper>
			<ul className="titles">
				{
					item.attributes.titles.map((title: any, i: number) => (
						<li key={i}>
								{title.title}
						</li>
					))
				}
			</ul>
			<ul className="descriptions">
				{
					item.attributes.descriptions.map((description: any, i: number) => (
						<li key={i} title={description.description}>{description.description}</li>
					))
				}
			</ul>
			<ul className="subjects">
				{
					item.attributes.subjects.map((subject: any, i: number) => (
						<li key={i} title="subject">
							<Label>{subject.subject}</Label>
						</li>
					))
				}
			</ul>
		</ResultWrapper>
    )
}

const dataCiteConfig = [
	new MapFacet({
		field: 'location',
	}),
	new ListFacet({
		field: 'attributes.subjects.subject.keyword',
		title: 'Subject',
	}),
	new ListFacet({
		field: "relationships.client.data.id.keyword",
		title: "Client ID",
	}),
	new ChartFacet({
		field: "relationships.client.data.id.keyword",
		title: "Client ID",
	}),
	new ListFacet({
		collapse: false,
		field: "attributes.creators.name.keyword",
		title: "Creators",
	}),
	new ListFacet({
		field: "attributes.subjects.lang.keyword",
		title: "Language",
	}),
	new ChartFacet({
		field: "attributes.subjects.lang.keyword",
		title: "Language",
	}),
	new HistogramFacet({
		field: "publicationYear",
		title: "Publication year",
		interval: 1,
	}),
]

const rdaConfig = [
	new ListFacet({
		field: "community",
		title: "Community",
	}),
	new ListFacet({
		field: "metadata.resource_type.title.keyword",
		title: "Resource type",
	}),
	new ChartFacet({
		field: 'metadata.language.keyword',
		title: 'Language',
	}),
	new HistogramFacet({
		field: 'stats.unique_views',
		title: 'Unique views',
		interval: 500
	}),
	new ListFacet({
		field: "metadata.keywords.keyword",
		title: "Keywords",
	}),
]