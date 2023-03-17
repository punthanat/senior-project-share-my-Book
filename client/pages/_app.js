import {getGlobalStyle} from '../styles/globalStyles'
import {config as fontAwesomeConfig} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {QueryClient, QueryClientProvider} from 'react-query'
import {queryClientConfig} from '../config/query-client'
import UserLayout from '../components/layouts/UserLayout'
import {Provider} from 'react-redux'
import {store} from '../redux/store'
import {Toaster} from 'react-hot-toast'
import {SocketProvider} from '../contexts/Socket'

fontAwesomeConfig.autoAddCss = false
const GlobalStyle = getGlobalStyle()
const queryClient = new QueryClient(queryClientConfig)

function MyApp({Component, pageProps}) {
  const Layout = Component.Layout || UserLayout

  return (
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <GlobalStyle />
          <Toaster />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </QueryClientProvider>
    </SocketProvider>
  )
}

export default MyApp
