# Inspecting candidate road groups on the map

The geographic reference map now includes an **Inspect candidate group** selector. Selecting a smaller group filters the OSM road lines and zooms to their geographic area. Click any highlighted road for its source link and highway type. Selecting **All imported roads** shows the full geographic dataset again.

Groups are calculated locally from your imported GeoJSON using rounded shared coordinate vertices. These are not verified traffic connections or real-world isolated streets. A bridge or blocked turn can make identical coordinates misleading; conversely, a mapped crossing may lack an explicitly shared vertex.

The existing flood simulation and road access checker are not connected to this research map. No routing, passability or real flood condition is inferred.
