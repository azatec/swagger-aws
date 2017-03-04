#!/bin/bash -u

HOST=localhost
PORT=4444

ADDRESS="http://${HOST}:${PORT}/grid/console"

probeSelenium() {
    curl -s ${ADDRESS} > /dev/null
    return $?
}

probeBrowser() {
    local browser
    browser=$1

    curl -s ${ADDRESS} | grep "browserName=${browser}" > /dev/null
    return $?
}

until probeSelenium; do
    >&2 echo "Selenium unvailable. Sleeping..."
    sleep 1
done

until probeBrowser 'chrome'; do
    >&2 echo "Chrome node unavailable. Sleeping..."
    sleep 1
done

until probeBrowser 'firefox'; do
    >&2 echo "Firefox not unavailable. Sleeping..."
    sleep 1
done
