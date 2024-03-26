#!/bin/bash
PLUGIN_ID="innorenew-iaq-panel"
pnpm run build
cp -r dist "${PLUGIN_ID}"
zip -r "${PLUGIN_ID}.zip" "${PLUGIN_ID}"
