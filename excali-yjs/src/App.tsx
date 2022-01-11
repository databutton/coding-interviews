import Excalidraw from '@excalidraw/excalidraw';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Excalidraw + yjs == true</h1>
      <Excalidraw
        onChange={(elements) => {
          console.log(elements);
        }}
      />
    </div>
  );
}

export default App;
