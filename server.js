const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

let messages = {} // Stocker les messages par groupe

// Écoute les connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté')

  // Rejoindre un groupe
  socket.on('joinGroup', (groupId) => {
    socket.join(groupId)
    console.log(`Utilisateur rejoint le groupe: ${groupId}`)

    // Envoyer les messages existants au nouvel utilisateur
    if (messages[groupId]) {
      socket.emit('messageHistory', messages[groupId])
    } else {
      messages[groupId] = []
    }
  })

  // Réception d'un message et diffusion à tous les membres du groupe
  socket.on('message', ({ groupId, message }) => {
    const newMessage = { message, timestamp: new Date().toISOString() }
    messages[groupId].push(newMessage)

    // Diffuser le message à tout le groupe
    io.to(groupId).emit('message', newMessage)
  })

  // Déconnexion de l'utilisateur
  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté')
  })
})

// Démarrer le serveur
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})
