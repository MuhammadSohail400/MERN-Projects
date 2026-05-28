import {Routes,Route,Navigate} from 'react-router-dom'
import Layout from "./components/layout/Layout";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Dashboard from "./pages/Dashboard";
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import Analytics from './pages/Analytics';

function App(){
  return(
    <>
      <Layout sidebar={<Sidebar />} topbar={<TopBar userName="Alex Rivera" userRole="HR ADMINISTRATOR" />}>
          <Routes>
               <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/employees/add" element={<AddEmployee />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Layout>
    </>
  );
}
export default App;