'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import {
  MessageCircle, Send, ArrowLeft, Phone, Clock, Check, CheckCheck,
  Search, RefreshCw, Circle
} from 'lucide-react'

type Conversation = {
  phone: string
  phone_name: string | null
  last_message_at: string
  unread_count: number
  last_message: string | null
}

type Message = {
  id: string
  wa_message_id: string | null
  phone: string
  phone_name: string | null
  direction: 'inbound' | 'outbound'
  message_type: string
  body: string | null
  media_url: string | null
  status: string
  read: boolean
  created_at: string
}

function formatPhone(phone: string) {
  if (!phone) return ''
  const d = phone.replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('1')) {
    return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
  }
  return phone
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'read') return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
  if (status === 'delivered') return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
  if (status === 'sent') return <Check className="w-3.5 h-3.5 text-gray-400" />
  return null
}

export default function WhatsAppInbox() {
  const sb = createClient()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalUnread, setTotalUnread] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load conversations
  const loadConversations = useCallback(async () => {
    const { data, error } = await sb
      .from('whatsapp_conversations')
      .select('*')
    if (!error && data) {
      setConversations(data)
      setTotalUnread(data.reduce((sum: number, c: Conversation) => sum + (c.unread_count ?? 0), 0))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadConversations()
    // Poll every 10 seconds for new messages
    const interval = setInterval(loadConversations, 10000)
    return () => clearInterval(interval)
  }, [loadConversations])

  // Load messages for selected conversation
  const loadMessages = useCallback(async (phone: string) => {
    const { data } = await sb
      .from('whatsapp_messages')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)

    // Mark as read
    await sb
      .from('whatsapp_messages')
      .update({ read: true })
      .eq('phone', phone)
      .eq('direction', 'inbound')
      .eq('read', false)

    // Refresh conversation list to update unread counts
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    if (selectedPhone) {
      loadMessages(selectedPhone)
      const interval = setInterval(() => loadMessages(selectedPhone), 5000)
      return () => clearInterval(interval)
    }
  }, [selectedPhone, loadMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedPhone || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/whatsapp/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: selectedPhone, mensaje: newMessage.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setNewMessage('')
        setTimeout(() => loadMessages(selectedPhone), 800)
      } else {
        alert(`Error al enviar: ${data.error || 'Intenta de nuevo'}`)
      }
    } catch (err: any) {
      alert(`Error de conexión: ${err.message}`)
    }
    setSending(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectConversation = (phone: string) => {
    setSelectedPhone(phone)
    setMessages([])
  }

  const filteredConversations = conversations.filter(c => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      c.phone.includes(term) ||
      (c.phone_name?.toLowerCase().includes(term)) ||
      (c.last_message?.toLowerCase().includes(term))
    )
  })

  // ─── Empty state ───
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {selectedPhone && (
            <button onClick={() => setSelectedPhone(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">WhatsApp</h1>
              <p className="text-xs text-gray-500">
                {totalUnread > 0 ? `${totalUnread} sin leer` : 'Bandeja de entrada'}
              </p>
            </div>
          </div>
        </div>
        <button onClick={loadConversations} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex border rounded-2xl overflow-hidden bg-white shadow-sm min-h-0">
        {/* Conversation list */}
        <div className={`${selectedPhone ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r`}>
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversación..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <MessageCircle className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-sm text-gray-500 font-medium">Sin conversaciones</p>
                <p className="text-xs text-gray-400 mt-1">Los mensajes entrantes aparecerán aquí</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.phone}
                  onClick={() => selectConversation(conv.phone)}
                  className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                    selectedPhone === conv.phone ? 'bg-green-50 hover:bg-green-50' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">
                        {(conv.phone_name?.[0] ?? conv.phone.slice(-2)).toUpperCase()}
                      </span>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conv.unread_count > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {conv.phone_name || formatPhone(conv.phone)}
                      </p>
                      <span className={`text-[10px] shrink-0 ml-2 ${conv.unread_count > 0 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                        {timeAgo(conv.last_message_at)}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${conv.unread_count > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                      {conv.last_message ?? ''}
                    </p>
                    {!conv.phone_name && (
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {formatPhone(conv.phone)}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`${selectedPhone ? 'flex' : 'hidden md:flex'} flex-col flex-1 min-w-0`}>
          {!selectedPhone ? (
            // Empty chat state
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-green-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">ContactGo WhatsApp</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                Selecciona una conversación para ver los mensajes y responder.
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 p-3 border-b bg-white">
                <button onClick={() => setSelectedPhone(null)} className="md:hidden p-1 hover:bg-gray-100 rounded">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">
                    {(conversations.find(c => c.phone === selectedPhone)?.phone_name?.[0] ?? selectedPhone.slice(-2)).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {conversations.find(c => c.phone === selectedPhone)?.phone_name || formatPhone(selectedPhone)}
                  </p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {formatPhone(selectedPhone)}
                  </p>
                </div>
                <a
                  href={`https://wa.me/${selectedPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50"
                >
                  Abrir en WA
                </a>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#f0f2f5]">
                {messages.map((msg, i) => {
                  const isOut = msg.direction === 'outbound'
                  const showDate = i === 0 || new Date(msg.created_at).toDateString() !== new Date(messages[i - 1].created_at).toDateString()
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-3">
                          <span className="bg-white text-[10px] text-gray-500 font-medium px-3 py-1 rounded-full shadow-sm">
                            {new Date(msg.created_at).toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl overflow-hidden shadow-sm ${
                          isOut
                            ? 'bg-[#d9fdd3] rounded-tr-md'
                            : 'bg-white rounded-tl-md'
                        }`}>
                          {/* Media */}
                          {msg.media_url && ['image'].includes(msg.message_type) && (
                            <a href={`/api/whatsapp/media?id=${msg.media_url}`} target="_blank" rel="noopener noreferrer">
                              <img src={`/api/whatsapp/media?id=${msg.media_url}`} alt="" className="w-full max-w-[280px] object-cover" loading="lazy" />
                            </a>
                          )}
                          {msg.media_url && msg.message_type === 'video' && (
                            <video src={`/api/whatsapp/media?id=${msg.media_url}`} controls className="w-full max-w-[280px]" preload="metadata" />
                          )}
                          {msg.media_url && msg.message_type === 'audio' && (
                            <div className="px-3 py-2">
                              <audio src={`/api/whatsapp/media?id=${msg.media_url}`} controls className="w-full" preload="metadata" />
                            </div>
                          )}
                          {msg.media_url && msg.message_type === 'document' && (
                            <a href={`/api/whatsapp/media?id=${msg.media_url}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3.5 py-2 text-blue-600 hover:underline">
                              📄 <span className="text-sm">{msg.body || 'Documento'}</span>
                            </a>
                          )}
                          {/* Text body */}
                          {msg.body && msg.message_type !== 'document' && (
                            <p className="text-sm text-gray-800 whitespace-pre-wrap break-words px-3.5 py-2">
                              {msg.body}
                            </p>
                          )}
                          {/* No body, no media — show type label */}
                          {!msg.body && !msg.media_url && (
                            <p className="text-sm text-gray-400 italic px-3.5 py-2">[{msg.message_type}]</p>
                          )}
                          <div className={`flex items-center gap-1 px-3.5 pb-1.5 ${isOut ? 'justify-end' : ''}`}>
                            <span className="text-[10px] text-gray-400">
                              {new Date(msg.created_at).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isOut && <StatusIcon status={msg.status} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe un mensaje..."
                    rows={1}
                    className="flex-1 resize-none border rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 max-h-32"
                    style={{ minHeight: '42px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    className="shrink-0 w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 text-white flex items-center justify-center transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
