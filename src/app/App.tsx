import AppRoutes from '../routes/AppRoutes';
import Navbar from '../ui/components/Navbar';

/**
 * Root application shell with persistent navigation.
 *
 * @returns App shell with navbar and routed content.
 */
const App = () => (
  <div className="app-shell">
    <Navbar />
    <main className="app-main">
      <AppRoutes />
    </main>
  </div>
);

export default App;
