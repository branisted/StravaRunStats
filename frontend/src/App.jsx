import {BrowserRouter, Routes, Route, HashRouter} from 'react-router-dom';
import Home from './screens/Home.jsx';
import './App.css';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
};

export default App;