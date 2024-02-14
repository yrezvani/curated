import React from 'react';
import "./Contact.css";
import ContactForm from '../components/ContactForm';



{/*component to display contact information, links and read PDFViewer and ContactForm components */}  
function Contact() {
  return (
    <div className='contact-container pb-20'>
      <h1 className='contact-heading py-10 mx-8'>CONTACT</h1>
      <ContactForm />
    </div>
  );

}

export default Contact;