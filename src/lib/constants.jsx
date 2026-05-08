import { 
  Car, 
  Home, 
  Gamepad2, 
  ShoppingBag, 
  Stethoscope, 
  Banknote, 
  Box,
  GraduationCap,
  BookOpen,
  Utensils
} from 'lucide-react';
import React from 'react';

export const CATEGORIES = [
  { id: 'universities', label: 'Universidades/Maestrias', icon: <GraduationCap className="w-4 h-4" />, emoji: '🎓', color: 'text-indigo-400', bgColor: 'bg-indigo-400/10', borderColor: 'border-indigo-400/20' },
  { id: 'institutes', label: 'PreAcademia/Institutos', icon: <BookOpen className="w-4 h-4" />, emoji: '🏫', color: 'text-cyan-400', bgColor: 'bg-cyan-400/10', borderColor: 'border-cyan-400/20' },
  { id: 'food', label: 'Comida y Restaurantes', icon: <Utensils className="w-4 h-4" />, emoji: '🍔', color: 'text-orange-400', bgColor: 'bg-orange-400/10', borderColor: 'border-orange-400/20' },
  { id: 'transport', label: 'Transporte', icon: <Car className="w-4 h-4" />, emoji: '🚗', color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400/20' },
  { id: 'home', label: 'Hogar y Servicios', icon: <Home className="w-4 h-4" />, emoji: '🏠', color: 'text-slate-400', bgColor: 'bg-slate-400/10', borderColor: 'border-slate-400/20' },
  { id: 'entertainment', label: 'Entretenimiento', icon: <Gamepad2 className="w-4 h-4" />, emoji: '🎮', color: 'text-purple-400', bgColor: 'bg-purple-400/10', borderColor: 'border-purple-400/20' },
  { id: 'shopping', label: 'Compras', icon: <ShoppingBag className="w-4 h-4" />, emoji: '🛍️', color: 'text-pink-400', bgColor: 'bg-pink-400/10', borderColor: 'border-pink-400/20' },
  { id: 'health', label: 'Salud', icon: <Stethoscope className="w-4 h-4" />, emoji: '🏥', color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20' },
  { id: 'salary', label: 'Salario', icon: <Banknote className="w-4 h-4" />, emoji: '💰', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/20' },
  { id: 'other', label: 'Otros', icon: <Box className="w-4 h-4" />, emoji: '📦', color: 'text-slate-400', bgColor: 'bg-slate-400/10', borderColor: 'border-slate-400/20' },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});
