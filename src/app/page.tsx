export default function Home() {
  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#8B4513',
        marginBottom: '1rem'
      }}>
        Welcome to ChickCheck
      </h1>
      <p style={{
        fontSize: '1.125rem',
        color: '#5C4A3A',
        textAlign: 'center',
        maxWidth: '28rem'
      }}>
        Your 8-week guide to raising healthy, happy chicks.
      </p>
    </main>
  );
}
