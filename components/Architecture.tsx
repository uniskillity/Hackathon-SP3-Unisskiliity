
import React from 'react';
import Card from './ui/Card';

const Architecture: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="page-title">System Architecture & Design</h2>
      
      <Card>
        <div className="card-body">
            <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-gray-800)'}}>System Overview Diagram</h3>
            
            {/* High-Level Diagram */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', padding: '1rem 0' }}>
                
                {/* Layer 1: User */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                     <div style={{ padding: '1rem 2rem', backgroundColor: 'var(--color-gray-800)', color: 'white', borderRadius: '0.5rem', fontWeight: 600 }}>
                         Loan Officer (User)
                     </div>
                     <div style={{ height: '2rem', borderLeft: '2px dashed var(--color-gray-300)' }}></div>
                </div>

                {/* Layer 2: Frontend App */}
                <div style={{ padding: '1.5rem', border: '2px solid var(--color-teal-500)', borderRadius: '1rem', backgroundColor: 'var(--color-teal-50)', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--color-teal-800)', fontWeight: 700, marginBottom: '1rem' }}>Frontend Application (React 19)</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <strong style={{color: 'var(--color-teal-700)'}}>UI Components</strong>
                            <p style={{fontSize: '0.875rem', color: 'var(--color-gray-600)'}}>Dashboard, Forms, Modals, Chat Widget</p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <strong style={{color: 'var(--color-teal-700)'}}>State Management</strong>
                            <p style={{fontSize: '0.875rem', color: 'var(--color-gray-600)'}}>React Hooks, Local Persistence</p>
                        </div>
                    </div>
                </div>

                {/* Connections */}
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '600px' }}>
                    <div style={{ height: '2rem', borderLeft: '2px dashed var(--color-gray-300)' }}></div>
                    <div style={{ height: '2rem', borderLeft: '2px dashed var(--color-gray-300)' }}></div>
                </div>

                {/* Layer 3: Services */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '800px', justifyContent: 'center', flexWrap: 'wrap' }}>
                     {/* AI Service */}
                     <div style={{ flex: '1', minWidth: '250px', padding: '1.5rem', border: '1px solid var(--color-indigo-200)', borderRadius: '0.75rem', backgroundColor: 'var(--color-indigo-50)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.5rem', height: '1.5rem', color: 'var(--color-indigo-600)'}}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                             <h4 style={{ fontWeight: 700, color: 'var(--color-indigo-800)' }}>AI Service Layer</h4>
                         </div>
                         <p style={{fontSize: '0.875rem', color: 'var(--color-indigo-900)', marginBottom: '0.5rem'}}>Powered by Google Gemini 2.5 Flash</p>
                         <ul style={{listStyle: 'disc', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-gray-700)'}}>
                             <li>Client Risk Scoring (JSON Mode)</li>
                             <li>Loan Term Recommendations</li>
                             <li>Default Probability Prediction</li>
                             <li>Chat Assistant (Context Aware)</li>
                         </ul>
                     </div>

                     {/* Data Service */}
                     <div style={{ flex: '1', minWidth: '250px', padding: '1.5rem', border: '1px solid var(--color-gray-300)', borderRadius: '0.75rem', backgroundColor: 'var(--color-gray-100)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.5rem', height: '1.5rem', color: 'var(--color-gray-700)'}}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                            </svg>
                             <h4 style={{ fontWeight: 700, color: 'var(--color-gray-800)' }}>Data & Backend</h4>
                         </div>
                         <p style={{fontSize: '0.875rem', color: 'var(--color-gray-700)', marginBottom: '0.5rem'}}>Encrypted Local Storage & APIs</p>
                         <ul style={{listStyle: 'disc', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-gray-600)'}}>
                             <li>JSON-based Object Storage</li>
                             <li>Session Management</li>
                             <li>Secure Data Masking</li>
                             <li>CRUD Operations for Loans/Clients</li>
                         </ul>
                     </div>
                </div>
            </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="Core Modules">
            <div className="space-y-4">
                <div>
                    <h5 style={{fontWeight: 600, color: 'var(--color-teal-700)'}}>1. Client Onboarding</h5>
                    <p style={{fontSize: '0.9rem', color: 'var(--color-gray-600)'}}>Captures KYC data (CNIC, Address, Income). Uses AI to verify consistency and assign an initial Risk Score.</p>
                </div>
                <div>
                    <h5 style={{fontWeight: 600, color: 'var(--color-teal-700)'}}>2. Loan Origination</h5>
                    <p style={{fontSize: '0.9rem', color: 'var(--color-gray-600)'}}>Configurable loan products. AI analyzes risk to recommend interest rates and tenure. Auto-generates repayment schedules.</p>
                </div>
                <div>
                    <h5 style={{fontWeight: 600, color: 'var(--color-teal-700)'}}>3. Repayment Tracking</h5>
                    <p style={{fontSize: '0.9rem', color: 'var(--color-gray-600)'}}>Tracks status of every installment. Visual alerts for overdue payments. AI predicts likelihood of default based on payment history.</p>
                </div>
            </div>
        </Card>

        <Card title="Technical Stack">
             <table className="table" style={{border: 'none'}}>
                 <tbody>
                     <tr>
                         <td style={{fontWeight: 600}}>Frontend Framework</td>
                         <td>React 19 (Vite)</td>
                     </tr>
                     <tr>
                         <td style={{fontWeight: 600}}>Language</td>
                         <td>TypeScript</td>
                     </tr>
                     <tr>
                         <td style={{fontWeight: 600}}>Styling</td>
                         <td>Custom CSS (Variable-based)</td>
                     </tr>
                     <tr>
                         <td style={{fontWeight: 600}}>AI Integration</td>
                         <td>Google GenAI SDK</td>
                     </tr>
                     <tr>
                         <td style={{fontWeight: 600}}>Charts</td>
                         <td>Recharts</td>
                     </tr>
                     <tr>
                         <td style={{fontWeight: 600}}>Deployment</td>
                         <td>Vercel / Netlify Compatible</td>
                     </tr>
                 </tbody>
             </table>
        </Card>
      </div>
    </div>
  );
};

export default Architecture;
