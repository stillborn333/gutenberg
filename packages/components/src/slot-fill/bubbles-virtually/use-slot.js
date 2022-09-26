// @ts-nocheck
/**
 * WordPress dependencies
 */
import { useCallback, useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SlotFillContext from './slot-fill-context';

export default function useSlot( name ) {
	const {
		updateSlot: registryUpdateSlot,
		unregisterSlot: registryUnregisterSlot,
		registerFill: registryRegisterFill,
		unregisterFill: registryUnregisterFill,
		...registry
	} = useContext( SlotFillContext );

	const slot = registry.slots[ name ] || {};
	const slotFills = registry.fills[ name ];
	const fills = useMemo( () => slotFills || [], [ slotFills ] );

	const updateSlot = useCallback(
		( fillProps ) => {
			registryUpdateSlot( name, fillProps );
		},
		[ name, registryUpdateSlot ]
	);

	const unregisterSlot = useCallback(
		( slotRef ) => {
			registryUnregisterSlot( name, slotRef );
		},
		[ name, registryUnregisterSlot ]
	);

	const registerFill = useCallback(
		( fillRef ) => {
			registryRegisterFill( name, fillRef );
		},
		[ name, registryRegisterFill ]
	);

	const unregisterFill = useCallback(
		( fillRef ) => {
			registryUnregisterFill( name, fillRef );
		},
		[ name, registryUnregisterFill ]
	);

	return {
		...slot,
		updateSlot,
		unregisterSlot,
		fills,
		registerFill,
		unregisterFill,
	};
}
