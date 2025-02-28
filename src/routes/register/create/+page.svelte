<script lang="ts">
  // https://github.com/SortableJS/Sortable for documentation on sortablejs
  import Sortable from "sortablejs";

  let defaultTiers = [
    { name: "S", color: "bg-red-500", items: [] },
    { name: "A", color: "bg-orange-500", items: [] },
    { name: "B", color: "bg-yellow-500", items: [] },
    { name: "C", color: "bg-green-500", items: [] },
    { name: "D", color: "bg-blue-500", items: [] },
    { name: "E", color: "bg-indigo-500", items: [] },
  ];

  let tiers = $state(defaultTiers);

  let availableItems = $state(["Spiderman", "Superman", "Batman", "Wonderwoman"]);

  // Set up drag-and-drop for each tier's droppable area.
  function makeSortable(node : HTMLElement, _ : number) {
    new Sortable(node, {
      animation: 200,
      group: "shared",
      onEnd: (event) => {
        const fromTier = event.from.dataset.tier;
        const toTier = event.to.dataset.tier;
        const fromIndex = tiers.findIndex((t) => t.name === fromTier);
        const toIndex = tiers.findIndex((t) => t.name === toTier);
        if (fromIndex === -1 || toIndex === -1)
            return;
        const [movedItem] = tiers[fromIndex].items.splice(event.oldIndex, 1);
        tiers[toIndex].items.splice(event.newIndex, 0, movedItem);
      }
    });
  }

  // Set up drag-and-drop for available items.
  function makeItemsSortable(node : HTMLElement) {
    new Sortable(node, {
      animation: 200,
      group: "shared",
      onEnd: (event) => {
        const [movedItem] = availableItems.splice(event.oldIndex, 1);
        // Add dropped item to S-tier by default.
        tiers[0].items.push(movedItem);
      }
    });
  }
</script>


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
          {#each tier.items as item}
            <div class="badge badge-secondary p-4 cursor-move shadow">
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
      <div use:makeItemsSortable class="flex flex-wrap gap-2 p-2">
        {#each availableItems as item}
          <div class="badge badge-outline p-4 cursor-move shadow">
            {item}
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

