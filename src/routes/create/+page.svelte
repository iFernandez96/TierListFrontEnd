<script lang="ts">
  import Sortable from "sortablejs";

  let defaultTiers = [
    { name: "S", color: "bg-red-500", items: [] },
    { name: "A", color: "bg-orange-500", items: [] },
    { name: "B", color: "bg-yellow-500", items: [] },
    { name: "C", color: "bg-green-500", items: [] },
    { name: "D", color: "bg-blue-500", items: [] },
    { name: "E", color: "bg-indigo-500", items: [] },
  ];
  
  let tiers = defaultTiers;
  let availableItems = ["Spiderman", "Superman", "Batman", "Wonderwoman"];

  // For tier containers (droppable areas for tiers)
  function makeSortable(node: HTMLElement, tierIndex: number) {
    new Sortable(node, {
      animation: 200,
      group: {
        name: "shared",
        pull: true,
        put: true
      },
      ghostClass: "sortable-ghost",
      onAdd: (event) => {
        const toTier = event.to.dataset.tier;
        if (toTier && toTier !== "available") {
          const toTierIndex = tiers.findIndex((t) => t.name === toTier);
          if (toTierIndex !== -1) {
            // Get the moved item’s text content.
            const itemText = event.item.textContent.trim();
            // Insert it at the new index in the target tier’s items array.
            tiers[toTierIndex].items.splice(event.newIndex, 0, itemText);
            // Reassign the tiers array to trigger reactivity.
            tiers = [...tiers];
            // Remove the moved DOM element – Svelte will re-render it based on the updated state.
            if (event.item && event.item.parentNode) {
              event.item.parentNode.removeChild(event.item);
            }
          }
        }
      },
      onRemove: (event) => {
        const fromTier = event.from.dataset.tier;
        if (fromTier && fromTier !== "available") {
          const fromTierIndex = tiers.findIndex((t) => t.name === fromTier);
          if (fromTierIndex !== -1) {
            tiers[fromTierIndex].items.splice(event.oldIndex, 1);
            tiers = [...tiers];
          }
        }
      }
    });
  }

  // For the available items container.
  function makeItemsSortable(node: HTMLElement) {
    new Sortable(node, {
      animation: 200,
      group: {
        name: "shared",
        pull: true,
        put: false  
      },
      ghostClass: "sortable-ghost",
      onRemove: (event) => {
        availableItems.splice(event.oldIndex, 1);
        availableItems = [...availableItems];
      }
    });
  }
</script>

<style>
  .sortable-ghost {
    opacity: 0.4;
  }
</style>

<main class="container mx-auto p-4 space-y-4">
  {#each tiers as tier, tierIndex}
    <div class="card shadow-xl">
      <div class="card-body flex flex-row items-center p-0">
        <div class={`w-20 h-16 flex items-center justify-center text-white font-bold text-xl rounded-l ${tier.color}`}>
          {tier.name}
        </div>
        <div
          use:makeSortable={tierIndex}
          data-tier={tier.name}
          class="flex-1 min-h-[4rem] bg-base-100 p-4 flex flex-wrap gap-2 rounded-r">
          {#each tier.items as item (item)}
            <div class="badge badge-outline p-4 cursor-move shadow">
              {item}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/each}
  
  <div class="card shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Available Items</h2>
      <div use:makeItemsSortable class="flex flex-wrap gap-2 p-2" data-tier="available">
        {#each availableItems as item (item)}
          <div class="badge badge-outline p-4 cursor-move shadow">
            {item}
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

