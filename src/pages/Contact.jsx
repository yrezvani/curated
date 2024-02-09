import React from 'react';
import "./Contact.css";
// import { Link } from 'react-router-dom'
import ContactForm from '../components/ContactForm';

{/* Define Mailto function to call with ContactForm component*/} 
const Mailto = ({ email, subject = '', body = '', children }) => {
  let params = subject || body ? '?' : '';
  if (subject) params += `subject=${encodeURIComponent(subject)}`;
  if (body) params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`;

  return <a className='mail-link' href={`mailto:${email}${params}`}>{children}</a>;
};

{/*component to display contact information, links and read PDFViewer and ContactForm components */}  
function Contact() {
  return (
    <div className='contact-container'>
      <h1>Contact Me</h1>
      <p>
        Send me an email using the form below:
      </p>
      <ContactForm />

      <Mailto className="mail-link" email="lcbarham9@gmail.com" subject="Hello" body="">
        email us
      </Mailto>

    </div>
  );

}

export default Contact;