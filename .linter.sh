#!/bin/bash
cd /home/kavia/workspace/code-generation/cinequiz-duel-35385-ad866e86/cinequiz_duel_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

