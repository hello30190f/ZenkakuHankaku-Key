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


sudo cp ./extension/ZenkakuHankaku-Key@www.nyanmo.info/backend/ZenkakuHankakuKeyd.service "${SYSTEMD_SERVICE_DIR}ZenkakuHankakuKeyd.service"
cp -r ./extension/ZenkakuHankaku-Key@www.nyanmo.info "${HOME}/.local/share/gnome-shell/extensions/ZenkakuHankaku-Key@www.nyanmo.info"
sudo systemctl enable --now ZenkakuHankakuKeyd.service 

