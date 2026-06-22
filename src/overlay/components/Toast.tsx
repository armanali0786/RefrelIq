interface Props { message: string }

export function Toast({ message }: Props) {
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      background: '#141413', color: '#F3F0EE', borderRadius: 999,
      padding: '10px 20px', fontSize: 13, fontWeight: 450,
      boxShadow: '0 8px 32px rgba(20,20,19,0.16)', whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  )
}
