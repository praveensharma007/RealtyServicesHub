import { randomUUID } from "crypto";
import { 
  User, Property, Service, Booking, PropertyLike, PropertyView,
  InsertUser, InsertProperty, InsertService, InsertBooking, 
  InsertPropertyLike, InsertPropertyView, LoginData 
} from "@shared/schema";

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  validateUser(email: string, password: string, role: string): Promise<User | null>;

  // Property methods
  createProperty(property: InsertProperty, ownerId: string): Promise<Property>;
  getProperties(): Promise<Property[]>;
  getPropertiesByOwner(ownerId: string): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  updateProperty(id: string, updates: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  incrementPropertyViews(id: string): Promise<void>;

  // Service methods  
  createService(service: InsertService, providerId: string): Promise<Service>;
  getServices(): Promise<Service[]>;
  getServicesByProvider(providerId: string): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | undefined>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  getBookingsByProvider(providerId: string): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | undefined>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<boolean>;

  // Property interaction methods
  likeProperty(like: InsertPropertyLike): Promise<PropertyLike>;
  unlikeProperty(userId: string, propertyId: string): Promise<boolean>;
  isPropertyLiked(userId: string, propertyId: string): Promise<boolean>;
  getLikedProperties(userId: string): Promise<Property[]>;
  recordPropertyView(view: InsertPropertyView): Promise<PropertyView>;
  getViewedProperties(userId: string): Promise<Property[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private properties: Map<string, Property> = new Map();
  private services: Map<string, Service> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private propertyLikes: Map<string, PropertyLike> = new Map();
  private propertyViews: Map<string, PropertyView> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample service providers
    const sampleProviders = [
      {
        id: "provider-1",
        email: "john.plumber@example.com",
        password: "password123",
        role: "provider" as const,
        name: "John's Plumbing Services",
        phone: "+1-555-0101",
        createdAt: new Date(),
      },
      {
        id: "provider-2", 
        email: "sarah.electric@example.com",
        password: "password123",
        role: "provider" as const,
        name: "Sarah's Electrical Solutions",
        phone: "+1-555-0102",
        createdAt: new Date(),
      },
      {
        id: "provider-3",
        email: "mike.transport@example.com",
        password: "password123", 
        role: "provider" as const,
        name: "Mike's Premium Cab Service",
        phone: "+1-555-0103",
        createdAt: new Date(),
      }
    ];

    // Create sample property owners
    const sampleOwners = [
      {
        id: "owner-1",
        email: "lisa.properties@example.com",
        password: "password123",
        role: "owner" as const,
        name: "Lisa Property Management",
        phone: "+1-555-0201",
        createdAt: new Date(),
      },
      {
        id: "owner-2",
        email: "robert.estates@example.com", 
        password: "password123",
        role: "owner" as const,
        name: "Robert Real Estate",
        phone: "+1-555-0202",
        createdAt: new Date(),
      }
    ];

    // Add users to storage
    [...sampleProviders, ...sampleOwners].forEach(user => {
      this.users.set(user.id, user);
    });

    // Create sample services
    const sampleServices = [
      {
        id: "service-1",
        providerId: "provider-1",
        category: "plumbing" as const,
        title: "Emergency Plumbing Repair",
        description: "24/7 emergency plumbing services for residential and commercial properties. Expert in pipe repairs, leak detection, and drain cleaning.",
        priceRange: "$80-150/hour",
        availability: true,
        rating: "4.8",
        totalBookings: 25,
        createdAt: new Date(),
      },
      {
        id: "service-2",
        providerId: "provider-1",
        category: "plumbing" as const,
        title: "Bathroom Renovation Plumbing",
        description: "Complete plumbing solutions for bathroom renovations including fixture installation and pipe relocation.",
        priceRange: "$200-500/project",
        availability: true,
        rating: "4.9",
        totalBookings: 12,
        createdAt: new Date(),
      },
      {
        id: "service-3",
        providerId: "provider-2",
        category: "electrical" as const,
        title: "Home Electrical Inspection",
        description: "Comprehensive electrical safety inspections for residential properties. Licensed and insured electrician.",
        priceRange: "$120-200/inspection",
        availability: true,
        rating: "4.7",
        totalBookings: 18,
        createdAt: new Date(),
      },
      {
        id: "service-4",
        providerId: "provider-2",
        category: "electrical" as const,
        title: "Electrical Panel Upgrade",
        description: "Professional electrical panel upgrades and circuit breaker installations for safer electrical systems.",
        priceRange: "$800-1500/project",
        availability: true,
        rating: "4.9",
        totalBookings: 8,
        createdAt: new Date(),
      },
      {
        id: "service-5",
        providerId: "provider-3",
        category: "cab" as const,
        title: "Premium Airport Transfer",
        description: "Luxury airport transfer service with professional drivers and premium vehicles. Available 24/7.",
        priceRange: "$45-80/trip",
        availability: true,
        rating: "4.8",
        totalBookings: 156,
        createdAt: new Date(),
      },
      {
        id: "service-6",
        providerId: "provider-3",
        category: "cab" as const,
        title: "City Tour Service",
        description: "Guided city tours with knowledgeable local drivers. Comfortable vehicles and flexible schedules.",
        priceRange: "$35-60/hour",
        availability: true,
        rating: "4.6",
        totalBookings: 67,
        createdAt: new Date(),
      }
    ];

    // Add services to storage
    sampleServices.forEach(service => {
      this.services.set(service.id, service);
    });

    // Create sample properties
    const sampleProperties = [
      {
        id: "property-1",
        ownerId: "owner-1",
        title: "Modern Downtown Apartment",
        description: "Luxurious 2-bedroom apartment in the heart of downtown with stunning city views and premium amenities.",
        propertyType: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        address: "123 Main Street, Downtown District, Metro City",
        monthlyRent: "2800.00",
        contactNumber: "+1-555-0201",
        images: [],
        status: "available" as const,
        views: 45,
        likes: 12,
        createdAt: new Date(),
      },
      {
        id: "property-2",
        ownerId: "owner-1", 
        title: "Spacious Family House",
        description: "Beautiful 4-bedroom family house with large backyard, garage, and modern kitchen. Perfect for families.",
        propertyType: "house",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2400,
        address: "456 Oak Avenue, Suburban Heights, Metro City",
        monthlyRent: "3500.00",
        contactNumber: "+1-555-0201",
        images: [],
        status: "available" as const,
        views: 78,
        likes: 23,
        createdAt: new Date(),
      },
      {
        id: "property-3",
        ownerId: "owner-2",
        title: "Cozy Studio Loft",
        description: "Charming studio loft with exposed brick walls, high ceilings, and modern amenities. Great for young professionals.",
        propertyType: "studio",
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 650,
        address: "789 Industrial Way, Arts District, Metro City",
        monthlyRent: "1800.00",
        contactNumber: "+1-555-0202",
        images: [],
        status: "pending" as const,
        views: 34,
        likes: 8,
        createdAt: new Date(),
      },
      {
        id: "property-4",
        ownerId: "owner-2",
        title: "Luxury Penthouse Condo",
        description: "Exclusive penthouse condo with panoramic city views, private terrace, and premium finishes throughout.",
        propertyType: "condo",
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 1800,
        address: "321 Skyline Drive, Uptown Elite, Metro City",
        monthlyRent: "5200.00",
        contactNumber: "+1-555-0202",
        images: [],
        status: "available" as const,
        views: 92,
        likes: 31,
        createdAt: new Date(),
      }
    ];

    // Add properties to storage
    sampleProperties.forEach(property => {
      this.properties.set(property.id, property);
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async validateUser(email: string, password: string, role: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password && user.role === role) {
      return user;
    }
    return null;
  }

  async createProperty(insertProperty: InsertProperty, ownerId: string): Promise<Property> {
    const id = randomUUID();
    const property: Property = {
      ...insertProperty,
      id,
      ownerId,
      views: 0,
      likes: 0,
      createdAt: new Date()
    };
    this.properties.set(id, property);
    return property;
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.ownerId === ownerId);
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (property) {
      const updated = { ...property, ...updates };
      this.properties.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  async incrementPropertyViews(id: string): Promise<void> {
    const property = this.properties.get(id);
    if (property) {
      property.views = (property.views || 0) + 1;
      this.properties.set(id, property);
    }
  }

  async createService(insertService: InsertService, providerId: string): Promise<Service> {
    const id = randomUUID();
    const service: Service = {
      ...insertService,
      id,
      providerId,
      rating: "0.0",
      totalBookings: 0,
      createdAt: new Date()
    };
    this.services.set(id, service);
    return service;
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByProvider(providerId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.providerId === providerId);
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (service) {
      const updated = { ...service, ...updates };
      this.services.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.userId === userId);
  }

  async getBookingsByProvider(providerId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.providerId === providerId);
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      const updated = { ...booking, ...updates };
      this.bookings.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookings.delete(id);
  }

  async likeProperty(insertLike: InsertPropertyLike): Promise<PropertyLike> {
    const id = randomUUID();
    const like: PropertyLike = {
      ...insertLike,
      id,
      createdAt: new Date()
    };
    this.propertyLikes.set(id, like);
    
    // Increment property likes count
    const property = this.properties.get(insertLike.propertyId);
    if (property) {
      property.likes = (property.likes || 0) + 1;
      this.properties.set(insertLike.propertyId, property);
    }
    
    return like;
  }

  async unlikeProperty(userId: string, propertyId: string): Promise<boolean> {
    const like = Array.from(this.propertyLikes.values())
      .find(l => l.userId === userId && l.propertyId === propertyId);
    
    if (like) {
      this.propertyLikes.delete(like.id);
      
      // Decrement property likes count
      const property = this.properties.get(propertyId);
      if (property && property.likes! > 0) {
        property.likes = property.likes! - 1;
        this.properties.set(propertyId, property);
      }
      
      return true;
    }
    return false;
  }

  async isPropertyLiked(userId: string, propertyId: string): Promise<boolean> {
    return Array.from(this.propertyLikes.values())
      .some(l => l.userId === userId && l.propertyId === propertyId);
  }

  async getLikedProperties(userId: string): Promise<Property[]> {
    const likedPropertyIds = Array.from(this.propertyLikes.values())
      .filter(l => l.userId === userId)
      .map(l => l.propertyId);
    
    return Array.from(this.properties.values())
      .filter(p => likedPropertyIds.includes(p.id));
  }

  async recordPropertyView(insertView: InsertPropertyView): Promise<PropertyView> {
    const id = randomUUID();
    const view: PropertyView = {
      ...insertView,
      id,
      viewedAt: new Date()
    };
    this.propertyViews.set(id, view);
    
    // Increment property views count
    await this.incrementPropertyViews(insertView.propertyId);
    
    return view;
  }

  async getViewedProperties(userId: string): Promise<Property[]> {
    const viewedPropertyIds = Array.from(this.propertyViews.values())
      .filter(v => v.userId === userId)
      .map(v => v.propertyId);
    
    const uniquePropertyIds = [...new Set(viewedPropertyIds)];
    
    return Array.from(this.properties.values())
      .filter(p => uniquePropertyIds.includes(p.id));
  }
}

export const storage = new MemStorage();
