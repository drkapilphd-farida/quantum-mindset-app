import {
  BatteryCharging, Brain, CalendarCheck, CalendarDays, CloudMoon, Crosshair, Eye, Feather, Flame, Focus, Footprints, Gauge, HandHeart, Headphones,
  Heart, HeartHandshake, Hourglass, House, Infinity as InfinityIcon, Layers, Leaf, Lightbulb, ListChecks, ListOrdered, Moon, Mountain, Orbit, Palette,
  Puzzle, Rocket, Scale, ScanEye, ScanLine, Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, Sprout, Sun, Sunrise, Target, Timer, TreePine,
  TrendingUp, Unlink, Users, Waves, Wind, Zap, type LucideIcon,
} from 'lucide-react'
import type { ProgramSlug } from './types'

// "What changes for you" (conversion brief, Nov 2026): one simple line icon
// per card, matching its text, in the same order as each program's
// `changes` list. No icon repeats on a page.
export const CHANGE_ICONS: Record<ProgramSlug, [LucideIcon, LucideIcon, LucideIcon, LucideIcon, LucideIcon]> = {
  // breath · thoughts slow down · sleep · energy · own meditations
  'stress-anxiety-support': [Wind, Brain, Moon, BatteryCharging, Headphones],
  // goals · confidence to act · less overthinking, more action · daily habits · each morning
  'mindset-coaching': [Target, Rocket, Footprints, CalendarCheck, Sunrise],
  // discover beliefs · new beliefs grow · old reactions lose grip · money, relationships, self-worth · before sleep
  'subconscious-reprogramming': [Search, Sprout, Unlink, HeartHandshake, Moon],
  // peace · clear thinking · own judgement · relationships · hard days
  'business-loss-mindset': [HandHeart, Lightbulb, Scale, Users, Headphones],
  // focused mind · sensitivity · share intentions · warmth · practice recordings
  telepathy: [Focus, Waves, Send, Heart, Headphones],
  // calm in minutes · patience · courage · connection · recordings
  'heart-brain-coherence': [Timer, Hourglass, Mountain, HeartHandshake, Headphones],
  // clarity · hold intention · higher state · focused action · recordings
  manifestation: [Eye, Crosshair, Sparkles, Footprints, Headphones],
  // calm, alert · control · entry/exit timing · discipline · pre-market routine
  'intuition-for-traders': [Gauge, ShieldCheck, TrendingUp, ListChecks, Headphones],
  // close to the divine · filled with energy · higher state · stillness · recordings
  'cosmic-fusion': [Sun, Zap, Orbit, Feather, Headphones],
  // subtle perception · aura colours · body scanning · people's state of mind · recordings
  'aura-reading': [ScanEye, Palette, ScanLine, Users, Headphones],
  // prana moving · balance · foundation · awareness · recordings
  'chakra-activation': [Waves, Scale, Layers, Eye, Headphones],
  // longer stillness · beyond thought · deep rest · peace · recordings
  'samadhi-meditation': [Hourglass, InfinityIcon, Moon, Leaf, Headphones],
  // prepared breath · awakening energy · awareness · adjusted practice · recordings
  'kundalini-meditation': [Wind, Flame, Eye, SlidersHorizontal, Headphones],
  // relaxation with awareness · stages · less fear · consciousness · recordings
  'astral-projection': [CloudMoon, ListOrdered, ShieldCheck, Orbit, Headphones],
  // full days · programs combined · rest away · plan at home · recordings to take home
  'personal-retreat': [CalendarDays, Puzzle, TreePine, House, Headphones],
}
