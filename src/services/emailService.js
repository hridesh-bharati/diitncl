// diit\src\services\emailService.js

const API_URL = "/api/send-mail";

export const sendEmailNotification = async (to, subject, html) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });

    // Check if JSON response is valid
    const data = await response.json().catch(() => ({ success: false }));
    return data.success;
  } catch (err) {
    console.error("Vercel Fetch Error:", err);
    return false;
  }
};

// --- Contact Templates ---
export const supportTemplate = (data) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <div style="background-color: #0061ff; padding: 20px; text-align: center; color: white;">
      <h2 style="margin: 0; font-size: 22px; letter-spacing: 1px;">DRISHTEE COMPUTER CENTRE</h2>
      <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">New Website Support Inquiry</p>
    </div>

    <div style="padding: 25px; background-color: #ffffff;">
      <p style="color: #555; font-size: 15px;">Hello Admin, you have received a new query from the website contact form.</p>
      
      <div style="background-color: #f8f9fa; border-left: 4px solid #0061ff; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #777; font-size: 13px; width: 100px;">Full Name</td>
            <td style="padding: 8px 0; color: #333; font-weight: bold;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777; font-size: 13px;">Mobile No</td>
            <td style="padding: 8px 0;">
              <a href="tel:${data.mobile}" style="color: #0061ff; text-decoration: none; font-weight: bold;">${data.mobile}</a>
            </td>
          </tr>

          <tr>
            <td colspan="2" style="padding: 8px 0 2px 0; color: #777; font-size: 13px;">Email ID</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 0 0 8px 0; color: #333; font-weight: 500;">${data.email || 'N/A'}</td>
          </tr>

          <tr>
            <td colspan="2" style="padding: 8px 0 2px 0; color: #777; font-size: 13px;">Subject/Course</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 0 0 8px 0; color: #333; font-weight: 500; line-height: 1.4;">${data.title}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 20px;">
        <strong style="display: block; color: #333; margin-bottom: 8px; font-size: 14px; text-transform: uppercase;">Message:</strong>
        <div style="background-color: #fffdee; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px; color: #555; font-style: italic; line-height: 1.6;">
          "${data.query}"
        </div>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <a href="https://wa.me/91${data.mobile}" style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
          Reply on WhatsApp
        </a>
      </div>
    </div>

    <div style="background-color: #f1f1f1; padding: 15px; text-align: center; color: #888; font-size: 12px;">
      <p style="margin: 0;">Sent via Drishtee Online Support System</p>
      <p style="margin: 5px 0 0;">Date: ${new Date().toLocaleString('en-IN')}</p>
    </div>
  </div>
`;

// --- New Admission alert Templates for Admin ---
export const adminAdmissionAlertTemplate = (data) => `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 650px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #fdfdfd;">
    <div style="background: #001529; color: #ffca28; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">NEW ADMISSION ALERT</h2>
      <p style="margin: 5px 0 0; color: #fff; font-size: 14px;">Drishtee Computer Centre - Online Portal</p>
    </div>
    
    <div style="padding: 25px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${data.photoUrl}" alt="Student" style="width: 100px; height: 120px; border: 3px solid #001529; object-fit: cover;" />
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="background: #f4f4f4;"><td style="padding: 10px; font-weight: bold; width: 40%;">Student Name:</td><td style="padding: 10px;">${data.name}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Course Applied:</td><td style="padding: 10px; color: #d32f2f; font-weight: bold;">${data.course}</td></tr>
        <tr style="background: #f4f4f4;"><td style="padding: 10px; font-weight: bold;">Father's Name:</td><td style="padding: 10px;">${data.fatherName}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Mobile Number:</td><td style="padding: 10px;"><a href="tel:${data.mobile}">${data.mobile}</a></td></tr>
        <tr style="background: #f4f4f4;"><td style="padding: 10px; font-weight: bold;">Email ID:</td><td style="padding: 10px;">${data.email}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Branch:</td><td style="padding: 10px;">${data.branch}</td></tr>
        <tr style="background: #f4f4f4;"><td style="padding: 10px; font-weight: bold;">Qualification:</td><td style="padding: 10px;">${data.qualification}</td></tr>
      </table>

      <div style="margin-top: 25px; background: #fff8e1; padding: 15px; border: 1px solid #ffe082; border-radius: 5px;">
        <strong>Address:</strong><br/>
        ${data.address}
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <a href="https://drishteeindia.com/admin" style="background: #001529; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Admin Panel</a>
      </div>
    </div>
    
    <div style="background: #eee; padding: 10px; text-align: center; font-size: 11px; color: #777;">
      Applied on: ${new Date().toLocaleString('en-IN')}
    </div>
  </div>
`;

// Admission / Student Record delete 
export const deleteAccountTemplate = (student) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #fff;">
    
    <div style="background-color: #4b5563; padding: 25px; text-align: center; color: white;">
      <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px; text-transform: uppercase;">Record Deactivated</h2>
      <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.8;">Drishtee Computer Centre</p>
    </div>

    <div style="padding: 35px; color: #444;">
      <p style="font-size: 16px;">Hello <strong>${student.name}</strong>,</p>
      <p style="line-height: 1.6; font-size: 15px;">
        This is to officially inform you that your student record for the course 
        <strong style="color: #111;">${student.course || 'Enrolled Course'}</strong> 
        has been removed from our institute by the administrator.
      </p>
      
      <div style="background-color: #fffaf0; border-left: 4px solid #ed8936; border-radius: 4px; padding: 15px; margin: 25px 0; border: 1px solid #feebc8;">
        <p style="margin: 0; font-size: 13px; color: #744210; line-height: 1.5;">
          <strong>Important:</strong> If you believe this action was taken in error, or if you wish to re-enroll for upcoming sessions, please reach out to us immediately using the button below.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://drishteeindia.com/contact-us" 
           style="background-color: #4b5563; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
           Contact Support / Re-Enroll
        </a>
      </div>

      <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; pt-3">
        Best Regards,<br/>
        <strong style="color: #000;">Administration Department</strong><br/>
        <span>Drishtee Computer Centre</span>
      </p>
    </div>

    <div style="background-color: #f9fafb; padding: 15px; text-align: center; color: #9ca3af; font-size: 11px; border-top: 1px solid #eee;">
      <p style="margin: 0;">This is an automated system-generated notification. Please do not reply directly to this email.</p>
    </div>
  </div>
`;

// --- Admission approve Templates for student  for admission confirm---
export const admissionTemplate = (student, regNo) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); background-color: #fff;">
    <div style="background-color: #10b981; padding: 25px 20px; text-align: center; color: white;">
      <h2 style="margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 700;">DRISHTEE COMPUTER CENTRE</h2>
      <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.9; font-weight: 300;">Official Admission Confirmation</p>
    </div>

    <div style="padding: 35px; background-color: #ffffff;">
      <h3 style="color: #10b981; margin-top: 0; font-size: 20px;">Congratulations, ${student.name}!</h3>
      <p style="color: #444; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
        Your application has been successfully processed. We are pleased to welcome you as a student at <strong>Drishtee Computer Centre</strong>.
      </p>
      
      <div style="background-color: #f9fdfb; border: 1px solid #d1f2e5; border-left: 5px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 14px; width: 35%;">Reg No:</td>
            <td style="padding: 10px 0; color: #10b981; font-weight: bold; font-size: 17px;">${regNo}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 14px; vertical-align: top;">Course Enrolled:</td>
            <td style="padding: 10px 0; color: #333; font-weight: 600; font-size: 15px; line-height: 1.4;">
              ${student.course || 'General Computer Course'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">Branch / Centre:</td>
            <td style="padding: 10px 0; color: #333; font-weight: 500; font-size: 15px;">
              ${student.branch || student.centerCode || 'Main Campus'}
            </td>
          </tr>
        </table>
      </div>

      <p style="color: #777; font-size: 14px; line-height: 1.5;">
        <strong>Note:</strong> Please use your Registration Number for all future communications.
      </p>

      <div style="margin-top: 35px; text-align: center;">
        <a href="https://drishteeindia.com" style="background-color: #10b981; color: white; padding: 14px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px;">
          Go to Student Portal
        </a>
      </div>
    </div>
    <div style="background-color: #f7f7f7; padding: 18px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee;">
      <p style="margin: 0;">This is an automated enrollment notification from Drishtee IT System.</p>
    </div>
  </div>
`;

// Exam Assign Trigger Notification to student
export const examPermitTemplate = (student, exam) => {
  // Aapke dashboard se duration hours mein aa rahi hai (e.g., 1, 1.5, 2)
  const durationValue = exam.duration || 1;
  const durationText = `${durationValue} ${durationValue <= 1 ? 'Hour' : 'Hours'}`;

  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); background-color: #fff;">
    
    <div style="background-color: #fc0038; padding: 30px 20px; text-align: center; color: white;">
      <div style="font-size: 40px; margin-bottom: 10px;">📝</div>
      <h2 style="margin: 0; font-size: 26px; letter-spacing: 1.5px; font-weight: 800; text-transform: uppercase;">Examination Permit</h2>
      <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.9; font-weight: 300;">Drishtee Online Examination System</p>
    </div>

    <div style="padding: 35px; background-color: #ffffff;">
      <h3 style="color: #333; margin-top: 0; font-size: 20px;">Dear ${student.name},</h3>
      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        Your exam access has been successfully activated. You are now permitted to appear for the following assessment:
      </p>
      
      <div style="background-color: #fff5f6; border: 1px solid #fed7d7; border-left: 6px solid #fc0038; padding: 25px; border-radius: 8px; margin: 25px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #777; font-size: 14px; width: 40%;">Exam Title</td>
            <td style="padding: 10px 0; color: #333; font-weight: 700; font-size: 16px;">${exam.title}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #777; font-size: 14px;">Course Name</td>
            <td style="padding: 10px 0; color: #333; font-weight: 500;">${exam.course}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #777; font-size: 14px;">Time Duration</td>
            <td style="padding: 10px 0; color: #fc0038; font-weight: 800; font-size: 16px;">
               ${durationText}
            </td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px dashed #ccc;">
        <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.5;">
          <strong>Instructions:</strong><br>
          • Ensure you have a stable internet connection.<br>
          • Do not refresh the page during the examination.<br>
          • Your result will be generated immediately after submission.
        </p>
      </div>

      <div style="margin-top: 35px; text-align: center;">
        <a href="https://drishteeindia.com/login" style="background-color: #fc0038; color: white; padding: 16px 45px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(252,0,56,0.3); font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
          Start Exam Now
        </a>
      </div>
    </div>

    <div style="background-color: #f7f7f7; padding: 20px; text-align: center; color: #999; font-size: 11px; border-top: 1px solid #eee;">
      <p style="margin: 0; font-weight: bold; color: #777;">DRISHTEE COMPUTER CENTRE</p>
      <p style="margin: 5px 0 0;">Date: ${new Date().toLocaleDateString('en-IN')}</p>
    </div>
  </div>
`;
};

// Final Certification
export const certificateTemplate = (student, percent, issDate) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); background-color: #fff;">
    
    <div style="background-color: #3b82f6; padding: 25px 20px; text-align: center; color: white;">
      <h2 style="margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 700;">CERTIFICATE GENERATED</h2>
      <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.9;">Drishtee Computer Centre</p>
    </div>

    <div style="padding: 35px; background-color: #ffffff;">
      <h3 style="color: #3b82f6; margin-top: 0;">Great Job, ${student.name}!</h3>
      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        We are proud to inform you that your course has been completed and your <strong>Certificate</strong> is now ready for download.
      </p>
      
      <div style="background-color: #f0f7ff; border: 1px solid #d1e3ff; border-left: 5px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px; width: 40%;">Final Score:</td>
            <td style="padding: 8px 0; color: #3b82f6; font-weight: bold; font-size: 18px;">${percent}%</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Course:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${student.course || 'General'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Issue Date:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${issDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Reg No:</td>
            <td style="padding: 8px 0; color: #333;">${student.regNo}</td>
          </tr>
        </table>
      </div>

      <p style="color: #777; font-size: 14px;">You can login to your student portal to view and download your digital certificate.</p>

      <div style="margin-top: 35px; text-align: center;">
        <a href="https://drishteeindia.com/download-certificate" style="background-color: #3b82f6; color: white; padding: 14px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(59,130,246,0.25);">
          Download Certificate
        </a>
      </div>
    </div>

    <div style="background-color: #f7f7f7; padding: 15px; text-align: center; color: #999; font-size: 11px;">
      <p style="margin: 0;">Keep learning, keep growing! - Team Drishtee</p>
    </div>
  </div>
`;