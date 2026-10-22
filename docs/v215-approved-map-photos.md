# V2.15 map marker approved-photo preview (fictional demonstration)

Clicking a fictional report marker now opens a Leaflet popup with its summary, and **automatically shows an attached sample image only if the existing public report feed explicitly marks it `hasApprovedPhoto`**. The original map-side incident detail preview still works. The popup uses the pre-existing public approved-image endpoint, whose server policy requires both a corroborated fictional report and an explicit `approved_public_demo` evidence state.

No private-image endpoint, base64 contents, raw photo URL from a user, new permission or approval mechanism is added. Static fictional marker examples and reports without separate public-demo image approval show text only. The browser does not request an unapproved image. Approved samples are clearly marked illustrative and cannot validate road status or access.

## Local acceptance
Using a **fictional/sample** report with existing explicitly approved photo, click its map marker in Resident / Maps & Simulation and verify the approved photo appears immediately in the popup. Click an unapproved marker: no image should load, and the existing private photo remains accessible to local management only. Close popup and switch markers. Confirm the original public-photo approval and review controls still work.
