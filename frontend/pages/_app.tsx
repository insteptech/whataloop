import ProtectedRoute from "@/components/protectedRoute";
import { Provider } from 'react-redux';
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import createStore from '../store/createStore';
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {

  const [store, setStore] = useState(null);

  useEffect(() => {
    (async () => {
      const dynamicStore = await createStore();
      setStore(dynamicStore);
    })();
  }, []);
  if (!store) {
    return <div>Loading...</div>;
  }
  return (
    <Provider store={store}>
      <ProtectedRoute>
        <Component {...pageProps} />
      </ProtectedRoute>
    </Provider>
 )
}
