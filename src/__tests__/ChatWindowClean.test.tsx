import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatWindowClean from '@/components/ChatWindowClean'
import { Message } from '@/types'

describe('ChatWindowClean', () => {
  it('renders messages', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Hola', timestamp: new Date() },
    ]
    render(<ChatWindowClean messages={messages} />)
    expect(screen.getByText('Hola')).toBeInTheDocument()
  })

  it('calls onSendMessage when submitting', async () => {
    const user = userEvent.setup()
    const handleSend = jest.fn()
    render(<ChatWindowClean messages={[]} onSendMessage={handleSend} />)
    const input = screen.getByPlaceholderText(/escribe un mensaje/i)
    await user.type(input, 'mensaje')
    await user.keyboard('{Enter}')
    expect(handleSend).toHaveBeenCalledWith('mensaje')
  })
})
