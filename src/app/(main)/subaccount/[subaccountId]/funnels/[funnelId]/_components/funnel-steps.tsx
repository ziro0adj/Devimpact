'use client'

import React, { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface StudyGroupChatProps {
  groupId: string // Identifiant du groupe d'étude
}

interface Message {
  message: string
  timestamp: string
}

const StudyGroupChat: React.FC<StudyGroupChatProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<Message[]>([]) // Liste des messages
  const [message, setMessage] = useState<string>('') // Message à envoyer
  const [socket, setSocket] = useState<Socket | null>(null) // Instance Socket.IO

  // Initialisation de la connexion Socket.IO
  useEffect(() => {
    const newSocket = io('http://localhost:3000') // Connecte au serveur
    setSocket(newSocket)

    // Rejoindre un groupe d'étude
    newSocket.emit('joinGroup', groupId)

    // Recevoir les messages existants
    newSocket.on('messageHistory', (history: Message[]) => {
      setMessages(history)
    })

    // Écouter les nouveaux messages
    newSocket.on('message', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage])
    })

    // Nettoyer la connexion à la déconnexion
    return () => {
      newSocket.disconnect()
    }
  }, [groupId])

  // Envoi d'un message
  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      socket.emit('message', { groupId, message })
      setMessage('') // Efface le champ de saisie après envoi
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">study group chat</h2>

      {/* Liste des messages */}
      <div className="h-64 overflow-auto bg-white p-4 rounded-md shadow-sm mb-4">
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className="mb-2">
              <span className="block text-sm text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              <span className="block text-md">{msg.message}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Saisie et envoi de message */}
      <div className="flex items-center">
        <Input
          placeholder="Tapez votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow mr-2"
        />
        <Button onClick={sendMessage}>send</Button>
      </div>
    </div>
  )
}

export default StudyGroupChat
