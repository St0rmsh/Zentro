import type { Socket } from "socket.io";


export const userSocketMap = new Map<string,string>()



export const addUser = (userId:string , socketId:string)=>{
    userSocketMap.set(userId,socketId)
}

export const removeUser = (socketId: string) => {
  for (const [userId, id] of userSocketMap.entries()) {
    if (id === socketId) {
      userSocketMap.delete(userId);
      break;
    }
  }
};


export const getSocketId = (userId: string) => {
  return userSocketMap.get(userId);
};

