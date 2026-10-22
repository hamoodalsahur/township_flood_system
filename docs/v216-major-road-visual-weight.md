# V2.16 softer major-road appearance

The V2.15 dark-blue imported OSM main roads had a 5.5 px line weight and 0.95 opacity, which crowded the map when zoomed out. The same dark-blue hue (#2563eb) now uses a **3.8 px weight and 0.58 opacity**. Local, service, other-road category styles and existing hazard icon designs are unchanged. Selected lines continue to use the existing stronger highlight.

This changes only visual presentation of locally imported, unverified OSM lines. The map background tiles may use different original OSM styles. The separately labelled dashed *fictional corroborated-report proximity* overlay remains unchanged, opt-out, and is never a verified road status or navigation instruction.

**Review:** At zoom 13–15, compare main-road visual dominance with local streets. Verify small road visibility, selected-line highlighting, marker clicking, and both human-reviewed fictional vicinity legend and the approved sample photo popup. No local GeoJSON imports, database writes or permissions changes.
