import { createDirectus, rest, staticToken } from '@directus/sdk';



function getDirectusInstance(fetch) {
  	
	const options = fetch ? { globals: { fetch } } : {};

	const directus = createDirectus('https://cm-marketing.directus.app', options ).with(staticToken('td20Cl6zJ-deTLVDB8VgHS6ZGwBrmF6q')).with(rest())
	
	return directus;
}




export default getDirectusInstance;