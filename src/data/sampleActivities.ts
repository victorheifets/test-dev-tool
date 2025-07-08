import { Activity, ActivityStatus, ActivityType } from '../types/activity';

export const sampleActivities: Activity[] = [
  {
    id: '1',
    provider_id: '12345678-1234-5678-1234-567812345678',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
    is_active: true,
    name: 'Introduction to React Development',
    description: 'Learn the fundamentals of React.js, including components, state management, and modern development practices. Perfect for beginners looking to start their frontend journey.',
    capacity: 25,
    start_date: '2025-08-15',
    end_date: '2025-08-17',
    status: ActivityStatus.PUBLISHED,
    location: 'Online',
    activity_type: ActivityType.COURSE,
    price: 149.99,
    currency: 'USD',
    category: 'Web Development',
    enrollments_count: 18,
    available_spots: 7,
    is_fully_booked: false
  },
  {
    id: '2',
    provider_id: '12345678-1234-5678-1234-567812345678',
    created_at: '2025-01-02T14:30:00Z',
    updated_at: '2025-01-02T14:30:00Z',
    is_active: true,
    name: 'Advanced Python Programming',
    description: 'Deep dive into advanced Python concepts including decorators, metaclasses, async programming, and performance optimization. Ideal for experienced developers.',
    capacity: 15,
    start_date: '2025-09-01',
    end_date: '2025-09-05',
    status: ActivityStatus.ONGOING,
    location: 'Hybrid',
    activity_type: ActivityType.WORKSHOP,
    price: 299.99,
    currency: 'USD',
    category: 'Software Development',
    enrollments_count: 12,
    available_spots: 3,
    is_fully_booked: false
  }
];