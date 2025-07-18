// SMS service implementation using course management API
import { dataProvider } from '../providers/dataProvider';

export interface SMSRecipient {
  id: string;
  name: string;
  phone: string;
  type: 'individual' | 'course' | 'lead_group';
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  phone: string;
  name: string;
}

export interface SMSBatchResult {
  totalSent: number;
  successCount: number;
  failedCount: number;
  results: SMSResult[];
  cost: number;
}

// Send SMS using the course management API
export const sendSMSBatch = async (
  recipients: SMSRecipient[],
  message: string
): Promise<SMSBatchResult> => {
  try {
    // Extract phone numbers from recipients
    const phoneNumbers = recipients.map(r => r.phone);
    console.log('📤 [smsService] Sending SMS to:', phoneNumbers);
    
    // Call the SMS API endpoint
    const response = await dataProvider.custom!({
      url: '/sms/send',
      method: 'post',
      payload: {
        message: message,
        phone_numbers: phoneNumbers,
        sender_id: 'CourseApp',
        sms_type: 'Promotional'
      }
    });
    console.log('📤 [smsService] SMS sent successfully:', response);
    
    // Check if the SMS was actually sent successfully
    const isSuccess = response.data.status === 'sent' || response.data.status === 'success';
    
    // Map API response to expected format
    const results: SMSResult[] = recipients.map(recipient => ({
      success: isSuccess,
      messageId: response.data.message_id,
      phone: recipient.phone,
      name: recipient.name,
      error: !isSuccess ? `SMS failed: ${response.data.status}` : undefined
    }));
    
    const successCount = isSuccess ? response.data.total_recipients : 0;
    const failedCount = isSuccess ? 0 : response.data.total_recipients;
    const cost = successCount * 0.1; // Only charge for successful messages
    
    return {
      totalSent: recipients.length,
      successCount,
      failedCount,
      results,
      cost
    };
    
  } catch (error) {
    console.error('SMS API error:', error);
    
    // Re-throw the error so it's properly handled by the UI
    throw error;
  }
};
