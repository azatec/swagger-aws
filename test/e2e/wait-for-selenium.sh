#!/bin/bash -u

HOST=localhost
PORT=4444

ADDRESS="http://${HOST}:${PORT}/wd/hub/static/resource/hub.html"

probeSelenium() {
    curl -s ${ADDRESS} > /dev/null
    return $?
}

until probeSelenium; do
    >&2 echo "Selenium unvailable. Sleeping..."
    sleep 1
done
