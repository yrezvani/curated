import React from 'react';
import ContactForm from '../components/ContactForm';



{/*component to display contact information, links and read PDFViewer and ContactForm components */}  
function Contact() {
  return (
    <div className='font-sans font-thin contact-container pb-20 flex justify-center items-center h-screen'>
      <div className="w-full max-w-5xl">
        <h1 className='font-sans font-thin contact-heading text-3xl text-center py-10 mx-8'>Contact us</h1>
        <ContactForm />
      </div>
    </div>
  );
}

export default Contact;