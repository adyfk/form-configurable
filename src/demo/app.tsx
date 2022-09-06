import { Navigate, Route, Routes } from 'react-router-dom';
import ParserDemo from './pages/parser';
import FormDemo from './pages/form';
import Header from './components/header';
import Container from '@mui/material/Container';
import { useTitle } from 'react-use';

const AppDemo = () => {
  useTitle('React Form Configurable');
  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/parser" element={<ParserDemo />}></Route>
          <Route path="/demo" element={<FormDemo />}></Route>
          <Route path="*" element={<Navigate to="/demo" replace />} />
        </Routes>
      </Container>
    </>
  );
};

export default AppDemo;
