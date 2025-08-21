# ZenkakuHankaku-Key (incomplete)
A Gnome extension for wayland and touchpanel environment. Give better Japanese input support with GNOME OSK. 

# Sample image
 sitll nothing...

# Useage(coming soon...)
## install
```bash
sudo ./install.sh
```
## uninstall
```bash
sudo ./uninstall.sh
```

## manual installation (incomplete)
### backend
1. place ZenkakuHankakuKeyd.service 
```bash
# arch linux example
cp ./backend/ZenkakuHankakuKeyd.service /etc/systemd/system/ZenkakuHankakuKeyd.service
```
2. fix filepath for server.py (backend)
```bash
# old
ExecStart=/server.py

# new
# "/home/[username]/" should be adjusted depend on your username and home directory path.
ExecStart=/home/[username]/.local/share/gnome-shell/extensions/ZenkakuHankaku-Key@www.nyanmo.info/backend/server.py
```
3. enable backend
```bash
sudo systemctl enable --now ZenkakuHankakuKeyd.service 
```

### GNOME extension


