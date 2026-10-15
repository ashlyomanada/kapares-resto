<script setup lang="ts">
interface OrderState {
  name: string
  order: string
  quantity: number | undefined
  address: string
  phone: string
  additionalFood: string
  dateTime: string
  message: string
}

const formState = reactive<OrderState>({
  name: '',
  order: '',
  quantity: 1,
  address: '',
  phone: '',
  additionalFood: '',
  dateTime: '',
  message: ''
})

const isSuccessModalOpen = ref(false)
const submittedOrder = ref<OrderState | null>(null)

const handleSubmit = () => {
  submittedOrder.value = { ...formState }
  isSuccessModalOpen.value = true
  // Reset
  formState.name = ''
  formState.order = ''
  formState.quantity = 1
  formState.address = ''
  formState.phone = ''
  formState.additionalFood = ''
  formState.dateTime = ''
  formState.message = ''
}
</script>

<template>
  <section
    id="order"
    class="min-h-screen w-full bg-[#2b1e1a] py-16 px-6 md:px-12 flex flex-col items-center justify-center gap-10"
  >
    <div class="text-center space-y-2">
      <h3 class="text-lg md:text-xl font-medium text-stone-300">Order Now</h3>
      <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white">
        Free and Fast
      </h1>
    </div>

    <!-- Form container matching the original 2-column split box -->
    <div class="w-full max-w-4xl shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] rounded-2xl overflow-hidden bg-[#1b1514]">
      <form class="grid grid-cols-1 md:grid-cols-2 p-6 md:p-8 gap-8" @submit.prevent="handleSubmit">
        <!-- Column 1 -->
        <div class="flex flex-col gap-4">
          <div class="space-y-1.5">
            <label class="text-xs uppercase tracking-wide text-stone-200 font-semibold">Your Name</label>
            <UInput
              v-model="formState.name"
              placeholder="enter your name"
              required
              class="w-full bg-white text-black rounded-lg"
              :ui="{ base: 'bg-white text-black' }"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs uppercase tracking-wide text-stone-200 font-semibold">Your Order</label>
            <UInput
              v-model="formState.order"
              placeholder="enter food name"
              required
              class="w-full bg-white text-black rounded-lg"
              :ui="{ base: 'bg-white text-black' }"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs uppercase tracking-wide text-stone-200 font-semibold">How Much</label>
            <UInput
              v-model="formState.quantity"
              type="number"
              min="1"
              placeholder="how many orders"
              required
              class="w-full bg-white text-black rounded-lg"
              :ui="{ base: 'bg-white text-black' }"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs uppercase tracking-wide text-stone-200 font-semibold">Your Address</label>
            <UTextarea
              v-model="formState.address"
              placeholder="enter your address"
              rows="4"
              required
              class="w-full bg-white text-black rounded-lg"
              :ui="{ base: 'bg-white text-black' }"
            />
          </div>

          <div class="pt-2">
            <UButton
              type="submit"
              color="primary"
              size="lg"
              class="w-full md:w-36 bg-[#c46e3e] hover:bg-[#1b1514] text-white font-bold py-2.5 rounded-xl border-2 border-white shadow-md hover:shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] transition-all cursor-pointer flex items-center justify-center"
            >
              ORDER NOW
            </UButton>
          </div>
        </div>

        <!-- Column 2 -->
        <div class="flex flex-col gap-4">
          <div class="space-y-1.5">
            <label class="text-xs uppercase tracking-wide text-stone-200 font-semibold">Your Number</label>
            <UInput
              v-model="formState.phone"
              type="tel"
              placeholder="enter your number"
              required
              class="w-full bg-white text-black rounded-lg"
              :ui="{ base: 'bg-white text-black' }"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs uppercase tracking-wide text-stone-200 font-semibold">Additional Food</label>
            <UInput
              v-model="formState.additionalFood"
              placeholder="enter additional food"
              class="w-full bg-white text-black rounded-lg"
              :ui="{ base: 'bg-white text-black' }"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs uppercase tracking-wide text-stone-200 font-semibold">Date And Time</label>
            <UInput
              v-model="formState.dateTime"
              type="datetime-local"
              class="w-full bg-white text-black rounded-lg"
              :ui="{ base: 'bg-white text-black' }"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs uppercase tracking-wide text-stone-200 font-semibold">Your Message</label>
            <UTextarea
              v-model="formState.message"
              placeholder="enter your message"
              rows="4"
              class="w-full bg-white text-black rounded-lg"
              :ui="{ base: 'bg-white text-black' }"
            />
          </div>
        </div>
      </form>
    </div>

    <!-- Order Placed Success Modal -->
    <UModal v-model:open="isSuccessModalOpen" title="Order Received!">
      <template #content>
        <div class="p-6 bg-[#1b1514] text-white rounded-xl space-y-4">
          <div class="text-center space-y-2">
            <div class="w-12 h-12 bg-green-900/60 text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 class="text-xl font-bold">Order Received!</h3>
            <p class="text-xs text-stone-300">Thank you, {{ submittedOrder?.name }}! Your order is being prepared.</p>
          </div>

          <div class="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs space-y-1.5">
            <p><span class="text-stone-400">Order:</span> {{ submittedOrder?.order }} (Qty: {{ submittedOrder?.quantity }})</p>
            <p v-if="submittedOrder?.additionalFood"><span class="text-stone-400">Additional:</span> {{ submittedOrder?.additionalFood }}</p>
            <p><span class="text-stone-400">Delivery Address:</span> {{ submittedOrder?.address }}</p>
            <p><span class="text-stone-400">Contact:</span> {{ submittedOrder?.phone }}</p>
          </div>

          <div class="flex justify-end pt-2">
            <UButton color="primary" class="bg-[#c46e3e] text-white" @click="isSuccessModalOpen = false">Done</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </section>
</template>
