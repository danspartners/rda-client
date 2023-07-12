# RDA client

## Start development environment
- $ cd \<rda-client-root\>

<!-- Start ES containers -->
- $ npm start <!-- make sure `sysctl -w vm.max_map_count=262144` -->

<!-- Install local deps -->
- $ ./scripts/link-deps.sh

<!-- Run and watch the frontend -->
- $ npm run serve
- $ npm run watch

<!-- Profit! -->
- App => localhost:8000
- Kibana => localhost:5601 <!-- user: elastic, pass: see .env ELASTIC_PASSWORD -->

## Start dev with remote demo server ES data
all the same, exept for:
- NODE_ENV=demo npm run serve

## Deploy to DEMO
- cd \<root\>/packages/frontend
- npm run dist
- ./scripts/deploy-demo.sh

<!-- ## cURL with ca.crt to localhost
- $ curl --cacert ca.crt -u elastic https://localhost:9200/_cat/indices -->

