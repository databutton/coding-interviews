import Excalidraw, { getSceneVersion } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

function App() {
  const yDocRef = useRef(new Y.Doc());
  const yElementsRef = useRef<Y.Array<ExcalidrawElement>>(
    yDocRef.current.getArray('elements')
  );
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  useEffect(() => {
    if (!yElementsRef.current || !yDocRef.current) return;
    const provider = new WebrtcProvider('crunchy-time', yDocRef.current);
    const onChange = () => {
      const newElements = yElementsRef.current.toArray();
      const currentElements =
        excalidrawAPIRef.current!.getSceneElementsIncludingDeleted();
      const newVersion = getSceneVersion(newElements);
      const currentVersion = getSceneVersion(currentElements);
      if (newVersion > currentVersion) {
        excalidrawAPIRef.current?.updateScene({
          elements: yElementsRef.current.toArray().map((elem) => ({ ...elem })),
        });
      }
    };
    yElementsRef.current.observe(onChange);
    return () => {
      provider.destroy();
      yElementsRef.current.unobserve(onChange);
    };
  }, [yDocRef, yElementsRef, excalidrawAPIRef]);
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
        ref={excalidrawAPIRef as any}
        onChange={(elements) => {
          if (yElementsRef.current) {
            const newVersion = getSceneVersion(elements);
            const oldVersion = getSceneVersion(yElementsRef.current.toArray());
            if (newVersion > oldVersion) {
              yElementsRef.current.delete(0, yElementsRef.current.length);
              // Deep cloning because excalidraw is mutating elements...
              yElementsRef.current.insert(
                0,
                elements.map((elem) => ({ ...elem })) as ExcalidrawElement[]
              );
            }
          }
        }}
      />
    </div>
  );
}

export default App;
