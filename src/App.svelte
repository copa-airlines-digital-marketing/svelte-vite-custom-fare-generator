<script lang="ts">

  import Fares from './lib/Fares.svelte';
  import { default as Preset } from 'cmds-tailwind-styles';
console.log(JSON.stringify(Preset)) 
</script>

<div class="text-primary">
<Fares lang="es" country="cr" campaign="24 Hours Sale" currency="convert"  />
</div>
<style>

</style>
