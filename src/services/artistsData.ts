// Artist data structure
export interface ArtistData {
  id: number;
  name: string;
  specialty: string;
  location: string;
  works: string;
  image: string;
  bio: string;
  artImages: string[];
  artTitles: string[];
}

export const artistsData: ArtistData[] = [
  {
    id: 0,
    name: "Unc Chen",
    specialty: "Abstract Art",
    location: "Nandora Hills, Kenya",
    works: "24 pieces",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Sarah Chen is a contemporary abstract artist known for her vibrant use of color and dynamic compositions. Her work explores the intersection of emotion and form, creating pieces that resonate with viewers on a deep level.",
    artImages: [
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=400&q=80",
    ],
    artTitles: [
      "Vibrant Dreams",
      "Color Symphony",
      "Abstract Harmony",
      "Emotional Flow",
      "Dynamic Balance",
      "Inner Light",
    ],
  },
  {
    id: 1,
    name: "Mildred Wanjiru",
    specialty: "Digital Art",
    location: "Karen, Kenya",
    works: "18 pieces",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Marcus Rivera combines traditional artistic techniques with cutting-edge digital technology. His work pushes the boundaries of what's possible in digital art, creating immersive experiences that challenge perception.",
    artImages: [
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
    ],
    artTitles: [
      "Digital Horizon",
      "Virtual Reality",
      "Pixel Dreams",
      "Tech Fusion",
      "Cyber Landscape",
      "Digital Essence",
    ],
  },
  {
    id: 2,
    name: "John Kimani",
    specialty: "Portrait Art",
    location: "Lang'ata, Kenya",
    works: "32 pieces",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Emma Thompson specializes in capturing the human spirit through portraiture. Her detailed work brings out the unique personality and emotion of each subject, creating timeless pieces that tell compelling stories.",
    artImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80",
    ],
    artTitles: [
      "The Thinker",
      "Silent Strength",
      "Eternal Gaze",
      "Inner Peace",
      "Portrait of Time",
      "Human Essence",
    ],
  },
  {
    id: 3,
    name: "Pablo Nganga",
    specialty: "Landscape Art",
    location: "Kiambu, Kenya",
    works: "28 pieces",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "James Wilson's landscape paintings transport viewers to serene natural settings. His mastery of light and color creates breathtaking scenes that celebrate the beauty of the natural world.",
    artImages: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
    ],
    artTitles: [
      "Mountain Vista",
      "Sunset Valley",
      "Forest Path",
      "Coastal Breeze",
      "Meadow Dreams",
      "River Serenity",
    ],
  },
  {
    id: 4,
    name: "Nelly Wanjiku",
    specialty: "Contemporary",
    location: "Kikuyu, Kenya",
    works: "21 pieces",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Luna Martinez creates contemporary art that reflects modern society. Her bold and innovative approach challenges conventional perspectives, making her work both thought-provoking and visually striking.",
    artImages: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=400&q=80",
    ],
    artTitles: [
      "Urban Pulse",
      "Modern Life",
      "City Lights",
      "Contemporary Flow",
      "Bold Statements",
      "New Perspectives",
    ],
  },
  {
    id: 5,
    name: "Omar Kibera",
    specialty: "Minimalist Art",
    location: "Kibera, Kenya",
    works: "19 pieces",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Alex Kim's minimalist approach strips art down to its essential elements. Through simplicity and precision, his work achieves profound beauty and meaning, inviting viewers to find peace in the unadorned.",
    artImages: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    ],
    artTitles: [
      "Simple Beauty",
      "Pure Form",
      "Essential Lines",
      "Minimal Essence",
      "Quiet Strength",
      "Subtle Harmony",
    ],
  },
];

