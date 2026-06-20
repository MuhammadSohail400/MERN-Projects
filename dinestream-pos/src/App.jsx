import AppRouter from './routes/AppRouter'
import { AuthProvider } from './context/AuthContext'
import { MenuProvider } from './context/MenuContext'
import { OrdersProvider } from './context/orderCOntext'
import { TablesProvider } from './context/TableContext'
import { StaffProvider }  from './context/StaffContext'


// AuthProvider → poori app wrap — har jagah useAuth() available
const App = () => (
   <AuthProvider>
     <MenuProvider>
      <OrdersProvider>
        <TablesProvider>
           <StaffProvider>
            <AppRouter />
          </StaffProvider>
        </TablesProvider>
      </OrdersProvider>
    </MenuProvider>
  </AuthProvider>
)

export default App