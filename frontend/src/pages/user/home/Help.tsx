import io, { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import '../../../index.css';
import ChatWindow from '../../../components/ChatWindow';
import { useQuery } from 'react-query';
import * as apiClient from '../../../api-client';
import { UserType } from '../../../../../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const socket: Socket = io(API_BASE_URL);

const Help = () => {
    const [name, setName] = useState<string>("");
    const [roomId] = useState<string>("ChatRoom");

    useQuery("loadAccount", apiClient.loadAccount,
        {
            onSuccess: (user: UserType) => {
                setName(`${user.firstName} ${user.lastName}`);
            },
            onError: () => { }
        }
    );

    useEffect(() => {
        if (name !== "" && roomId !== "") {
            socket.emit("join_room", roomId)
        }
    }, [name, roomId]);

    return (
        <div className="flex flex-col h-screen justify-center items-center bg-gray-100 rounded">
            <ChatWindow socket={socket} name={name} roomId={roomId} />
        </div>
    );
}
export default Help;
