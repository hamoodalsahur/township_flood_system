# Source and geography verification register

**This register prevents schematic demonstration data from being mistaken for real Bandar Bukit Raja locations or measured flood conditions.**

| Record group | Current status | Classification | May the UI describe it as verified real-world geometry? | Next action |
| --- | --- | --- | --- | --- |
| 4 seeded township zones | Invented schematic polygons | Illustrative test data | **No** | Replace with permissioned / sourced BBR boundaries and citation |
| 8 graph nodes | Invented local XY coordinates | Illustrative test data | **No** | Trace and verify actual junction geometry before real map |
| 10 road / trail edges | Invented topology used to test a connected graph | Illustrative test data | **No** | Derive real network from licensed, attributed geodata |
| West/East/North demo gateways | Conceptual access links, not verified BBR routes | Illustrative test data | **No** | Verify corridor names, road geometry and access controls |
| Wetland Townpark / sponge city assertions in v2 brief | Research leads | Not yet checked in this code branch | **No** | Cross-check official primary sources, units and dates |
| JPS station IDs / flood thresholds in v2 brief | Research leads | Not yet checked in this code branch | **No** | Confirm IDs and thresholds directly with JPS |
| Emergency staging / high-ground parking hubs in v2 brief | Unverified candidate locations | Not seeded | **No** | Get operator confirmation and suitable safety assessments |
| Live weather/river readings | Not connected | Unavailable | **No** | Add documented authorised adapters, server cache, timestamps |

## Coordinate systems

- `schematic_xy`: local 0–100 coordinate canvas used only for a network diagram; cannot be placed on a geospatial map as actual streets.
- Real geography in a future phase: GeoJSON WGS84 longitude/latitude coordinates with traceable provenance. Do **not** relabel or transform the schematic positions to pretend they are real.

## API contract for Phase 1A

- `GET /api/zones`: returns `dataMode=simulation`, `coordinateSystem=schematic_xy`, zone shapes, risk as `unknown`, and provenance.
- `GET /api/roads`: returns the 8 graph nodes, 10 road edges, unknown road statuses and provenance.

Neither endpoint currently provides a flood warning, road guidance, sensor reading or predictive output.

## Data correction policy

If source evidence contradicts a future seed record, correct it with a cited change, update the source register and record the impact on geometry and related status events. Keep simulator records segregated from live records.
