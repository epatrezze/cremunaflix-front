import AppRoutes from '../routes/AppRoutes';
import Navbar from '../ui/components/Navbar';

const App = () => (
  <div className="app-shell">
    <Navbar />
    <main className="app-main">
      <AppRoutes />
    </main>
  </div>
);

export default App;
