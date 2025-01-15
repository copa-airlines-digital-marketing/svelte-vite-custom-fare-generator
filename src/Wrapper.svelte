<script lang="ts">
  import { onMount } from 'svelte';

    let language:string
    export {language as lang}

    let pais:string
    export {pais as country}

    let parent: HTMLDivElement

    let skeleton = true

    onMount(()=>{
        setTimeout(() => {

            [...parent.children].forEach((child)=> {
                if(child.getAttribute("data-country") !== pais || child.getAttribute("data-lang") !== language )
                parent.removeChild(child);
                child.classList.remove("hidden")
        })
    
        skeleton = false
            }, 350)
        })
</script>

{#if skeleton}
<div class="container mx-auto">
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
</div>
    {/if}
    
<div bind:this={parent}>
    <slot></slot>
</div>

