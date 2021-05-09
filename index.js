// Generate an animated accordion

'use strict';

//Imports
const R = require('ramda');
const F = require('funTools');
const Result = require('folktale/result');
const Velocity = require('velocity-animate');


/**
 * Get the header ID
 *
 * object -> Node -> Result string
 */
const getHeaderId = config => header => F.safeGetAttribute(config.headerIdDataAttr)(header);


/**
 * Get the panel ID
 *
 * object -> Node -> Result string
 */
const getPanelId = config => panel => F.safeGetAttribute(config.panelIdDataAttr)(panel);


/**
 * Get a panel by ID
 *
 * object -> int -> Result Node
 */
const getPanelById = config => panelId => F.safeGetElementByAttributeValue(config.panelIdDataAttr)(panelId)(document);


/**
 * Get all headers
 *
 * object -> HTMLCollection
 */
const getHeaders = config => F.myGetElementsByClassName(config.headerClass);


/**
 * Get all panels
 *
 * object -> HTMLCollection
 */
const getPanels = config => F.myGetElementsByClassName(config.panelClass);


/**
 * Do a header and panel have matching IDs?
 *
 * object -> Node -> Node -> bool
 */
const matchingIds = config => header => panel => R.lift(R.equals)(getHeaderId(config)(header), getPanelId(config)(panel)).getOrElse(false);


/**
 * Does the panel contain the header?
 *
 * Node -> Node -> bool
 */
const panelContainsHeader = header => panel => panel.contains(header);


/**
 * Is the panel related to the header?
 *
 * object -> Node -> Node -> bool
 */
const panelIsUnrelated = config => header => panel => R.allPass([
  R.complement(matchingIds(config)(header)),
  R.complement(panelContainsHeader(header))
])(panel);


/**
 * Is the panel open?
 *
 * Node -> bool
 */
const isOpen = node => node.offsetWidth > 0 || node.offsetHeight > 0 || node.getClientRects().length > 0;


/**
 * Open the panel
 *
 * object -> Node -> side effect
 */
const openPanel = config => panel => Velocity(panel, 'slideDown', { duration: config.duration });


/**
 * Close the panel
 *
 * object -> Node -> side effect
 */
const closePanel = config => panel => Velocity(panel, 'slideUp', { duration: config.duration });


/**
 * Toggle the panel open/close state
 *
 * config -> Node -> side effect
 */
const togglePanel = config => panel => R.ifElse(
  isOpen
  , closePanel(config)
  , openPanel(config)
)(panel);


/**
 * Close all panels unrelated to the header that was clicked
 *
 * object -> Node -> side effect
 */
const closeUnrelatedPanels = config => header => R.compose(
  R.map(closePanel(config)),
  R.filter(isOpen),
  R.filter(panelIsUnrelated(config)(header)),
  getPanels
)(config);


/**
 * Process a click on a header
 *
 * object -> Node -> Event -> side effect
 */
const processClick = config => header => e => R.compose(
  R.tap(R.map(togglePanel(config))),
  R.tap(R.map(R.unless(isOpen, R.always(closeUnrelatedPanels(config)(header))))),
  R.chain(getPanelById(config)),
  getHeaderId(config)
)(header);


/**
 * Attach a click event listener to a header
 *
 * object -> Node -> side effect
 */
const attachClickListener = config => header => R.chain(F.attachListener('click'), processClick(config))(header);


/**
 * Initialise the accordion
 *
 * string -> string -> string -> string -> int -> side effect
 */
const accordion = headerClass => panelClass => headerIdDataAttr => panelIdDataAttr => duration => {
  const config = { headerClass, panelClass, headerIdDataAttr, panelIdDataAttr };

  R.map(attachClickListener(config))(getHeaders(config));
}


module.exports = accordion;
