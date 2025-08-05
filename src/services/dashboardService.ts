import { buildApiUrl, getAuthHeaders } from '../config/api';

export interface DashboardStats {
  totalCourses: number;
  activeStudents: number;
  totalLeads: number;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'lead' | 'cancellation';
  student: string;
  course: string;
  time: string;
  avatar: string;
}

export interface TopCourse {
  id: string;
  name: string;
  enrolled: number;
  capacity: number;
  progress: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'course' | 'workshop' | 'seminar' | 'event';
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  topCourses: TopCourse[];
  upcomingEvents: UpcomingEvent[];
}

class DashboardService {
  private async httpClient<T>(url: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    if (response.status === 204 || !hasJsonContent) {
      return {} as T;
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return {} as T;
    }
    
    const data = JSON.parse(text);
    // Handle paginated responses with 'items' key
    if (data.items && Array.isArray(data.items)) {
      return data.items as T;
    }
    return data.data || data;
  }

  async getStats(): Promise<DashboardStats> {
    try {
      // Fetch data from available endpoints since /statistics might not exist
      const [activities, participants, enrollments] = await Promise.all([
        this.httpClient<any[]>(buildApiUrl('activities')).catch(() => []),
        this.httpClient<any[]>(buildApiUrl('participants')).catch(() => []),
        this.httpClient<any[]>(buildApiUrl('enrollments')).catch(() => [])
      ]);

      // Calculate basic statistics from actual data
      const totalCourses = Array.isArray(activities) ? activities.length : 0;
      const activeStudents = Array.isArray(participants) ? participants.filter(p => p.is_active !== false).length : 0;
      
      // Calculate leads count from marketing endpoint
      const leads = await this.httpClient<any[]>(buildApiUrl('marketing')).catch(() => []);
      const totalLeads = Array.isArray(leads) ? leads.length : 0;

      // Calculate revenue from activities with pricing
      const revenue = Array.isArray(activities) ? 
        activities.reduce((sum, activity) => {
          const price = activity.pricing?.amount || activity.price || 0;
          const enrolled = activity.enrolled || 0;
          return sum + (price * enrolled);
        }, 0) : 0;

      return {
        totalCourses,
        activeStudents,
        totalLeads,
        revenue,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Return default values if API fails
      return {
        totalCourses: 0,
        activeStudents: 0,
        totalLeads: 0,
        revenue: 0,
      };
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      // Fetch recent enrollments, participants, and leads to create activity feed
      const [enrollments, participants, leads] = await Promise.all([
        this.httpClient<any[]>(buildApiUrl('enrollments') + '?limit=10&sort_by=created_at&sort_order=desc'),
        this.httpClient<any[]>(buildApiUrl('participants') + '?limit=5&sort_by=created_at&sort_order=desc'),
        this.httpClient<any[]>(buildApiUrl('marketing') + '?limit=5&sort_by=created_at&sort_order=desc')
      ]);

      const activities: RecentActivity[] = [];

      // Add recent enrollments
      if (Array.isArray(enrollments)) {
        enrollments.slice(0, 5).forEach(enrollment => {
          activities.push({
            id: `enrollment-${enrollment.id}`,
            type: 'enrollment',
            student: `${enrollment.participant?.first_name || 'Unknown'} ${enrollment.participant?.last_name || 'Student'}`,
            course: enrollment.activity?.name || 'Unknown Course',
            time: this.formatTimeAgo(enrollment.created_at),
            avatar: this.getInitials(`${enrollment.participant?.first_name || ''} ${enrollment.participant?.last_name || ''}`)
          });
        });
      }

      // Add recent participants (new registrations)
      if (Array.isArray(participants)) {
        participants.slice(0, 3).forEach(participant => {
          activities.push({
            id: `participant-${participant.id}`,
            type: 'enrollment',
            student: `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || 'New Student',
            course: 'General Registration',
            time: this.formatTimeAgo(participant.created_at),
            avatar: this.getInitials(`${participant.first_name || ''} ${participant.last_name || ''}`)
          });
        });
      }

      // Add recent leads
      if (Array.isArray(leads)) {
        leads.slice(0, 2).forEach(lead => {
          activities.push({
            id: `lead-${lead.id}`,
            type: 'lead',
            student: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'New Lead',
            course: lead.activity_of_interest || 'Interest Inquiry',
            time: this.formatTimeAgo(lead.created_at),
            avatar: this.getInitials(`${lead.first_name || ''} ${lead.last_name || ''}`)
          });
        });
      }

      // Sort by most recent and return top 8
      return activities
        .sort((a, b) => this.parseTimeAgo(a.time) - this.parseTimeAgo(b.time))
        .slice(0, 8);

    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      return [];
    }
  }

  async getTopCourses(): Promise<TopCourse[]> {
    try {
      // Fetch both activities and enrollments in parallel
      const [activities, allEnrollments] = await Promise.all([
        this.httpClient<any[]>(buildApiUrl('activities')).catch(() => []),
        this.httpClient<any[]>(buildApiUrl('enrollments')).catch(() => [])
      ]);
      
      if (!Array.isArray(activities)) {
        return [];
      }

      // Create enrollment count map for faster lookup
      const enrollmentCounts = new Map<string, number>();
      if (Array.isArray(allEnrollments)) {
        allEnrollments.forEach(enrollment => {
          const activityId = enrollment.activity_id;
          if (activityId) {
            enrollmentCounts.set(activityId, (enrollmentCounts.get(activityId) || 0) + 1);
          }
        });
      }

      // Process activities with enrollment counts
      const coursesWithEnrollments = activities.map(activity => {
        const enrolledCount = enrollmentCounts.get(activity.id) || 0;
        const capacity = activity.capacity || 50;
        const progress = capacity > 0 ? Math.round((enrolledCount / capacity) * 100) : 0;

        return {
          id: activity.id,
          name: activity.name || 'Unnamed Course',
          enrolled: enrolledCount,
          capacity: capacity,
          progress: Math.min(progress, 100), // Cap at 100%
        };
      });

      // Sort by enrollment count and return top 6
      return coursesWithEnrollments
        .sort((a, b) => b.enrolled - a.enrolled)
        .slice(0, 6);

    } catch (error) {
      console.error('Failed to fetch top courses:', error);
      return [];
    }
  }

  async getUpcomingEvents(): Promise<UpcomingEvent[]> {
    try {
      const activities = await this.httpClient<any[]>(buildApiUrl('activities'));
      
      if (!Array.isArray(activities)) {
        return [];
      }

      const now = new Date();
      const upcomingActivities = activities
        .filter(activity => {
          if (!activity.start_date) return false;
          const startDate = new Date(activity.start_date);
          return startDate > now;
        })
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        .slice(0, 5);

      return upcomingActivities.map(activity => ({
        id: activity.id,
        title: activity.name || 'Unnamed Event',
        date: this.formatDate(activity.start_date),
        time: this.formatTime(activity.start_date),
        type: this.getEventType(activity.type || activity.category)
      }));

    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
      return [];
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch all data in one batch to optimize performance
      const [activities, participants, enrollments, leads] = await Promise.all([
        this.httpClient<any[]>(buildApiUrl('activities')).catch(() => []),
        this.httpClient<any[]>(buildApiUrl('participants')).catch(() => []),
        this.httpClient<any[]>(buildApiUrl('enrollments')).catch(() => []),
        this.httpClient<any[]>(buildApiUrl('marketing')).catch(() => [])
      ]);

      // Calculate stats
      const stats = this.calculateStats(activities, participants, enrollments, leads);
      
      // Calculate recent activity
      const recentActivity = this.calculateRecentActivity(enrollments, participants, leads);
      
      // Calculate top courses
      const topCourses = this.calculateTopCourses(activities, enrollments);
      
      // Calculate upcoming events
      const upcomingEvents = this.calculateUpcomingEvents(activities);

      return {
        stats,
        recentActivity,
        topCourses,
        upcomingEvents
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  // Helper methods for processing cached data
  private calculateStats(activities: any[], participants: any[], enrollments: any[], leads: any[]): DashboardStats {
    const totalCourses = Array.isArray(activities) ? activities.length : 0;
    const activeStudents = Array.isArray(participants) ? participants.filter(p => p.is_active !== false).length : 0;
    
    // Calculate new leads (leads from the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const totalLeads = Array.isArray(leads) ? 
      leads.filter(lead => {
        if (!lead.created_at) return false;
        const createdDate = new Date(lead.created_at);
        return createdDate >= thirtyDaysAgo;
      }).length : 0;

    const revenue = Array.isArray(activities) ? 
      activities.reduce((sum, activity) => {
        const price = activity.pricing?.amount || activity.price || 0;
        const enrolled = activity.enrolled || 0;
        return sum + (price * enrolled);
      }, 0) : 0;

    return { totalCourses, activeStudents, totalLeads, revenue };
  }

  private calculateRecentActivity(enrollments: any[], participants: any[], leads: any[]): RecentActivity[] {
    const activities: RecentActivity[] = [];

    // Add recent enrollments
    if (Array.isArray(enrollments)) {
      enrollments
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .forEach(enrollment => {
          activities.push({
            id: `enrollment-${enrollment.id}`,
            type: 'enrollment',
            student: `${enrollment.participant?.first_name || 'Unknown'} ${enrollment.participant?.last_name || 'Student'}`,
            course: enrollment.activity?.name || 'Unknown Course',
            time: this.formatTimeAgo(enrollment.created_at),
            avatar: this.getInitials(`${enrollment.participant?.first_name || ''} ${enrollment.participant?.last_name || ''}`)
          });
        });
    }

    // Add recent participants
    if (Array.isArray(participants)) {
      participants
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .forEach(participant => {
          activities.push({
            id: `participant-${participant.id}`,
            type: 'enrollment',
            student: `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || 'New Student',
            course: 'General Registration',
            time: this.formatTimeAgo(participant.created_at),
            avatar: this.getInitials(`${participant.first_name || ''} ${participant.last_name || ''}`)
          });
        });
    }

    // Add recent leads
    if (Array.isArray(leads)) {
      leads
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2)
        .forEach(lead => {
          activities.push({
            id: `lead-${lead.id}`,
            type: 'lead',
            student: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'New Lead',
            course: lead.activity_of_interest || 'Interest Inquiry',
            time: this.formatTimeAgo(lead.created_at),
            avatar: this.getInitials(`${lead.first_name || ''} ${lead.last_name || ''}`)
          });
        });
    }

    return activities
      .sort((a, b) => this.parseTimeAgo(a.time) - this.parseTimeAgo(b.time))
      .slice(0, 8);
  }

  private calculateTopCourses(activities: any[], enrollments: any[]): TopCourse[] {
    if (!Array.isArray(activities)) return [];

    // Create enrollment count map
    const enrollmentCounts = new Map<string, number>();
    if (Array.isArray(enrollments)) {
      enrollments.forEach(enrollment => {
        const activityId = enrollment.activity_id;
        if (activityId) {
          enrollmentCounts.set(activityId, (enrollmentCounts.get(activityId) || 0) + 1);
        }
      });
    }

    return activities.map(activity => {
      const enrolledCount = enrollmentCounts.get(activity.id) || 0;
      const capacity = activity.capacity || 50;
      const progress = capacity > 0 ? Math.round((enrolledCount / capacity) * 100) : 0;

      return {
        id: activity.id,
        name: activity.name || 'Unnamed Course',
        enrolled: enrolledCount,
        capacity: capacity,
        progress: Math.min(progress, 100),
      };
    })
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 6);
  }

  private calculateUpcomingEvents(activities: any[]): UpcomingEvent[] {
    if (!Array.isArray(activities)) return [];

    const now = new Date();
    return activities
      .filter(activity => {
        if (!activity.start_date) return false;
        const startDate = new Date(activity.start_date);
        return startDate > now;
      })
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 5)
      .map(activity => ({
        id: activity.id,
        title: activity.name || 'Unnamed Event',
        date: this.formatDate(activity.start_date),
        time: this.formatTime(activity.start_date),
        type: this.getEventType(activity.type || activity.category)
      }));
  }

  // Helper methods
  private formatTimeAgo(dateString: string): string {
    if (!dateString) return 'Unknown time';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) {
        return diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
      } else {
        return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
      }
    } catch (error) {
      return 'Unknown time';
    }
  }

  private parseTimeAgo(timeAgo: string): number {
    // Convert time ago string back to milliseconds for sorting
    const match = timeAgo.match(/(\d+)\s+(minute|hour|day)s?\s+ago/);
    if (!match) return 0;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'minute': return value;
      case 'hour': return value * 60;
      case 'day': return value * 60 * 24;
      default: return 0;
    }
  }

  private getInitials(fullName: string): string {
    const name = fullName.trim();
    if (!name) return '??';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase() + (parts[0].charAt(1) || '').toUpperCase();
    }
    
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      return '';
    }
  }

  private formatTime(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return '';
    }
  }

  private getEventType(type: string): 'course' | 'workshop' | 'seminar' | 'event' {
    if (!type) return 'event';
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('workshop')) return 'workshop';
    if (lowerType.includes('seminar')) return 'seminar';
    if (lowerType.includes('course')) return 'course';
    return 'event';
  }
}

export const dashboardService = new DashboardService();