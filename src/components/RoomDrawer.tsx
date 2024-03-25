import React, {CSSProperties, FC} from "react";
import type {Room} from "../@types/Graphics";

export const RoomDrawer: FC<{ currentRoom: Room | undefined, onClose: () => void }> = ({currentRoom, onClose}) => {
    const style: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0, .8)",
        transition: "all 0.2s ease-in-out",
        // width: "30%",
        width: currentRoom ? "30%" : "0%",
        opacity: currentRoom ? "1" : "0",
        padding: "1em"
    }
    return <div style={style}>
        <div id="header" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid white",
            paddingBottom: "1em"
        }}>
            <button onClick={onClose} style={{border: "none"}}>X</button>
            <h4 style={{flex: 1, width: "100%", textAlign: "center"}}>{currentRoom?.name}</h4>
        </div>
        <center><h5>Tuki grafi pa nastavitve</h5>
            <select>
                <option>IAQ</option>
                <option>Vlaga</option>
                <option>Temperatura</option>
            </select>
        </center>

    </div>
}