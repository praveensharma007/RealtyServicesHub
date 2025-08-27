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
