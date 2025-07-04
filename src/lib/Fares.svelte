<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { onMount } from 'svelte';
	import getDirectusInstance from './directus';
	import { readItems } from '@directus/sdk';
  	import calendarIcon from './assets/icons/calendar-icon.svg'
	
	type ConversionRequest = {currency:string, rate:number}
	type Conversion = Record<string,number>
	let isLoading = true;
	let error: string | null = null;
	let fares: Fares[] = [];
	let conversion:Conversion = {} 


	export let lang ;
	export let country;
	export let campaign;
	export let currency;
	const validStorefronts = ['pa', 'us', 'br', 'ar', 'mx', 'ca', 'co', 'cl', 'cr', 'gs'];


	const destinationQuery = [
		{ country: [{ translations: ['name'] },'currency_code'] },
		'iata_code',
		'main_image',
	
		{
			categories: [
				{
					destination_category_id: [
						{
							translations: ['name']
						}
					]
				}
			]
		},
		{ translations: ['name'] },
		
	];
	
	const translationFilter = {
		translations: {
			_filter: {
				languages_code: {
					_eq: lang
				}
			}
		}
	};

	const countryFilter = (storefront: string) => {
	
		if (!validStorefronts.includes(storefront) || storefront === 'gs')
			return { _nin: validStorefronts.filter((sf) => sf !== 'gs').map((sf) => sf.toUpperCase()) };
		return { _eq: storefront.toUpperCase() };
	};

	const query = {
		fields: [
			{ origin: destinationQuery },
			{ destination: destinationQuery },
			'departure',
			'return',
			'price',
			'price_before',
			'taxes',
		],
		filter: {
			_and: [
				{
					campaign: {
						_eq: campaign
					}
				},
				{
					origin: {
						country: countryFilter(country)
					}
				}
			]
		},
		deep: {
			origin: {
				categories: {
					destination_category_id: translationFilter
				},
				...translationFilter,
				country: translationFilter,

			},
			destination: {
				categories: {
					destination_category_id: translationFilter
				},
				...translationFilter,
				country: translationFilter
			},
			
		}
	};

	const allConversionquery = {
		fields:["*"]
	}

	const directus = getDirectusInstance(fetch);


onMount(async () => {
try {

  const [faresData, conversionsRequest ] = await Promise.all([directus.request(readItems('custom_fare', query)),directus.request(readItems('currency_conversion_rate', allConversionquery)) ]);

  fares = faresData as Fares[];
  conversion = (conversionsRequest as ConversionRequest[]).reduce((a,c) => ({...a,[c.currency]:c.rate}),{});
	



} catch (err) {
  error = 'No hay tarifas.';
  console.error(err);
} finally {
  isLoading = false;
}
});

	function formatDateShort(date: string, lang: string): string {
		const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
		const locale = lang === 'es' ? 'es-419' : lang === 'en' ? 'en-US' : 'pt-BR';
		// formato encontrado para cambiar la fecha
		return new Date(date).toLocaleDateString(locale, options).replace('.', '');
	}

	function formatCurrency(price:number, currency:string){
	
		if(!price || !currency)
		return price

		const separator = ["COP", "BRL"].includes(currency) ? "." : ","  
		return (""+price).replace(/\B(?=(\d{3})+(?!\d))/g, separator)

	}

	function getCurrencyCode(storefront: string, currency: string){
		if(!storefront || !currency || !validStorefronts.includes(storefront) || storefront==="gs")
			return "USD"
		return currency.toUpperCase()
	}

	function getExchangeRate(currency:string, code:string, storefront: string, price:number){
		if(!storefront || !currency || !code || !validStorefronts.includes(storefront) || storefront==="gs" || currency!=="convert")
			return formatCurrency(Math.ceil(price), "USD")
		const rate = conversion[code]
		return formatCurrency(Math.ceil(price/rate), code)
	}

</script>

<!--  PRINT FOR DEBUG QUERY
<style>
	section {
	  margin-block: var(--size-7);
	  padding: var(--size-7);
	  color: var(--gray-0);
	  background-color: var(--gray-10);
	  border-radius: var(--radius-2);
	  box-shadow: var(--shadow-1);
	}
  
	pre {
	  font-size: var(--font-size-3);
	  margin-top: var(--size-3);
	}
  </style>
{#each fares as fare}
<section class="container">
	<h4>Query Parameters for <span class="font-bold uppercase">{country}</span> in <span class="font-bold uppercase">{lang}</span></h4>
	<pre class="max-w-prose text-wrap">
	  {JSON.stringify({ fares}, null, 3)}
	</pre>
  </section>
  {/each}
-->
<div class="container mx-auto">
	{#if isLoading}
	<ol class="grid justify-center gap-3" style="grid-template-columns: repeat(auto-fit, minmax(376px, 1fr))">
			{#each Array(6) as _}
		<div class="custom-fares h-full w-full max-w-[400px]">
			<div
				class="grid h-40 grid-cols-[8px_116px_auto_8px] grid-rows-[8px_auto_auto_8px] overflow-hidden rounded-2xl outline outline-1 outline-grey-300 animate-pulse">
				<div class="col-start-1 col-end-3 row-span-full h-full w-full bg-grey-300 object-cover"></div>

				<div class="col-start-3 col-end-3 row-start-2 row-end-2 mx-2 mb-2 flex flex-col gap-1">
					<div class="h-6 rounded-2xl bg-grey-300"></div>
					<div class="mt-3 h-3 max-w-40 rounded-2xl bg-grey-300"></div>
					<div class="mt-0.5 h-3 max-w-24 rounded-2xl bg-grey-300"></div>
				</div>
			</div>
		</div>
			{/each}
	</ol>
	{:else if error}
		<p>{error}</p>
	{:else if fares.length > 0}
		<ol class="grid justify-center gap-3 pb-8" style="grid-template-columns: repeat(auto-fit, minmax(376px, 1fr));">
			{#each fares as fare}
				<li class="custom-fares h-full w-full max-w-[400px]">
					<a class="grid grid-cols-[8px_116px_auto_8px] grid-rows-[8px_auto_auto_8px] overflow-hidden rounded-2xl outline outline-1 outline-grey-300 hover:outline-2 hover:outline-primary-ultralight focus:outline-2 focus:outline-primary-ultralight"
						href="https://shopping.copaair.com/?roundtrip=true&adults=1&children=0&infants=0&sf={country}&langid={lang}&date1={fare.departure}&date2={fare.return}&promocode=&area1={fare.origin.iata_code}&area2={fare.destination.iata_code}&advanced_air_search=false&flexible_dates_v2=false&origin=EM"
						role="button"
						data-oac={fare.origin.iata_code}
						data-dac={fare.destination.iata_code}
						data-departure-date={fare.departure}
						data-return-date={fare.return}
						data-price={`USD ${fare.price}`}>

						<img
						class="col-start-1 col-end-3 row-span-full h-full w-full object-cover"
						loading="lazy"
						src="https://cm-marketing.directus.app/assets/{fare.destination.main_image}"
						alt={fare.origin.translations[0]?.name}
						/>
         
						<span class="col-start-3 col-end-3 row-start-2 row-end-2 mx-2 mb-2 flex flex-col gap-1">
							<span
								class="text-b font-bold flex h-auto flex-col font-gilroy text-primary">
								<span>
									{fare.origin.translations[0]?.name} ({fare.origin.iata_code})
									{lang === 'es' ? ' a' : lang === 'en' ? ' to' : ' para'}
								</span>
								<span>
									{fare.destination.translations[0]?.name} ({fare.destination.iata_code})
								</span>
							</span>
							<span class="flex h-auto items-center gap-2">
								<img src="https://cm-marketing.directus.app/assets/5c8e2708-d6e2-4de0-ad47-60b94c7f512f" class="h-[10.3px] w-[11.6px]" alt="date" />
								<span class="font-suisse font-normal text-d3 text-grey-600">
									{lang === 'es'
										? ' Ida y Vuelta'
										: lang === 'en'
											? ' Roundtrip'
											: ' Ida e volta'}<br />{formatDateShort(fare.departure, lang)} - {formatDateShort(
										fare.return,
										lang
									)}
								</span>
							</span>
						</span>
						<span class="col-start-3 col-end-3 row-start-3 row-end-3 mx-2 mt-2">
							<span class="flex grid-rows-subgrid flex-col items-end">
								
								<!-- {#if fare.price_before}
									<span
										class="font-normal text-d1 self-end font-suisse text-grey-600 line-through ">
										{getCurrencyCode(country, fare.origin.country.currency_code)}&nbsp;{getExchangeRate(currency, fare.origin.country.currency_code, country, fare.price_before )}
									</span>
								{/if} -->
								<span class="gap-y-2">
									<span class="font-suisse font-normal text-d3 text-grey-600 ">
										{lang === 'es' ? 'desde' : lang === 'en' ? 'from' : 'de'}
										<span
											class="text-u2 font-gilroy font-bold text-primary lg:text-u1 ">
											{getCurrencyCode(country, fare.origin.country.currency_code)}&nbsp;{getExchangeRate(currency, fare.origin.country.currency_code,country, fare.price )}<sup>*</sup>
										</span>
									</span>
								</span>
							</span>
							{#if fare.taxes}
								<span class="font-suisse flex gap-1 justify-end font-normal text-d3 text-grey-600  s-TlaWMsF1F1vX">
									<strong>{lang === 'es' ? 'Impuestos incluidos de' : lang === 'en' ? 'Taxes included' : 'Impostos incluídos em'}</strong> ${fare.taxes}
								</span>
							{/if}
						</span>
					</a>
				</li>
			{/each}
		</ol>
	{:else}
		<p></p>
	{/if}
</div>
