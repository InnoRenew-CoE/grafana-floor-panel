#!/bin/bash
PLUGIN_ID="innorenew-iaq-panel"
# pnpm run build
rm -r $PLUGIN_ID
cp -R dist $PLUGIN_ID
zip -FSr "${PLUGIN_ID}.zip" $PLUGIN_ID
md5sum "${PLUGIN_ID}.zip" > "${PLUGIN_ID}.md5"
#unzip innorenew-iaq-panel
