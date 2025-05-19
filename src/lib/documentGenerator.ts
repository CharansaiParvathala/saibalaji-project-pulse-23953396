
import { supabase } from "@/integrations/supabase/client";
import { 
  Project, ProgressEntry, PaymentRequest, 
  Photo, Vehicle, Driver 
} from "@/types";

// Helper function to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Function to generate a complete data report in DOCX format
export async function generateDataReport(fileName: string): Promise<Blob | null> {
  try {
    // Fetch all data from Supabase
    const { data: projects } = await supabase.from('projects').select('*');
    const { data: progress } = await supabase.from('progress_entries').select('*');
    const { data: payments } = await supabase.from('payment_requests').select('*');
    const { data: users } = await supabase.from('profiles').select('*');
    const { data: vehicles } = await supabase.from('vehicles').select('*');
    const { data: drivers } = await supabase.from('drivers').select('*');
    const { data: photos } = await supabase.from('photos').select('*');
    
    // Create document content
    const documentContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #0000aa; }
          h2 { color: #aa0000; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { background-color: #d3d3d3; padding: 8px; border: 1px solid #808080; }
          td { padding: 8px; border: 1px solid #808080; }
          .section { margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <h1>Sai Balaji Construction - Complete Data Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        
        <div class="section">
          <h2>1. Projects (${projects?.length || 0})</h2>
          <table>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Workers</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
            ${projects?.map(p => `
              <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.num_workers}</td>
                <td>${p.status}</td>
                <td>${formatDate(p.created_at)}</td>
              </tr>
            `).join('') || 'No projects found.'}
          </table>
        </div>
        
        <div class="section">
          <h2>2. Progress Entries (${progress?.length || 0})</h2>
          <table>
            <tr>
              <th>Date</th>
              <th>Project</th>
              <th>Distance</th>
              <th>Workers</th>
              <th>Status</th>
            </tr>
            ${progress?.map(p => `
              <tr>
                <td>${formatDate(p.date)}</td>
                <td>${(projects?.find(proj => proj.id === p.project_id)?.name) || 'Unknown'}</td>
                <td>${p.distance_completed || 0} meters</td>
                <td>${p.workers_present || 0}</td>
                <td>${p.status}</td>
              </tr>
            `).join('') || 'No progress entries found.'}
          </table>
        </div>
        
        <div class="section">
          <h2>3. Payment Requests (${payments?.length || 0})</h2>
          <table>
            <tr>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Paid Date</th>
            </tr>
            ${payments?.map(p => `
              <tr>
                <td>${(projects?.find(proj => proj.id === p.project_id)?.name) || 'Unknown'}</td>
                <td>₹${p.amount}</td>
                <td>${p.status}</td>
                <td>${formatDate(p.requested_at)}</td>
                <td>${p.paid_date ? formatDate(p.paid_date) : 'Not paid'}</td>
              </tr>
            `).join('') || 'No payment requests found.'}
          </table>
        </div>
        
        <div class="section">
          <h2>4. Vehicles (${vehicles?.length || 0})</h2>
          <table>
            <tr>
              <th>Model</th>
              <th>Registration</th>
              <th>Type</th>
            </tr>
            ${vehicles?.map(v => `
              <tr>
                <td>${v.model}</td>
                <td>${v.registration_number}</td>
                <td>${v.type}</td>
              </tr>
            `).join('') || 'No vehicles found.'}
          </table>
        </div>
        
        <div class="section">
          <h2>5. Drivers (${drivers?.length || 0})</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>License</th>
              <th>Type</th>
            </tr>
            ${drivers?.map(d => `
              <tr>
                <td>${d.name}</td>
                <td>${d.license_number}</td>
                <td>${d.type}</td>
              </tr>
            `).join('') || 'No drivers found.'}
          </table>
        </div>
        
        <p>--- End of Report ---</p>
      </body>
    </html>
    `;
    
    // Convert HTML to Blob
    const blob = new Blob([documentContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    return blob;
  } catch (error) {
    console.error('Error generating data report:', error);
    return null;
  }
}

// Function to download the report
export function downloadReport(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
