#!/bin/bash
SYSTEMD_SERVICE_DIR="/etc/systemd/system/"
DISTRIB_ID="$(cat /etc/*-release | grep 'DISTRIB_ID')"

echo "env info -------------------"
echo ""
echo "HOME"
echo "${HOME}"
echo ""
echo "SYSTEMD_SERVICE_DIR"
echo "${SYSTEMD_SERVICE_DIR}"
echo ""
echo "DISTRIB_ID"
echo "${DISTRIB_ID}"
echo "env info end ---------------"


sudo systemctl disable ZenkakuHankakuKeyd.service 
sudo systemctl stop ZenkakuHankakuKeyd.service 
sudo rm "${SYSTEMD_SERVICE_DIR}ZenkakuHankakuKeyd.service"
rm -rfd "${HOME}/.local/share/gnome-shell/extensions/ZenkakuHankaku-Key@www.nyanmo.info"