import React, { useRef } from 'react';

interface CertificateData {
  title: string;
  issuer: string;
  issueDate: string | Date;
  credentialId: string;
  userName: string;
}

interface CertificateViewerModalProps {
  show: boolean;
  onClose: () => void;
  certData: CertificateData | null;
}

const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({ show, onClose, certData }) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!show || !certData) return null;

  const formattedDate = new Date(certData.issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    const printContent = certRef.current?.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ShikshaSetu Certificate - ${certData.title}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Great+Vibes&family=Montserrat:wght@400;500;700&display=swap');
              
              body {
                background: #fff;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .cert-print-container {
                width: 100%;
                max-width: 900px;
                padding: 20px;
              }
              
              .certificate-card {
                border: 12px double #c5a059;
                padding: 50px 40px;
                background-color: #fbf9f4;
                text-align: center;
                position: relative;
                font-family: 'Montserrat', sans-serif;
                box-sizing: border-box;
                border-radius: 4px;
                box-shadow: 0 0 20px rgba(0,0,0,0.05);
              }
              
              .certificate-card::after {
                content: '';
                position: absolute;
                top: 5px; left: 5px; right: 5px; bottom: 5px;
                border: 1px solid #c5a059;
                pointer-events: none;
              }
              
              .certificate-header {
                font-family: 'Cinzel', serif;
                color: #9c7b39;
                letter-spacing: 4px;
                font-weight: 700;
                font-size: 1.4rem;
                margin-bottom: 2px;
              }
              
              .certificate-subheader {
                font-family: 'Cinzel', serif;
                font-size: 0.8rem;
                letter-spacing: 2px;
                color: #666;
                margin-bottom: 30px;
              }
              
              .certificate-title {
                font-family: 'Cinzel', serif;
                font-size: 2.2rem;
                color: #1a1a1a;
                font-weight: 800;
                margin-bottom: 15px;
                letter-spacing: 1px;
              }
              
              .certificate-presentation {
                font-style: italic;
                color: #777;
                font-size: 1rem;
                margin-bottom: 10px;
              }
              
              .recipient-name {
                font-family: 'Great Vibes', cursive;
                font-size: 3.8rem;
                color: #9c7b39;
                margin: 15px 0;
                display: inline-block;
                padding-bottom: 5px;
                min-width: 400px;
              }
              
              .completion-text {
                font-size: 1rem;
                color: #444;
                line-height: 1.7;
                max-width: 650px;
                margin: 15px auto 30px auto;
              }
              
              .course-title {
                font-weight: 700;
                color: #111;
                font-size: 1.3rem;
                display: block;
                margin-top: 8px;
                text-decoration: underline;
                text-underline-offset: 4px;
                text-decoration-color: #c5a059;
              }
              
              .certificate-footer {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding: 0 40px;
              }
              
              .footer-item {
                text-align: center;
                width: 180px;
              }
              
              .signature-line {
                border-bottom: 1.5px solid #c5a059;
                font-family: 'Great Vibes', cursive;
                font-size: 2.2rem;
                color: #222;
                padding-bottom: 2px;
                margin-bottom: 8px;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              
              .footer-label {
                font-size: 0.7rem;
                text-transform: uppercase;
                color: #666;
                letter-spacing: 1.5px;
                font-weight: 500;
              }
              
              .gold-seal {
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, #f3e5ab, #d4af37, #aa7c11);
                border-radius: 50%;
                border: 4px dotted #fff;
                box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: 0.65rem;
                letter-spacing: 1px;
                text-align: center;
                text-transform: uppercase;
                margin: 0 auto;
              }
              
              .cert-id {
                font-family: monospace;
                font-size: 0.7rem;
                color: #999;
                position: absolute;
                bottom: 15px;
                left: 20px;
              }
            </style>
          </head>
          <body>
            <div class="cert-print-container">
              <div class="certificate-card">
                ${printContent}
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="modal fade show d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: '850px', width: '90%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white">
          <div className="modal-header bg-light border-bottom-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-award-fill text-warning"></i> Certificate Viewer
            </h5>
            <div className="d-flex gap-2">
              <button onClick={handlePrint} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 px-3 rounded-pill">
                <i className="bi bi-printer"></i> Print / Save PDF
              </button>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
          </div>
          <div className="modal-body p-4 bg-white overflow-auto" style={{ maxHeight: '80vh' }}>
            
            {/* Real Screen Rendered Certificate */}
            <div 
              className="border double-gold p-4 p-md-5 bg-cream text-center position-relative rounded-3 mx-auto"
              style={{
                border: '10px double #c5a059',
                backgroundColor: '#fbf9f4',
                fontFamily: "'Montserrat', sans-serif",
                maxWidth: '760px',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
              }}
            >
              {/* Inner thin frame */}
              <div style={{
                position: 'absolute',
                top: '4px', left: '4px', right: '4px', bottom: '4px',
                border: '1px solid #c5a059',
                pointerEvents: 'none'
              }}></div>

              <div ref={certRef}>
                <div style={{ fontFamily: "'Cinzel', serif", color: '#9c7b39', letterSpacing: '4px', fontWeight: 700, fontSize: '1.25rem', marginBottom: '2px' }}>
                  SHIKSHASETU
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '2px', color: '#666', marginBottom: '25px' }}>
                  LEARNING ACADEMY
                </div>
                
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: '#1a1a1a', fontWeight: 800, marginBottom: '15px', letterSpacing: '1px' }}>
                  CERTIFICATE OF COMPLETION
                </div>
                
                <div style={{ fontStyle: 'italic', color: '#777', fontSize: '0.95rem', marginBottom: '10px' }}>
                  This is proudly presented to
                </div>
                
                <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '3.5rem', color: '#9c7b39', margin: '10px 0', borderBottom: '1px solid #e5d7ba', display: 'inline-block', paddingBottom: '2px', minWidth: '320px' }}>
                  {certData.userName}
                </div>
                
                <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6', maxWidth: '580px', margin: '15px auto 25px auto' }}>
                  for successfully completing the course 
                  <strong style={{ fontWeight: 700, color: '#111', fontSize: '1.2rem', display: 'block', marginTop: '6px', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: '#c5a059' }}>
                    {certData.title}
                  </strong>
                  and demonstrating mastery in all required modules and assessments.
                </div>
                
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 30px' }}>
                  <div style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ borderBottom: '1.5px solid #c5a059', fontFamily: "'Great Vibes', cursive", fontSize: '1.8rem', color: '#222', paddingBottom: '2px', marginBottom: '8px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Karan Paliwal
                    </div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1.5px', fontWeight: 500 }}>
                      Program Director
                    </div>
                  </div>
                  
                  <div style={{ width: '90px', height: '90px', background: 'radial-gradient(circle, #f3e5ab, #d4af37, #aa7c11)', borderRadius: '50%', border: '4px dotted #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    <span>OFFICIAL</span>
                    <span style={{ fontSize: '0.5rem', opacity: 0.9 }}>SEAL</span>
                  </div>
                  
                  <div style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ borderBottom: '1.5px solid #c5a059', fontSize: '0.95rem', color: '#222', paddingBottom: '2px', marginBottom: '8px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500' }}>
                      {formattedDate}
                    </div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1.5px', fontWeight: 500 }}>
                      Date of Issue
                    </div>
                  </div>
                </div>
                
                <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#999', position: 'absolute', bottom: '15px', left: '20px' }}>
                  ID: {certData.credentialId}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewerModal;
