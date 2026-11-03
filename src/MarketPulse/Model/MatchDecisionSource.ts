/**
 * Who made a match's current decision. `user` is a person pressing accept or decline; `system` is the
 * matcher (an exact barcode accept) or the sweep returning one to pending; `sibling_cascade` is the
 * decline an accept applies to the other candidates for the same product.
 */
export type MatchDecisionSource = 'user' | 'system' | 'sibling_cascade';
