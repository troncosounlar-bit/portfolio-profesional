// src/app/hooks/useAdminData.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/client";

import {
  getStyleSettings,
  updateStyleSettings,
  getHeroData,
  updateHeroData,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getStats,
  updateStat,
  getAllSkillsWithCategories,
  createSkill,
  updateSkill,
  deleteSkill,
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  getAboutData,
  updateAboutData,
  getWorkPhilosophy,
  createWorkPhilosophy,
  updateWorkPhilosophy,
  deleteWorkPhilosophy,
  getContactSubmissions,
  deleteContactSubmission,
  updateContactSubmission,
  uploadImage,
  getPageViewsCount, // IMPORTANTE: Nueva función añadida
} from "@/app/lib/services";

import type {
  StyleSettings,
  HeroData,
  Experience,
  Project,
  Stat,
  Skill,
  Technology,
  AboutData,
  WorkPhilosophy,
  ContactSubmission,
} from "@/app/lib/types";

import { fallbackData } from "@/app/lib/fallbackData";
import { checkAdminLogin } from "@/app/lib/adminAuth";
import { getOfflineData, updateSpecificKey, getPendingSyncData } from "@/app/lib/offlineStorage";
import {
  isAuthenticated as isOfflineAuthenticated,
  logout as logoutOffline,
} from "@/app/lib/secureAuth";

export const useAdminData = () => {
  // --- AUTH & UI STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSystemOnline, setIsSystemOnline] = useState(false);
  const [activeTab, setActiveTab] = useState("style");
  const [authError, setAuthError] = useState("");

  // --- DATA STATES ---
  const [styleSettings, setStyleSettings] = useState<StyleSettings>(fallbackData.styleSettings as StyleSettings);
  const [heroData, setHeroData] = useState<HeroData | null>(fallbackData.heroData);
  const [experiences, setExperiences] = useState<Experience[]>(fallbackData.experiences);
  const [projects, setProjects] = useState<Project[]>(fallbackData.projects);
  const [stats, setStats] = useState<Stat[]>(fallbackData.stats);
  
  // CORRECCIÓN: Ahora es un estado reactivo que inicia con el fallback (que debería ser 129 o 0)
  const [pageViews, setPageViews] = useState<number>(fallbackData.pageViews);
  
  const [skillCategories, setSkillCategories] = useState<any[]>(fallbackData.skillCategories);
  const [technologies, setTechnologies] = useState<Technology[]>(fallbackData.technologies);
  const [aboutData, setAboutData] = useState<AboutData | null>(fallbackData.aboutData);
  const [workPhilosophy, setWorkPhilosophy] = useState<WorkPhilosophy[]>(fallbackData.workPhilosophy);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);

  // --- UI EDITING STATES ---
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [selectedCategoryForNewSkill, setSelectedCategoryForNewSkill] = useState<string>("");
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);
  const [isAddingTechnology, setIsAddingTechnology] = useState(false);
  const [editingPhilosophy, setEditingPhilosophy] = useState<WorkPhilosophy | null>(null);
  const [isAddingPhilosophy, setIsAddingPhilosophy] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  // 1. CARGA INICIAL
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error: healthError } = await supabase.from("hero_data").select("id").limit(1);
      if (healthError) throw new Error("Database Offline");

      const results = await Promise.allSettled([
        getStyleSettings(), getHeroData(), getExperiences(),
        getProjects(), getStats(), getAllSkillsWithCategories(),
        getTechnologies(), getAboutData(), getWorkPhilosophy(),
        getContactSubmissions(),
        getPageViewsCount(), // Posición 10
      ]);

      setIsSystemOnline(true);

      const getValue = (index: number, fallback: any) => {
        const res = results[index];
        return res.status === "fulfilled" && res.value !== null ? res.value : fallback;
      };

      const data = {
        styleSettings: getValue(0, fallbackData.styleSettings),
        heroData: getValue(1, fallbackData.heroData),
        experiences: getValue(2, fallbackData.experiences),
        projects: getValue(3, fallbackData.projects),
        stats: getValue(4, fallbackData.stats),
        skillCategories: getValue(5, fallbackData.skillCategories),
        technologies: getValue(6, fallbackData.technologies),
        aboutData: getValue(7, fallbackData.aboutData),
        workPhilosophy: getValue(8, fallbackData.workPhilosophy),
        pageViews: getValue(10, fallbackData.pageViews),
      };

      setStyleSettings(data.styleSettings);
      setHeroData(data.heroData);
      setExperiences(data.experiences);
      setProjects(data.projects);
      setStats(data.stats);
      setSkillCategories(data.skillCategories);
      setTechnologies(data.technologies);
      setAboutData(data.aboutData);
      setWorkPhilosophy(data.workPhilosophy);
      setMessages(getValue(9, []));
      setPageViews(data.pageViews);

      // Actualizamos LocalStorage con los datos reales de la DB para el futuro modo offline
      Object.entries(data).forEach(([key, value]) => updateSpecificKey(key as any, value));

    } catch (error) {
      console.error("Cargando modo Offline:", error);
      setIsSystemOnline(false);
      const localData = getOfflineData();
      if (localData) {
        setStyleSettings(localData.styleSettings as StyleSettings);
        setHeroData(localData.heroData);
        setExperiences(localData.experiences);
        setProjects(localData.projects);
        setStats(localData.stats);
        setSkillCategories(localData.skillCategories);
        setTechnologies(localData.technologies);
        setAboutData(localData.aboutData);
        setWorkPhilosophy(localData.workPhilosophy);
        // El pageViews también se recupera del local si existe
        if ((localData as any).pageViews !== undefined) {
          setPageViews((localData as any).pageViews);
        }
      }
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. WRAPPER PARA ACCIONES ASÍNCRONAS
  const withAsync = async (fn: () => Promise<void>, successMsg?: string) => {
    try {
      await fn();
      if (successMsg) alert(`✅ ${successMsg}`);
    } catch (error: any) {
      const errorMsg = error.message?.includes('fetch') 
        ? 'Sin conexión: Guardado solo en local.' 
        : (error.message || "Operación fallida");
      alert(`⚠️ ${errorMsg}`);
    }
  };

  useEffect(() => {
    const checkInitialAuth = async () => {
      if (isOfflineAuthenticated()) {
        setIsAuthenticated(true);
        loadAllData();
        return;
      }
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthenticated(true);
          loadAllData();
        } else {
          const { error } = await supabase.from("hero_data").select("id").limit(1);
          setIsSystemOnline(!error);
        }
      } catch (e) {
        setIsSystemOnline(false);
      }
    };
    checkInitialAuth();
  }, [loadAllData]);

  const actions = {
    handleLogin: async (email: string, pass: string) => {
      setIsLoading(true);
      setAuthError("");
      const result = await checkAdminLogin(email, pass);
      if (result.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setAuthError(result.message || "Credenciales incorrectas");
      }
      setIsLoading(false);
    },

    handleLogout: async () => {
      try { await supabase.auth.signOut(); } catch (e) {}
      logoutOffline();
      setIsAuthenticated(false);
    },

    syncOfflineChanges: async () => {
      if (!isSystemOnline) {
        alert("⚠️ No puedes sincronizar mientras estés offline.");
        return;
      }

      setIsLoading(true);
      try {
        const pending = getPendingSyncData();
        let syncCount = 0;

        for (const exp of (pending.experiences || [])) {
          const { id, ...dataToSave } = exp;
          await createExperience(dataToSave as any);
          syncCount++;
        }

        for (const proj of (pending.projects || [])) {
          const { id, ...dataToSave } = proj;
          await createProject(dataToSave as any);
          syncCount++;
        }

        if (syncCount > 0) {
          alert(`✅ Sincronización exitosa: ${syncCount} elementos subidos.`);
          await loadAllData(); 
        } else {
          alert("ℹ️ No hay cambios nuevos para sincronizar.");
        }
      } catch (error) {
        console.error("Error en sincronización:", error);
        alert("❌ Error crítico durante la sincronización.");
      } finally {
        setIsLoading(false);
      }
    },

    handleHeroImageUpload: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !heroData) return;

      if (!isSystemOnline) {
        alert("⚠️ No puedes subir imágenes en modo Offline.");
        return;
      }

      setUploadingHeroImage(true);
      try {
        const url = await uploadImage(file, "avatars");
        if (url) {
          const updatedHero = { ...heroData, profile_image_url: url };
          setHeroData(updatedHero);
          updateSpecificKey("heroData", updatedHero);
          alert("✅ Imagen subida y vinculada.");
        }
      } catch (error) {
        console.error(error);
        alert("❌ Error al subir la imagen");
      } finally {
        setUploadingHeroImage(false);
      }
    },

    saveStyleSettings: (s: StyleSettings) =>
      withAsync(async () => {
        if (isSystemOnline) await updateStyleSettings(s);
        setStyleSettings(s);
        updateSpecificKey("styleSettings", s);
      }, "Estilo actualizado"),

    saveHeroData: () =>
      withAsync(async () => {
        if (heroData) {
          if (isSystemOnline) await updateHeroData(heroData);
          updateSpecificKey("heroData", heroData);
        }
      }, "Hero guardado"),

    handleSaveStat: (stat: Stat) =>
      withAsync(async () => {
        if (stat.id) {
          if (isSystemOnline) await updateStat(stat.id, stat);
          const newStats = stats.map((s) => (s.id === stat.id ? stat : s));
          setStats(newStats);
          updateSpecificKey("stats", newStats);
        }
      }, "Estadística guardada"),

    handleSaveExperience: (exp: Experience) =>
      withAsync(async () => {
        let updatedList: Experience[];
        if (exp.id && !exp.id.startsWith('offline-')) {
          if (isSystemOnline) await updateExperience(exp.id, exp);
          updatedList = experiences.map(e => e.id === exp.id ? exp : e);
        } else {
          const tempId = exp.id || `offline-${Date.now()}`;
          const newExp = { ...exp, id: tempId };
          if (isSystemOnline) await createExperience(exp);
          updatedList = [...experiences, newExp];
        }
        setExperiences(updatedList);
        updateSpecificKey("experiences", updatedList);
        setEditingExperience(null);
        setIsAddingExperience(false);
        if (isSystemOnline) loadAllData();
      }, "Experiencia guardada"),

    handleDeleteExperience: (id: string) =>
      withAsync(async () => {
        if (!confirm("¿Borrar experiencia?")) return;
        if (isSystemOnline && !id.startsWith('offline-')) await deleteExperience(id);
        const newList = experiences.filter((e) => e.id !== id);
        setExperiences(newList);
        updateSpecificKey("experiences", newList);
      }),

    handleSaveProject: (proj: Project) =>
      withAsync(async () => {
        let newList: Project[];
        if (proj.id && !proj.id.startsWith('offline-')) {
          if (isSystemOnline) await updateProject(proj.id, proj);
          newList = projects.map(p => p.id === proj.id ? proj : p);
        } else {
          const newProj = { ...proj, id: proj.id || `offline-${Date.now()}` };
          if (isSystemOnline) await createProject(proj);
          newList = [...projects, newProj];
        }
        setProjects(newList);
        updateSpecificKey("projects", newList);
        setEditingProject(null);
        setIsAddingProject(false);
        if (isSystemOnline) loadAllData();
      }, "Proyecto guardado"),

    handleDeleteProject: (id: string) =>
      withAsync(async () => {
        if (!confirm("¿Borrar proyecto?")) return;
        if (isSystemOnline && !id.startsWith('offline-')) await deleteProject(id);
        const newList = projects.filter((p) => p.id !== id);
        setProjects(newList);
        updateSpecificKey("projects", newList);
      }),

    handleSaveTechnology: (tech: Technology) =>
      withAsync(async () => {
        let newList: Technology[];
        if (tech.id && !tech.id.startsWith('offline-')) {
          if (isSystemOnline) await updateTechnology(tech.id, tech);
          newList = technologies.map(t => t.id === tech.id ? tech : t);
        } else {
          const newTech = { ...tech, id: tech.id || `offline-${Date.now()}` };
          if (isSystemOnline) await createTechnology(tech);
          newList = [...technologies, newTech];
        }
        setTechnologies(newList);
        updateSpecificKey("technologies", newList);
        setEditingTechnology(null);
        setIsAddingTechnology(false);
        if (isSystemOnline) loadAllData();
      }, "Tecnología guardada"),

    handleDeleteTechnology: (id: string) =>
      withAsync(async () => {
        if (!confirm("¿Borrar tecnología?")) return;
        if (isSystemOnline && !id.startsWith('offline-')) await deleteTechnology(id);
        const newList = technologies.filter((t) => t.id !== id);
        setTechnologies(newList);
        updateSpecificKey("technologies", newList);
      }),

    handleSaveSkill: (skill: Skill) =>
      withAsync(async () => {
        let updatedCategories = [...skillCategories];
        if (skill.id && !skill.id.startsWith('offline-')) {
          if (isSystemOnline) await updateSkill(skill.id, skill);
          updatedCategories = skillCategories.map(cat => ({
            ...cat,
            skills: cat.skills.map((s: Skill) => s.id === skill.id ? skill : s)
          }));
        } else {
          const newSkill = { ...skill, id: skill.id || `offline-${Date.now()}` };
          if (isSystemOnline) await createSkill(skill);
          updatedCategories = skillCategories.map(cat => {
            if (cat.id === skill.category_id) {
              return { ...cat, skills: [...cat.skills, newSkill] };
            }
            return cat;
          });
        }
        setSkillCategories(updatedCategories);
        updateSpecificKey("skillCategories", updatedCategories);
        setEditingSkill(null);
        setIsAddingSkill(false);
        if (isSystemOnline) loadAllData();
      }, "Habilidad guardada"),

    handleDeleteSkill: (id: string) =>
      withAsync(async () => {
        if (!confirm("¿Borrar habilidad?")) return;
        if (isSystemOnline && !id.startsWith('offline-')) await deleteSkill(id);
        const updatedCategories = skillCategories.map(cat => ({
          ...cat,
          skills: cat.skills.filter((s: Skill) => s.id !== id)
        }));
        setSkillCategories(updatedCategories);
        updateSpecificKey("skillCategories", updatedCategories);
      }),

    saveAboutData: () =>
      withAsync(async () => {
        if (aboutData) {
          if (isSystemOnline) await updateAboutData(aboutData);
          updateSpecificKey("aboutData", aboutData);
        }
      }, "Sección Sobre Mí actualizada"),

    handleSavePhilosophy: (phil: WorkPhilosophy) =>
      withAsync(async () => {
        let updatedList: WorkPhilosophy[];
        if (phil.id && !phil.id.startsWith('offline-')) {
          if (isSystemOnline) await updateWorkPhilosophy(phil.id, phil);
          updatedList = workPhilosophy.map(p => p.id === phil.id ? phil : p);
        } else {
          const newPhil = { ...phil, id: phil.id || `offline-${Date.now()}` };
          if (isSystemOnline) await createWorkPhilosophy(phil);
          updatedList = [...workPhilosophy, newPhil];
        }
        setWorkPhilosophy(updatedList);
        updateSpecificKey("workPhilosophy", updatedList);
        setEditingPhilosophy(null);
        setIsAddingPhilosophy(false);
        if (isSystemOnline) loadAllData();
      }, "Filosofía guardada"),

    handleDeletePhilosophy: (id: string) =>
      withAsync(async () => {
        if (!confirm("¿Borrar este valor?")) return;
        if (isSystemOnline && !id.startsWith('offline-')) await deleteWorkPhilosophy(id);
        const updatedList = workPhilosophy.filter(p => p.id !== id);
        setWorkPhilosophy(updatedList);
        updateSpecificKey("workPhilosophy", updatedList);
      }),

    handleDeleteMessage: async (id: string) => {
      if (!confirm("¿Borrar este mensaje?")) return;
      try {
        if (isSystemOnline) await deleteContactSubmission(id);
        const updatedMessages = messages.filter(m => m.id !== id);
        setMessages(updatedMessages);
        alert("✅ Mensaje eliminado");
      } catch (error) {
        console.error(error);
        alert("❌ Error al eliminar mensaje");
      }
    },

    handleMarkAsRead: async (id: string) => {
      try {
        // 1. Actualizar en Supabase si hay conexión
        if (isSystemOnline) {
          await updateContactSubmission(id, { is_read: true });
        }
        
        // 2. Actualizar estado local inmediatamente para el cambio visual
        const updatedMessages = messages.map(m => 
          m.id === id ? { ...m, is_read: true } : m
        );
        setMessages(updatedMessages);
        
        // Actualizar el almacenamiento offline también
        updateSpecificKey("messages" as any, updatedMessages);
      } catch (error) {
        console.error("Error al marcar mensaje como leído:", error);
      }
    },

    loadAllData,
  };

  return {
    isAuthenticated, isLoading, isSystemOnline, authError, activeTab, setActiveTab,
    state: {
      styleSettings, heroData, experiences, projects, stats, pageViews,
      skillCategories, technologies, aboutData, workPhilosophy, messages,
      editingExperience, isAddingExperience, editingProject, isAddingProject,
      editingSkill, isAddingSkill, selectedCategoryForNewSkill,
      editingTechnology, isAddingTechnology, editingPhilosophy, isAddingPhilosophy,
      uploadingHeroImage,
    },
    setters: {
      setStyleSettings, setHeroData, setEditingExperience, setIsAddingExperience,
      setEditingProject, setIsAddingProject, setEditingSkill, setIsAddingSkill,
      setSelectedCategoryForNewSkill, setEditingTechnology, setIsAddingTechnology,
      setEditingPhilosophy, setIsAddingPhilosophy, setAboutData, setStats, setWorkPhilosophy,
      setPageViews, // Útil si necesitas forzar una actualización manual
    },
    actions,
  };
};