<script lang="ts">

  import Fares from './lib/Fares.svelte'; 

  let campaign = "24 Hours Sale";
  let storefronts:Record<string,string[]> = {
    'pa':["es", "en"], 
    'us':["es", "en","pt"], 
    'br':["en","pt"], 
    'ar':["es", "en","pt"], 
    'mx':["es", "en"],
    'ca':["es", "en","fr"],
    'co':["es", "en"],
    'cl':["es", "en", "pt"],
    'cr':["es", "en","pt"],
    'gs':["es", "en","pt", "fr"],
  };


</script>

{#each Object.keys(storefronts) as country }
  {#each storefronts[country] as lang}
      <div data-country={country} data-lang={lang} class="" > 
        <Fares {lang} {country} {campaign} currency="convert"  />
      </div>
  {/each}
{/each} 
