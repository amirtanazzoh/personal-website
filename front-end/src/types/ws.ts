export type ServerToClientEvents = {
    message: ( data: string ) => void;
    // Add other server → client events here
};

export type ClientToServerEvents = {
    sendMessage: ( data: string ) => void;
    // Add other client → server events here
};