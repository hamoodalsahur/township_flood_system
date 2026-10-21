# Mapped road metadata in the details panel

When clicking an imported road, the geographic reference map now shows the retained OSM attributes: oneway, access, bridge, tunnel, layer, motor_vehicle and junction.

Missing values appear as **Not recorded**. This means the imported file did not supply that field; it does not prove there are no restrictions. The fields are shown verbatim for research, not turned into passability, travel, flood or navigation decisions.

The feature depends on the improved importer in PR #22 and tag-value inspection in PR #23. Reimport road geometry only after backing up your local file, if you need the newly retained tags to appear.
