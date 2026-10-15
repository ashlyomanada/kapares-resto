export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export const useCart = () => {
  const items = useState<CartItem[]>('cart_items', () => [])
  const isCartOpen = useState<boolean>('cart_open', () => false)

  const addToCart = (product: { name: string; price: number; image: string }) => {
    const existing = items.value.find(i => i.name === product.name)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({
        id: product.name,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }
  }

  const removeFromCart = (name: string) => {
    items.value = items.value.filter(i => i.name !== name)
  }

  const totalCount = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((acc, i) => acc + (i.price * i.quantity), 0))

  return {
    items,
    isCartOpen,
    addToCart,
    removeFromCart,
    totalCount,
    totalPrice
  }
}
