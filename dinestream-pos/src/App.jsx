import AppRouter from './routes/AppRouter'
import { AuthProvider } from './context/AuthContext'
import { MenuProvider } from './context/MenuContext'
import { OrdersProvider } from './context/orderCOntext'
import { TablesProvider } from './context/TableContext'
import { StaffProvider }  from './context/StaffContext'
import { ToastProvider }  from './context/ToastContext'
import ToastContainer     from './components/ui/Toast'


// AuthProvider → poori app wrap — har jagah useAuth() available
const App = () => (
    <ToastProvider>
    <AuthProvider>
      <MenuProvider>
        <OrdersProvider>
          <TablesProvider>
            <StaffProvider>
              <AppRouter />
              <ToastContainer />   {/* ← yahan render hoga, hamesha visible */}
            </StaffProvider>
          </TablesProvider>
        </OrdersProvider>
      </MenuProvider>
    </AuthProvider>
  </ToastProvider>
)

export default App