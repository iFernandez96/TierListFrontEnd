import { writable } from 'svelte/store';

export const currentTierList = writable(null);
export const pastTierLists = writable([]);
export const featuredCategory = writable("Movies");
