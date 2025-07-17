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
    console.log('📤 [smsService] Sending SMS to phone numbers:', phoneNumbers);
    
    // Call the SMS API endpoint
    console.log('📤 [smsService] Making API call to /sms/send');
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
    console.log('📤 [smsService] API response:', response);
    
    // Map API response to expected format
    const results: SMSResult[] = recipients.map(recipient => ({
      success: true, // Assume success for now - API doesn't return per-recipient status
      messageId: response.data.message_id,
      phone: recipient.phone,
      name: recipient.name
    }));
    
    const successCount = response.data.total_recipients;
    const failedCount = 0; // API doesn't provide failure count yet
    const cost = successCount * 0.1; // Rough estimate - $0.1 per SMS
    
    return {
      totalSent: recipients.length,
      successCount,
      failedCount,
      results,
      cost
    };
    
  } catch (error) {
    console.error('SMS API error:', error);
    
    // Return error response
    const results: SMSResult[] = recipients.map(recipient => ({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      phone: recipient.phone,
      name: recipient.name
    }));
    
    return {
      totalSent: recipients.length,
      successCount: 0,
      failedCount: recipients.length,
      results,
      cost: 0
    };
  }
};
