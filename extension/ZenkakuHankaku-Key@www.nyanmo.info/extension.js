/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GObject from 'gi://GObject';
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Gio from 'gi://Gio';
import Soup from 'gi://Soup'
import GLib from 'gi://GLib'

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// websocket logic -----------------------------------
// ref -> https://github.com/GNOME/gjs/blob/master/examples/http-client.js
// ref -> https://gitlab.gnome.org/GNOME/gjs/-/blob/master/examples/websocket-client.js

// init section
let session = new Soup.Session();
let connection = null
let connectionOK = false
const message = new Soup.Message({
    method: 'GET',
    uri: GLib.Uri.parse('ws://127.0.0.1:50096', GLib.UriFlags.NONE),
});
setTimeout(() => {
    session.websocket_connect_async(message, null, [], null, null, websocket_connect_async_callback);
},10000)

// main logic for keyevent
function sendBacktick() {
    if(connectionOK){
        connection.send_text("enter")
    }else{
        Main.notify(_("Sending keyevent reqest failed due to connection error. Wait at least 10 sec."))
    }
}

// keep alive
keepAliveWebSocket()
function keepAliveWebSocket(){
    if(connectionOK){
        connection.send_text("keepPacket")
    }else{
        // Main.notify(_("unable to keep connection"))
    }
    setTimeout(() => {keepAliveWebSocket()},500)// 0.5 sec
}


function websocket_connect_async_callback(_session, res){
    try{
        connection = session.websocket_connect_finish(res)
        connectionOK = true
    }catch(error){
        Main.notify(_("Unable connect to server. please check server is running"))
        Main.notify(_(String(error)))
    }

    
    // https://gitlab.gnome.org/GNOME/gjs/-/blob/master/examples/websocket-client.js ----------
    connection.connect('closed', () => {
        log('closed');
        Main.notify(_("websocket closed now."))

        // loop.quit();
    });

    connection.connect('error', (self, err) => {
        logError(err);
        Main.notify(_("websocket got error."))
        Main.notify(_(String(err)))        
        // loop.quit();
    });

    connection.connect('message', (self, type, data) => {
        if (type !== Soup.WebsocketDataType.TEXT)
            return;

        const str = decoder.decode(data.toArray());
        log(`message: ${str}`);sssss
        Main.notify(_("websocket got message from backend."))
        Main.notify(_(`message: ${str}`))
        // connection.close(Soup.WebsocketCloseCode.NORMAL, null);
    });

    log('open');
    // Main.notify(_("websocket working now."))
    connection.send_text('hello');
    // https://gitlab.gnome.org/GNOME/gjs/-/blob/master/examples/websocket-client.js ----------
}
// websocket logic -----------------------------------




const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('ZenkakuHankaku-Key'),true); // true mean dont_create_menu



        let homedir     = GLib.get_home_dir() + "/"
        let extdir      = homedir + ".local/share/gnome-shell/extensions/ZenkakuHankaku-Key@www.nyanmo.info/"
        let iconPath    = extdir + "imgs/全角半角キー.png"
        Main.notify(_(String(iconPath)))
        let gicon = Gio.icon_new_for_string(`${iconPath}`);

        this.add_child(new St.Icon({
            gicon: gicon,
            style_class: 'system-status-icon switchButton',
        }));
        
        // when TopBar Icon is clicked.
        this.connect('button-press-event', (actor, event) => {
            // Main.notify(_("Button pressed"))
            sendBacktick()
        });

        // when TopBar Icon is touched.
        this.connect('touch-event', (actor, event) => {
            // Main.notify(_("Button pressed by touch"))
            // Main.notify(_(String(event.type())))
            
            if(event.type() == Clutter.EventType.TOUCH_BEGIN){
                sendBacktick()
            }
        });
    }
});

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
