// components/Layout.js

import Header from '../components/Header';
import Footer from '../components/Footer';
import AIAssistantForm from '../components/ai/AIAssistantForm';

const Layout = ({ children, session }) => {
  return (
    <>
      <main>
        {children}
      </main>
      <AIAssistantForm />
    </>
  );
};

export default Layout;
