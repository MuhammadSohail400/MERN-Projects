import AppRouter from './routes/AppRouter'
import { AuthProvider } from './context/AuthContext'
import { MenuProvider } from './context/MenuContext'
import { OrdersProvider } from './context/orderCOntext'
import { TablesProvider } from './context/TableContext'
import { StaffProvider }  from './context/StaffContext'
import { ToastProvider }  from './context/ToastContext'
import ToastContainer     from './components/ui/Toast'
import { RestaurantProvider } from './context/RestaurantContext'




const App = () => (
    <ToastProvider>
    <AuthProvider>
       <RestaurantProvider>
      <MenuProvider>
        <OrdersProvider>
          <TablesProvider>
            <StaffProvider>
              <AppRouter />
              <ToastContainer />
            </StaffProvider>
          </TablesProvider>
        </OrdersProvider>
      </MenuProvider>
       </RestaurantProvider>
    </AuthProvider>
  </ToastProvider>
)

export default App