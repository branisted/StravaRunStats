// ./App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './screens/Auth/Login';
// import Callback from './screens/Auth/Callback';
import Home from './screens/Home.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*<Route path="/login" element={<Login />} />*/}
                {/*<Route path="/callback" element={<Callback />} />*/}
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;