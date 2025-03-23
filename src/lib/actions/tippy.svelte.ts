import type { Action } from 'svelte/action';
import tippy, { type Props } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const tippyAction: Action<HTMLElement, () => Partial<Props>> = (node, getOptions) => {
	const tooltip = tippy(node, getOptions());
	$effect(() => {
		tooltip.setProps(getOptions());
	});
	$effect(() => {
		return () => {
			tooltip.destroy();
		};
	});
};

export default tippyAction;