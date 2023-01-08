import { Navigate, Route, Routes } from 'react-router-dom';
import ParserDemo from './pages/parser';
import FormDemo from './pages/form';
import Header from './components/header';
import Container from '@mui/material/Container';
import { Helmet } from 'react-helmet';
import ErrorBoundary from './components/error';

const AppDemo = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>React Form Configurable</title>
        <link rel="canonical" href="https://form-configurable.netlify.app" />
        <meta
          name="description"
          content="making applications the laziest is to create a form where we need to make validation on the frontend and backend, not to mention match the conditions between the two. form-configurable helps standardize the schema-based generator that can be configured from the backendt"
        />
        <meta
          name="google-site-verification"
          content="hXp92XVlVjRxbYkG-7_pZ19XwQ1RoilSlLPFVk76Pco"
        />
      </Helmet>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/parser" element={<ParserDemo />}></Route>
            <Route path="/" element={<FormDemo />}></Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Container>
    </>
  );
};

export default AppDemo;
