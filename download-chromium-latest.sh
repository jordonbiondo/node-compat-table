
LATEST=$(node chromium-latest.js)
DIR=${1:-'./chromium-latest'}

if [[ $? -eq 0 && $LATEST ]]; then
  echo "Downloading: $LATEST"
  curl -L --progress-bar $LATEST > ./chromium-latest.zip

  if [[ $? -eq 0 ]]; then
    unzip -q -u -o -d $DIR ./chromium-latest.zip
  fi

fi
