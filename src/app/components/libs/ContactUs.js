import React, { useState, useEffect } from 'react';
import { ref, get, push } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the path to your firebaseConfig file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState({ email: '', mobile: '' });

  // Fetch email and mobile from the account table
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const snapshot = await get(ref(database, 'account')); // Adjust this path according to your structure
        if (snapshot.exists()) {
          const data = snapshot.val();
          setContactInfo({
            email: data.email || 'Email not found', // Adjust based on your data structure
            address: data.address || 'Mobile not found',
            phone: data.phone || 'Mobile not found',
          });
        } else {
          setContactInfo({ email: 'No email available', mobile: 'No mobile available' });
        }
      } catch (error) {
        console.error('Error fetching contact info: ', error);
        setContactInfo({ email: 'Failed to load email', mobile: 'Failed to load mobile' });
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const contactData = {
      name,
      email,
      mobile,
      message,
      submittedAt: new Date().toISOString(),
    };

    try {
      await push(ref(database, 'contacts'), contactData);
      toast.success('Form submitted successfully!');
      setName('');
      setEmail('');
      setMobile('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting form: ', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className=" p-10">
      <div className="md:container mx-auto flex flex-col md:flex-row text-gray-500 font-thin">
        <div className="flex-1 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="md:p-8  font-thin w-full">
            <div className="mb-4">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder='Full Name'
                className="w-full p-2 border rounded-full"
              />
            </div>

            {/* Flex container for email and mobile */}
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="mb-4 w-full md:w-1/2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='Email'
                  className="w-full p-2 border rounded-full"
                />
              </div>
              <div className="mb-4 w-full md:w-1/2">
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  placeholder="Mobile"
                  className="w-full p-2 border rounded-full"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full p-2 border rounded-full"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
