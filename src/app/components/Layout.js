// components/Layout.js

import AIAssistantForm from '../components/ai/AIAssistantForm';

const Layout = ({ children }) => {
  return (
    <div>
      <main>
        {children}
      </main>
      <AIAssistantForm />
    </div>
  );
};

export default Layout;
