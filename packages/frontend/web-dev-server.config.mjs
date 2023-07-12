import path from 'path'
import proxy from 'koa-proxies'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve('../../.env') })

const target = process.env.NODE_ENV === 'demo'
	? `http://${process.env.DANS_DEMO_ES_URL}:9200`
	: `http://localhost:9200`

// const reactivesearchTarget = process.env.NODE_ENV === 'demo'
// 	? `http://${process.env.DANS_DEMO_ES_URL}:9200`
// 	: `http://localhost:${process.env.DANS_SAD_REACTIVESEARCH_PORT}`

console.log(`Proxying /api/search to '${target}'`)
// console.log(`Proxying /api/reactivesearch to '${reactivesearchTarget}'`)
export default {
	appIndex: 'index.html',
	watch: true,
	middleware: [
		proxy('/api/search', {
			target,
			rewrite: path => {
				return path.replace('/api/search/', '/')
			}
		}),
		// proxy('/api/reactivesearch', {
		// 	target: reactivesearchTarget,
		// 	rewrite: path => path.replace('/api/reactivesearch', '/')
		// }),
	]
}
