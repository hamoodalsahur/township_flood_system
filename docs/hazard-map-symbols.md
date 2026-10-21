# Hazard map symbols — distinct at a glance

The geographic research map uses unique pictographic pins for seven predefined hazard categories. Every symbol also appears in the legend/filter chips and in the selected-hazard detail panel.

| Category | Pin | Label |
| --- | --- | --- |
| Flooding | 🌊 | Flooding |
| Roadworks | 🚧 | Road construction |
| Fallen tree | 🌳 | Fallen tree |
| Pothole | 🕳️ | Pothole |
| Blocked road | ⛔ | Blocked road |
| Storm damage | ⛈️ | Storm damage |
| Other | ⚠️ | Other hazard |

Design requirements: understandable without color alone; keep text in tooltips/details, larger click targets, keyboard-selectable pins, consistent visual legend, and visible selection. Markers use only fixed local presentation metadata; never inject descriptions or public report text into marker HTML.

**Safety:** all current examples and submitted incident pins are *fictional demo reports*, not verified conditions at the displayed location. An icon describes a reported category, not an actual closure, road availability or safe route.

Before merging, validate map readability at small and large zoom, browser emoji appearance, keyboard tab navigation, hazard filters, incident selection, and map-position submissions. Device-specific emoji differences may merit swapping to a fixed bundled SVG icon set in a later pass.
