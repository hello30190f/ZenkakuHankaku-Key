#!/usr/bin/env python3
import uinput
import asyncio

from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK

device = uinput.Device([uinput.KEY_GRAVE])

async def enterGrave(websocket):
    # keep socket from closing
    while True:
        try:
            message = await websocket.recv()
            if(message == "enter"):
                print("working")
                device.emit_click(uinput.KEY_GRAVE)
            print(f"<<< {message}")
        except ConnectionClosedOK:
            break

async def main():
    async with serve(enterGrave, "localhost", 50096) as server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())