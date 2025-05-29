import ProtectedRoute from "@/components/protectedRoute";
import { Provider } from "react-redux";
import "@/styles/imports.scss";
import type { AppProps } from "next/app";
import createStore from "../store/createStore";
import { useEffect, useState } from "react";
import { ToastContainer} from 'react-toastify';

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
      <ToastContainer
        position="top-right"  // Toast position
        autoClose={3000}      // Auto close duration (in ms)
        hideProgressBar={false} // Show/hide progress bar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"         // Theme (light/dark/colored)
      />
        <Component {...pageProps} />
      </ProtectedRoute>
    </Provider>
  );
}
