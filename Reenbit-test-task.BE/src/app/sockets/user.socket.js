const connectedUsers = [];

const userSocket = (io, socket) => {
  socket.on('user_connected', (data) => {
    connectedUsers.push(data.userId);
  });
};

export default userSocket;
export { connectedUsers };
