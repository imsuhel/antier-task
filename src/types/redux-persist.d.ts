declare module 'redux-persist/integration/react' {
  import { ReactNode } from 'react';
  import { Persistor } from 'redux-persist';

  interface PersistGateProps {
    loading?: ReactNode;
    persistor: Persistor;
    children?: ReactNode | ((bootstrapped: boolean) => ReactNode);
    onBeforeLift?(): void | Promise<void>;
  }

  const PersistGate: React.FC<PersistGateProps>;
  export { PersistGate };
}
