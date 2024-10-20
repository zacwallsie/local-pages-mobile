import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"

// These variables are safe to expose as we employ RLS
const supabaseUrl = "https://cmmeuvftpavdmeefgxvk.supabase.co"
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbWV1dmZ0cGF2ZG1lZWZneHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2ODg3NTEsImV4cCI6MjA0MTI2NDc1MX0.Kdkikemx40zhiEduugvtOw6xdb8LpxhWinA_lOsljqA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
})
