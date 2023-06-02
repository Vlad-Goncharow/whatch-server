let rooms = []

export const createRoom = (userId, roomId) => {
  const isRoomReady = rooms.find(room => room.roomId === roomId)

  if (!isRoomReady) {
    rooms.push({
      isPlay: false,
      time: 0,
      roomId,
      videoLink: "",
      admin: userId,
      users: [],
      maxUsers: 5
    })
    return {
      create: true
    }
  } else {
    return {
      create: false
    }
  }
}

export const checkAdmin = (userId, roomId) => {
  const isRoomReady = rooms.find(room => room.roomId === roomId)

  if (isRoomReady) {
    if (isRoomReady.admin === userId) {
      return true
    } else {
      return false
    }
  }
}

export const deleteRoom = (roomId) => {
  const isRoomReady = rooms.find(room => room.roomId === roomId)

  if (isRoomReady) {
    rooms = rooms.filter(room => room.roomId !== roomId)
    return {
      close: true
    }
  } else {
    return {
      close: false
    }
  }
}

export const findRoom = (roomId) => {
  const isRoomReady = rooms.find(room => room.roomId === roomId)

  if (isRoomReady) {
    if (isRoomReady.maxUsers === 5 && isRoomReady.users.length < 5) {
      return {
        find: true,
        isFull: false
      }
    } else {
      return {
        find: true,
        isFull: true
      }
    }
  } else {
    return {
      find: false,
    }
  }
}

export const joinRoom = (userName, userId, roomId, userAvatar) => {
  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      return {
        ...room,
        users: [...room.users, {
          userName,
          userId,
          userAvatar
        }]
      }
    } else {
      return {
        ...room
      }
    }
  })

  return {
    userId,
    userName,
    room: roomId,
    userAvatar
  }
}

export const usersRoom = (roomId) => {
  const room = rooms.find(room => room.roomId === roomId)
  if (room) {
    return room.users
  }
}

export const getVideoState = (roomId) => {
  const room = rooms.find(room => room.roomId === roomId)

  return {
    ...room
  }
}

export const playVideo = (roomId) => {
  const roomFind = rooms.find(room => room.roomId === roomId)

  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      return {
        ...room,
        isPlay: true
      }
    } else {
      return {
        ...room
      }
    }
  })

  return {
    ...roomFind,
    isPlay: true
  }
}

export const stopVideo = (roomId) => {
  const roomFind = rooms.find(room => room.roomId === roomId)

  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      return {
        ...room,
        isPlay: false
      }
    } else {
      return {
        ...room
      }
    }
  })

  return {
    ...roomFind,
    isPlay: false
  }
}

export const seekVideo = (roomId, time) => {
  const roomFind = rooms.find(room => room.roomId === roomId)
  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      return {
        ...room,
        time,
        isPlay: true
      }
    } else {
      return {
        ...room
      }
    }
  })

  return {
    ...roomFind,
    time: time,
    isPlay: true
  }
}

export const setVideoState = (roomId, time) => {
  const roomFind = rooms.find(room => room.roomId === roomId)

  if (roomFind) {
    rooms = rooms.map(room => {
      if (room.roomId === roomId) {
        return {
          ...room,
          time,
        }
      } else {
        return {
          ...room
        }
      }
    })
  }
}

export const changeRoomVideo = (roomId, link) => {
  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      return {
        ...room,
        videoLink: link
      }
    } else {
      return {
        ...room
      }
    }
  })
}

export const userRoomLeave = (roomId, userId) => {
  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      return {
        ...room,
        users: room.users.filter(user => user.userId !== userId)
      }
    } else {
      return {
        ...room
      }
    }
  })
  const roomFind = rooms.find(room => room.roomId === roomId)
  if (roomFind) {
    if (roomFind.users.length === 0) {
      rooms = rooms.filter(room => room.roomId !== roomId)
    }
  }
}

export const testError = () => {
  throw new Error('test error')
}