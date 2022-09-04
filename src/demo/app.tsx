import { Navigate, Route, Routes } from 'react-router-dom';
import ParserDemo from './pages/parser';
import FormDemo from './pages/form';
import Header from './components/header';
import Container from '@mui/material/Container';

const AppDemo = () => {
  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/parser" element={<ParserDemo />}></Route>
          <Route path="/form" element={<FormDemo />}></Route>
          <Route path="*" element={<Navigate to="/parser" replace />} />
        </Routes>
      </Container>
    </>
  );
};

export default AppDemo;
