// components/Layout.js

import AIAssistantForm from '../components/ai/AIAssistantForm';

const Layout = ({ children }) => {
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
