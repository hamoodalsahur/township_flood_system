# Geographic map refinement

The optional BBR-area reference map can now distinguish OpenStreetMap `highway` categories. Major roads have stronger styling; small service roads are less prominent. Use the category selector to focus on a group, and click a line to inspect its name, OSM type and source link.

The map reads `public/data/bbr-roads.geojson`. This file is generated on the developer's machine using `npm run geo:import`. An empty file in the repository is intentional. **Do not overwrite or discard your local 1,269-line import when changing branches.** Check `git status` first; if Git would overwrite the file, copy it somewhere safe outside the repository, switch branches, then restore it.

Road categories are visual groupings based on OSM's `highway` tag, not safety categories. Our real-world geographic data is still unverified. The schematic simulation, road reports and theoretical connectivity analysis are separate and have not been connected to these lines.

Next milestone: review geographic coverage and intersections. A visual crossing of two polylines does not automatically imply a drivable connection (bridges, separated lanes and intersections must be checked).
