import { User, LoginData } from "@shared/schema";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  getState(): AuthState {
    return this.state;
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  async login(loginData: LoginData): Promise<User> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const user = await response.json();
    this.state = {
      user,
      isAuthenticated: true,
    };
    
    // Store in localStorage for persistence
    localStorage.setItem("auth", JSON.stringify(this.state));
    this.notify();
    
    return user;
  }

  async register(userData: any): Promise<User> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const user = await response.json();
    return user;
  }

  logout() {
    this.state = {
      user: null,
      isAuthenticated: false,
    };
    localStorage.removeItem("auth");
    this.notify();
  }

  // Initialize auth state from localStorage
  initialize() {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.isAuthenticated) {
          this.state = parsed;
          this.notify();
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth from localStorage:", error);
    }
  }
}

export const authManager = new AuthManager();

// Initialize auth on module load
authManager.initialize();
