import { useEffect } from "react";

export default function PlayPage({ socket }) {

    useEffect(() => {
        socket.on('msg_from_server', (data) => {
            console.log(data);

        });

    }, [socket]);


    return null;
}