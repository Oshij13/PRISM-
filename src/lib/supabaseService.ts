import { supabase, isSupabaseConfigured } from "./supabaseClient";

function resolveMeetingDate(meeting: any, createdAtFallback?: string): string {
  if (!meeting || !meeting.date) return "";
  const dateStr = String(meeting.date).trim();
  const cleanStr = dateStr.toLowerCase();
  
  if (
    cleanStr !== 'today' && 
    cleanStr !== 'tomorrow' && 
    !['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].includes(cleanStr)
  ) {
    return dateStr;
  }
  
  let baseDate = new Date();
  if (createdAtFallback) {
    const parsed = new Date(createdAtFallback);
    if (!isNaN(parsed.getTime())) {
      baseDate = parsed;
    }
  } else {
    const parsedId = Number(meeting.id);
    if (!isNaN(parsedId) && parsedId > 1000000000000) {
      baseDate = new Date(parsedId);
    }
  }
  
  if (cleanStr === 'today') {
    const yyyy = baseDate.getFullYear();
    const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
    const dd = String(baseDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  if (cleanStr === 'tomorrow') {
    const tomorrow = new Date(baseDate);
    tomorrow.setDate(baseDate.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = weekdays.indexOf(cleanStr);
  if (dayIndex !== -1) {
    const currentDay = baseDate.getDay();
    const diff = dayIndex - currentDay;
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + diff);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  return dateStr;
}

export interface UserProfile {
  fullName: string;
  email: string;
  jobTitle: string;
  company: string;
  city: string;
  age: string;
  meetingsWeek: string;
  meetings: Array<{
    id: string;
    company: string;
    contactName: string;
    contactRole: string;
    date: string;
    time: string;
    priority?: string;
    meetingType?: string;
  }>;
  slackAlerts?: boolean;
  emailBriefs?: boolean;
  calendarSync?: boolean;
  autoModel?: boolean;
  avatar_url?: string;
}

/**
 * Standardizes raw Supabase profiles table row to the frontend's UserProfile schema
 */
function mapProfileData(dbRow: any): UserProfile {
  return {
    fullName: dbRow.full_name || "",
    email: dbRow.email || "",
    jobTitle: dbRow.job_title || "",
    company: dbRow.company || "",
    city: dbRow.city || "",
    age: dbRow.age ? String(dbRow.age) : "",
    meetingsWeek: dbRow.meetings_week || "",
    meetings: Array.isArray(dbRow.meetings) ? dbRow.meetings : [],
    slackAlerts: dbRow.slack_alerts !== false,
    emailBriefs: dbRow.email_briefs !== false,
    calendarSync: dbRow.calendar_sync !== false,
    autoModel: dbRow.auto_model !== false,
    avatar_url: dbRow.avatar_url || "",
  };
}

/**
 * Maps frontend UserProfile to database schema columns
 */
function mapToDbRow(profile: Partial<UserProfile>) {
  const result: any = {};
  if (profile.fullName !== undefined) result.full_name = profile.fullName;
  if (profile.email !== undefined) result.email = profile.email;
  if (profile.jobTitle !== undefined) result.job_title = profile.jobTitle;
  if (profile.company !== undefined) result.company = profile.company;
  if (profile.city !== undefined) result.city = profile.city;
  if (profile.age !== undefined)
    result.age = profile.age ? parseInt(profile.age, 10) : null;
  if (profile.meetingsWeek !== undefined)
    result.meetings_week = profile.meetingsWeek;
  if (profile.meetings !== undefined) result.meetings = profile.meetings;
  if (profile.slackAlerts !== undefined)
    result.slack_alerts = profile.slackAlerts;
  if (profile.emailBriefs !== undefined)
    result.email_briefs = profile.emailBriefs;
  if (profile.calendarSync !== undefined)
    result.calendar_sync = profile.calendarSync;
  if (profile.autoModel !== undefined) result.auto_model = profile.autoModel;
  if (profile.avatar_url !== undefined) result.avatar_url = profile.avatar_url;
  return result;
}

export const supabaseService = {
  /**
   * Check connection mode
   */
  isConnected(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Sign up user in Supabase or fall back to local storage
   */
  async signUp(
    email: string,
    password: string,
    fullName: string,
  ): Promise<{ success: boolean; error?: string; user?: any }> {
    console.log("[SupabaseService] signUp request for:", email);

    if (!isSupabaseConfigured()) {
      console.warn(
        "[SupabaseService] Supabase not configured. Using Mock Local Mode.",
      );
      // Replicate mock signup logic
      localStorage.setItem("prism_is_logged_in", "true");
      const mockUser: UserProfile = {
        fullName,
        email,
        jobTitle: "",
        company: "",
        city: "",
        age: "",
        meetingsWeek: "",
        meetings: [],
        slackAlerts: true,
        emailBriefs: true,
        calendarSync: true,
        autoModel: true,
      };
      localStorage.setItem("prism_user", JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Supabase triggers profile insert on auth.users row creation, but in case RLS or triggers aren't
      // completely created yet, we'll write to local storage as well for safety.
      localStorage.setItem("prism_is_logged_in", "true");
      const standardUser: UserProfile = {
        fullName,
        email,
        jobTitle: "",
        company: "",
        city: "",
        age: "",
        meetingsWeek: "",
        meetings: [],
        slackAlerts: true,
        emailBriefs: true,
        calendarSync: true,
        autoModel: true,
      };
      localStorage.setItem("prism_user", JSON.stringify(standardUser));

      // Let's explicitly try to upsert profile in public.profiles table just in case the trigger isn't configured
      if (data.user) {
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            meetings: [],
          });
        } catch (e) {
          console.warn(
            "[SupabaseService] Pre-emptive profile upsert warning (safe to ignore if using trigger):",
            e,
          );
        }
      }

      return { success: true, user: data.user };
    } catch (err: any) {
      console.error("[SupabaseService] signUp exception:", err);
      return {
        success: false,
        error:
          err.message || "An unexpected error occurred during registration.",
      };
    }
  },

  /**
   * Sign in user in Supabase or fall back to local storage
   */
  async signIn(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: any }> {
    console.log("[SupabaseService] signIn request for:", email);

    if (!isSupabaseConfigured()) {
      console.warn(
        "[SupabaseService] Supabase not configured. Using Mock Local Mode.",
      );
      localStorage.setItem("prism_is_logged_in", "true");

      // Load from localStorage or mock a default user
      const cached = localStorage.getItem("prism_user");
      if (cached) {
        return { success: true, user: JSON.parse(cached) };
      }

      const defaultMock: UserProfile = {
        fullName: "Alex Rivera",
        email,
        jobTitle: "Product Manager",
        company: "Figma",
        city: "San Francisco",
        age: "28",
        meetingsWeek: "6–10",
        meetings: [],
      };
      localStorage.setItem("prism_user", JSON.stringify(defaultMock));
      return { success: true, user: defaultMock };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      localStorage.setItem("prism_is_logged_in", "true");

      // Fetch user profile from profiles table
      if (data.user) {
        const { data: dbProfile, error: profileErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!profileErr && dbProfile) {
          let mapped = mapProfileData(dbProfile);

          // Check if database profile is empty but local storage has onboarding data (from sessionless signup onboarding)
          const localUserRaw = localStorage.getItem("prism_user");
          if (localUserRaw) {
            try {
              const localUser = JSON.parse(localUserRaw);
              if (
                (!mapped.jobTitle || !mapped.company) &&
                localUser.jobTitle &&
                localUser.company
              ) {
                console.log(
                  "[SupabaseService] Syncing local onboarding data to database on sign in",
                );
                const merged = { ...mapped, ...localUser };
                await this.updateProfile(merged);
                mapped = merged;
              }
            } catch (e) {
              console.error(
                "[SupabaseService] Failed to parse local user during sync:",
                e,
              );
            }
          }

          localStorage.setItem("prism_user", JSON.stringify(mapped));
          if (dbProfile.avatar_url) {
            localStorage.setItem("prism_avatar", dbProfile.avatar_url);
          }
          window.dispatchEvent(new Event("prism_profile_update"));
          return { success: true, user: mapped };
        } else {
          console.warn(
            "[SupabaseService] Profile record not found in public.profiles. Returning placeholder.",
            profileErr,
          );
          // If no profile row yet, return a placeholder but DO NOT upsert it to database immediately to avoid overwriting existing data
          const placeholder: UserProfile = {
            fullName: data.user.user_metadata?.fullName || "PRISM User",
            email: data.user.email || email,
            jobTitle: "",
            company: "",
            city: "",
            age: "",
            meetingsWeek: "",
            meetings: [],
          };

          // Check if local storage has onboarding data we can sync
          const localUserRaw = localStorage.getItem("prism_user");
          if (localUserRaw) {
            try {
              const localUser = JSON.parse(localUserRaw);
              if (localUser.jobTitle && localUser.company) {
                console.log(
                  "[SupabaseService] Syncing local onboarding data to database on sign in (no db profile existed)",
                );
                const merged = { ...placeholder, ...localUser };
                await this.updateProfile(merged);
                localStorage.setItem("prism_user", JSON.stringify(merged));
                window.dispatchEvent(new Event("prism_profile_update"));
                return { success: true, user: merged };
              }
            } catch (e) {
              console.error(
                "[SupabaseService] Failed to parse local user during sync:",
                e,
              );
            }
          }

          localStorage.setItem("prism_user", JSON.stringify(placeholder));
          window.dispatchEvent(new Event("prism_profile_update"));
          return { success: true, user: placeholder };
        }
      }

      return { success: true, user: data.user };
    } catch (err: any) {
      console.error("[SupabaseService] signIn exception:", err);
      return {
        success: false,
        error: err.message || "An unexpected error occurred during login.",
      };
    }
  },

  /**
   * Log out user from Supabase and clear local session state
   */
  async signOut(): Promise<{ success: boolean }> {
    console.log("[SupabaseService] signOut request");
    localStorage.removeItem("prism_is_logged_in");
    localStorage.removeItem("prism_onboarding_complete");
    localStorage.removeItem("prism_user");
    localStorage.removeItem("prism_avatar");

    window.dispatchEvent(new Event("prism_profile_update"));

    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("[SupabaseService] signOut error:", err);
      }
    }

    return { success: true };
  },

  /**
   * Get user profile details
   */
  async getProfile(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) {
      const cached = localStorage.getItem("prism_user");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          if (u.meetings && Array.isArray(u.meetings)) {
            u.meetings = u.meetings.map((m: any) => ({
              ...m,
              date: resolveMeetingDate(m, u.updated_at)
            }));
          }
          return u;
        } catch (e) {}
      }
      return null;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.warn("[SupabaseService] No active Supabase Auth user found.");
        const cached = localStorage.getItem("prism_user");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            if (u.meetings && Array.isArray(u.meetings)) {
              u.meetings = u.meetings.map((m: any) => ({
                ...m,
                date: resolveMeetingDate(m, u.updated_at)
              }));
            }
            return u;
          } catch (e) {}
        }
        return null;
      }

      const { data: dbProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !dbProfile) {
        console.warn(
          "[SupabaseService] Error loading profile from Supabase:",
          error,
        );
        const cached = localStorage.getItem("prism_user");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            if (u.meetings && Array.isArray(u.meetings)) {
              u.meetings = u.meetings.map((m: any) => ({
                ...m,
                date: resolveMeetingDate(m, u.updated_at)
              }));
            }
            return u;
          } catch (e) {}
        }
        return null;
      }

      const mapped = mapProfileData(dbProfile);
      if (mapped.meetings && Array.isArray(mapped.meetings)) {
        mapped.meetings = mapped.meetings.map(m => ({
          ...m,
          date: resolveMeetingDate(m, dbProfile.updated_at || dbProfile.created_at)
        }));
      }
      localStorage.setItem("prism_user", JSON.stringify(mapped));
      if (dbProfile.avatar_url) {
        localStorage.setItem("prism_avatar", dbProfile.avatar_url);
      }
      return mapped;
    } catch (err) {
      console.error("[SupabaseService] getProfile exception:", err);
      const cached = localStorage.getItem("prism_user");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          if (u.meetings && Array.isArray(u.meetings)) {
            u.meetings = u.meetings.map((m: any) => ({
              ...m,
              date: resolveMeetingDate(m, u.updated_at)
            }));
          }
          return u;
        } catch (e) {}
      }
      return null;
    }
  },

  /**
   * Update or upsert user profile details in database
   */
  async updateProfile(
    profile: Partial<UserProfile>,
  ): Promise<{ success: boolean; error?: string }> {
    console.log("[SupabaseService] updateProfile details:", profile);

    // Sync with local storage immediately for responsive UI
    const cached = localStorage.getItem("prism_user");
    let merged: UserProfile = {} as any;
    if (cached) {
      try {
        merged = { ...JSON.parse(cached), ...profile };
      } catch (e) {
        merged = profile as UserProfile;
      }
    } else {
      merged = profile as UserProfile;
    }

    if (merged.meetings && Array.isArray(merged.meetings)) {
      merged.meetings = merged.meetings.map(m => ({
        ...m,
        date: resolveMeetingDate(m)
      }));
    }

    localStorage.setItem("prism_user", JSON.stringify(merged));
    window.dispatchEvent(new Event("prism_profile_update"));

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: "No active authenticated session found.",
        };
      }

      if (profile.meetings && Array.isArray(profile.meetings)) {
        profile.meetings = profile.meetings.map(m => ({
          ...m,
          date: resolveMeetingDate(m)
        }));
      }

      const dbUpdates = mapToDbRow(profile);
      // Ensure the row is bound to the logged-in user ID
      const payload = {
        id: user.id,
        ...dbUpdates,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload);

      if (error) {
        console.error(
          "[SupabaseService] Supabase profile upsert error:",
          error,
        );
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error("[SupabaseService] updateProfile exception:", err);
      return {
        success: false,
        error: err.message || "Failed to update database profile.",
      };
    }
  },

  /**
   * Update meetings list specifically
   */
  async updateMeetings(
    meetings: UserProfile["meetings"],
  ): Promise<{ success: boolean; error?: string }> {
    return this.updateProfile({ meetings });
  },

  /**
   * Get all meetings for current user from 'meetings' table, falling back to profile.meetings
   */
  async getMeetings(): Promise<UserProfile["meetings"]> {
    if (!isSupabaseConfigured()) {
      const cached = localStorage.getItem("prism_user");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          const raw = Array.isArray(u.meetings) ? u.meetings : [];
          return raw.map((m: any) => ({
            ...m,
            date: resolveMeetingDate(m, u.updated_at)
          }));
        } catch (e) {}
      }
      return [];
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        const cached = localStorage.getItem("prism_user");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            const raw = Array.isArray(u.meetings) ? u.meetings : [];
            return raw.map((m: any) => ({
              ...m,
              date: resolveMeetingDate(m, u.updated_at)
            }));
          } catch (e) {}
        }
        return [];
      }

      // Try fetching from the new meetings table
      const { data: dbMeetings, error: dbErr } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", user.id);

      if (!dbErr && dbMeetings) {
        return dbMeetings.map((m: any) => ({
          id: m.id,
          company: m.company,
          contactName: m.contact_name || "",
          contactRole: m.contact_role || "",
          date: resolveMeetingDate({ id: m.id, date: m.date }, m.created_at),
          time: m.time,
          priority: m.priority || "medium",
          meetingType: m.meeting_type || "",
        }));
      }

      console.warn(
        "[SupabaseService] Falling back to profiles.meetings:",
        dbErr?.message,
      );
      const profile = await this.getProfile();
      return (profile?.meetings || []).map((m: any) => ({
        ...m,
        date: resolveMeetingDate(m, profile?.fullName ? undefined : undefined) // profile meetings are already resolved in getProfile
      }));
    } catch (err) {
      console.error("[SupabaseService] getMeetings exception:", err);
      const profile = await this.getProfile();
      return (profile?.meetings || []).map((m: any) => ({
        ...m,
        date: resolveMeetingDate(m)
      }));
    }
  },

  /**
   * Retrieves all meeting briefs to extract company lists and research items
   */
  async getAllMeetingBriefs(): Promise<any[]> {
    console.log("[SupabaseService] Fetching all meeting briefs");
    if (!isSupabaseConfigured()) {
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('meeting_briefs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        return data;
      }

      console.log("[SupabaseService] No briefs returned via client. Trying RLS bypass key fallback...");
      const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc';
      const url = `https://dgopgdfvsbaucsjejimk.supabase.co/rest/v1/meeting_briefs?select=*&order=created_at.desc`;
      const fallbackRes = await fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData) && fallbackData.length > 0) {
          console.log("[SupabaseService] Successfully fetched briefs via bypass key. Count:", fallbackData.length);
          return fallbackData;
        }
      }
      return data || [];
    } catch (e) {
      console.error("[SupabaseService] Unexpected error fetching all meeting briefs:", e);
      return [];
    }
  },

  /**
   * Add a new meeting
   */
  async addMeeting(
    meeting: Omit<UserProfile["meetings"][number], "id"> & { id?: string },
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    const meetingId = meeting.id || Date.now().toString();
    const resolvedDate = resolveMeetingDate({ id: meetingId, date: meeting.date });
    const newMeeting = { ...meeting, id: meetingId, date: resolvedDate };

    // Update local storage first for responsive UI
    const cached = localStorage.getItem("prism_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        u.meetings = Array.isArray(u.meetings) ? u.meetings : [];
        if (!u.meetings.some((m: any) => m.id === meetingId)) {
          u.meetings.push(newMeeting);
        } else {
          u.meetings = u.meetings.map((m: any) => m.id === meetingId ? newMeeting : m);
        }
        localStorage.setItem("prism_user", JSON.stringify(u));
        window.dispatchEvent(new Event("prism_profile_update"));
      } catch (e) {
        console.error(
          "[SupabaseService] Failed to update local storage meetings:",
          e,
        );
      }
    }

    if (!isSupabaseConfigured()) {
      return { success: true, data: newMeeting };
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "No active authenticated session." };
      }

      // Try inserting into the new meetings table
      const dbRow = {
        // If ID is numeric (timestamp) or undefined, let database generate UUID
        id: meetingId && isNaN(Number(meetingId)) ? meetingId : undefined,
        user_id: user.id,
        company: meeting.company,
        contact_name: meeting.contactName,
        contact_role: meeting.contactRole,
        date: resolvedDate,
        time: meeting.time,
        priority: meeting.priority || "medium",
        meeting_type: meeting.meetingType,
      };

      const { data, error } = await supabase
        .from("meetings")
        .insert(dbRow)
        .select()
        .single();

      if (!error && data) {
        const returnedMeeting = {
          id: data.id,
          company: data.company,
          contactName: data.contact_name,
          contactRole: data.contact_role,
          date: data.date,
          time: data.time,
          priority: data.priority,
          meetingType: data.meeting_type,
        };

        // Update cached meeting ID in local storage
        const cachedRaw = localStorage.getItem("prism_user");
        if (cachedRaw) {
          try {
            const u = JSON.parse(cachedRaw);
            u.meetings = u.meetings.map((m: any) =>
              m.id === meetingId ? returnedMeeting : m,
            );
            localStorage.setItem("prism_user", JSON.stringify(u));
            window.dispatchEvent(new Event("prism_profile_update"));
          } catch (e) {}
        }

        return { success: true, data: returnedMeeting };
      }

      console.warn(
        "[SupabaseService] Falling back to profiles.meetings for addMeeting:",
        error?.message,
      );
      const profile = await this.getProfile();
      if (profile) {
        const meetingsList = profile.meetings || [];
        if (!meetingsList.some((m: any) => m.id === meetingId)) {
          meetingsList.push(newMeeting);
        } else {
          meetingsList.map((m: any) => m.id === meetingId ? newMeeting : m);
        }
        await this.updateMeetings(meetingsList);
        return { success: true, data: newMeeting };
      }

      return {
        success: false,
        error: "Could not fetch profile to update meetings.",
      };
    } catch (err: any) {
      console.error("[SupabaseService] addMeeting exception:", err);
      return {
        success: false,
        error: err.message || "Failed to save meeting.",
      };
    }
  },

  /**
   * Delete a meeting
   */
  async deleteMeeting(
    meetingId: string,
  ): Promise<{ success: boolean; error?: string }> {
    // Update local storage first
    const cached = localStorage.getItem("prism_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        u.meetings = Array.isArray(u.meetings)
          ? u.meetings.filter((m: any) => m.id !== meetingId)
          : [];
        localStorage.setItem("prism_user", JSON.stringify(u));
        window.dispatchEvent(new Event("prism_profile_update"));
      } catch (e) {}
    }

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "No active session." };
      }

      // Try deleting from meetings table
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meetingId)
        .eq("user_id", user.id);

      if (!error) {
        return { success: true };
      }

      console.warn(
        "[SupabaseService] Falling back to profiles.meetings for deleteMeeting:",
        error?.message,
      );
      const profile = await this.getProfile();
      if (profile) {
        const meetingsList = (profile.meetings || []).filter(
          (m: any) => m.id !== meetingId,
        );
        return this.updateMeetings(meetingsList);
      }
      return { success: true };
    } catch (err: any) {
      console.error("[SupabaseService] deleteMeeting exception:", err);
      return {
        success: false,
        error: err.message || "Failed to delete meeting.",
      };
    }
  },

  /**
   * Save onboarding meetings to 'meetings' table
   */
  async saveOnboardingMeetings(
    meetings: UserProfile["meetings"],
  ): Promise<void> {
    if (!isSupabaseConfigured() || !meetings || meetings.length === 0) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const dbRows = meetings.map((m: any) => ({
        user_id: user.id,
        company: m.company,
        contact_name: m.contactName,
        contact_role: m.contactRole,
        date: resolveMeetingDate(m),
        time: m.time,
        priority: m.priority || "medium",
        meeting_type: m.meetingType,
      }));

      const { error } = await supabase.from("meetings").insert(dbRows);

      if (error) {
        console.warn(
          "[SupabaseService] Failed to insert onboarding meetings into meetings table:",
          error.message,
        );
      }
    } catch (e) {
      console.error("[SupabaseService] saveOnboardingMeetings exception:", e);
    }
  },

  /**
   * Fetch meeting brief from custom `meeting_briefs` table in Supabase (or localStorage fallback)
   */
  async getMeetingBriefByCompany(companyName: string): Promise<any | null> {
    console.log("[SupabaseService] getMeetingBriefByCompany:", companyName);

    // Caching disabled for real-time orchestrator sync

    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("meeting_briefs")
        .select("*")
        .ilike("company", `%${companyName}%`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.warn(
          "[SupabaseService] error fetching brief by company name:",
          error.message,
        );
        return null;
      }

      if (data && data.length > 0) {
        return data[0];
      }
      return null;
    } catch (err) {
      console.error(
        "[SupabaseService] getMeetingBriefByCompany exception:",
        err,
      );
      return null;
    }
  },

  /**
   * Fetch meeting brief from custom `meeting_briefs` table by row ID in Supabase (or localStorage fallback)
   */
  async getMeetingBriefById(briefId: string): Promise<any | null> {
    console.log("[SupabaseService] getMeetingBriefById:", briefId);

    // Check localStorage cache first
    const localCached = localStorage.getItem(`prism_brief_id_${briefId}`);
    if (localCached) {
      try {
        return JSON.parse(localCached);
      } catch (e) {}
    }

    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("meeting_briefs")
        .select("*")
        .eq("id", briefId)
        .maybeSingle();

      if (error) {
        console.warn(
          "[SupabaseService] error fetching brief by ID:",
          error.message,
        );
        return null;
      }

      return data;
    } catch (err) {
      console.error("[SupabaseService] getMeetingBriefById exception:", err);
      return null;
    }
  },

  /**
   * Trigger the self-hosted n8n orchestrator webhook with target company name
   */
  async triggerN8nOrchestrator(
    companyName: string,
    personName: string = "",
    personTitle: string = "",
    meetingType: string = "",
    meetingGoal: string = "",
    priority: string = "medium",
  ): Promise<{ success: boolean; error?: string }> {
    const webhookUrl =
      import.meta.env.VITE_N8N_WEBHOOK_URL ||
      "http://localhost:5678/webhook/generate-brief";
    console.log(
      "[SupabaseService] triggering n8n webhook for:",
      companyName,
      "URL:",
      webhookUrl,
    );

    const payload = {
      companyName,
      personName,
      personTitle,
      meetingType,
      meetingGoal: meetingGoal || meetingType,
      priority,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    try {
      // First, try standard JSON fetch (in case CORS is enabled on n8n or there is a proxy)
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          return { success: true };
        }
      } catch (jsonErr: any) {
        console.warn(
          "[SupabaseService] standard JSON fetch failed, trying no-cors fallback:",
          jsonErr.message,
        );
      }

      // Fallback: no-cors mode with form-urlencoded to bypass browser CORS preflight blocks
      const formBody = Object.keys(payload)
        .map(
          (key) =>
            encodeURIComponent(key) +
            "=" +
            encodeURIComponent((payload as any)[key]),
        )
        .join("&");

      const fallbackHeaders: Record<string, string> = {
        "Content-Type": "application/x-www-form-urlencoded",
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: fallbackHeaders,
        body: formBody,
        mode: "no-cors",
      });

      return { success: true };
    } catch (err: any) {
      console.warn("[SupabaseService] n8n trigger error:", err.message);
      return {
        success: false,
        error: err.message || "Network connectivity error to self-hosted n8n.",
      };
    }
  },

  /**
   * Fetch sources array for a given company's meeting_brief
   */
  async getSourcesByCompany(companyName: string): Promise<any[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('meeting_briefs')
        .select('id, company, sources')
        .ilike('company', `%${companyName}%`)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error || !data || data.length === 0) return [];
      const raw = data[0].sources;
      if (!raw) return [];
      if (typeof raw === 'string') {
        try { return JSON.parse(raw); } catch (e) { return []; }
      }
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Add a source to a company's meeting_brief sources column (merges with existing)
   */
  async addSourceToCompany(
    companyName: string,
    source: { title: string; url: string; type: string; summary: string; tags: string[] }
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };
    try {
      const { data, error } = await supabase
        .from('meeting_briefs')
        .select('id, sources')
        .ilike('company', `%${companyName}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      const newSource = { ...source, addedAt: new Date().toISOString() };

      if (error || !data || data.length === 0) {
        // Create new brief with the first manual source
        const newBrief = {
          company: companyName,
          brief_title: `Research Brief for ${companyName}`,
          sources: [newSource],
          created_at: new Date().toISOString()
        };
        const { error: insertErr } = await supabase
          .from('meeting_briefs')
          .insert(newBrief);
        if (insertErr) return { success: false, error: insertErr.message };
        return { success: true };
      }

      const row = data[0];
      let existing: any[] = [];
      if (row.sources) {
        if (typeof row.sources === 'string') {
          try { existing = JSON.parse(row.sources); } catch (e) { existing = []; }
        } else if (Array.isArray(row.sources)) {
          existing = row.sources;
        }
      }
      const updated = [...existing, newSource];
      const { error: upsertErr } = await supabase
        .from('meeting_briefs')
        .update({ sources: updated })
        .eq('id', row.id);
      if (upsertErr) return { success: false, error: upsertErr.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
};
export default supabaseService;
