import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  favorites: string[]
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id) => set((state) => {
        if (!state.favorites.includes(id)) {
          return { favorites: [...state.favorites, id] }
        }
        return state
      }),
      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter(favId => favId !== id)
      })),
      isFavorite: (id) => get().favorites.includes(id),
    }),
    {
      name: 'kurasiniche:favorites',
    }
  )
)
