import React from 'react';
import SidebarNavbar from './Sidebarnavbar';
import { useNavigate } from 'react-router-dom';
import lilyapperimg from '../images/lilyapper.png'; // Update path if needed

const Help = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const faqs = [
        {
            question: 'How do I reset my password?',
            answer: 'Go to settings > Account and click on "Reset Password".',
        },
        {
            question: 'How do I delete my account?',
            answer: 'Go to Settings > Account and click on "Delete Account".',
        },
        {
            question: 'How do I report a bug?',
            answer: 'Send us a screenshot and steps to reproduce at support@lilyapper.com.',
        },
        {
            question: 'How to change my username?',
            answer: 'Visit your profile and click "Edit Username".',
        },
    ];

    return (
        <div className="d-flex">
            {/* Sidebar only on medium+ screens */}
            <div className="d-none d-md-block">
                <SidebarNavbar handleLogout={handleLogout} />
            </div>

            {/* Help Content */}
            <div className="flex-grow-1 p-3 body" style={{ marginTop: '20px' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    {/* Mobile Header */}
                    <div className=" mb-4" style={{ postion: 'absolute', left: '0' }}>
                        <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>
                    </div>
                    <div className="d-block d-md-none mb-4" style={{ postion: 'absolute', left: '0' }}>
                        <img
                            src={lilyapperimg}
                            alt="Lilyapper"
                            style={{ width: '6rem', height: 'auto' }}
                            className="mb-2 my-3"
                        />
                    </div>

                    <h2 className="mb-4 mx-2">Help & Support</h2>

                    <div className="accordion mx-2" id="faqAccordion">
                        {faqs.map((faq, index) => (
                            <div className="accordion-item" key={index}>
                                <h2 className="accordion-header" id={`heading-${index}`}>
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${index}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse-${index}`}
                                    >
                                        {faq.question}
                                    </button>
                                </h2>
                                <div
                                    id={`collapse-${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading-${index}`}
                                    data-bs-parent="#faqAccordion"
                                >
                                    <div className="accordion-body">{faq.answer}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4" />

                    <div className="text-center">
                        <h5>Still need help?</h5>
                        <p className="text-muted" >
                            Contact us via email at <a style={{ color: '#090040' }} href="mailto:msubhasmita29@gmail.com">support@lilyapper.com</a>
                        </p>
                        <button className="btn btn-primary">Contact Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
