<script lang="ts">

  import Fares from './lib/Fares.svelte'; 

  let campaign = "vamos-con-la-sele";
  let storefronts:Record<string,string[]> = {
    'pa':["es", "en"], 
    'ec':["es", "en","pt", "fr"], 
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
      <div data-country={country} data-lang={lang} class="hidden" > 
        <Fares {lang} {country} {campaign} currency="convert"  />
      </div>
  {/each}
{/each} 



