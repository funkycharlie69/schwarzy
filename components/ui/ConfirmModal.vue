<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50"
        @click.self="onCancel"
      >
        <div class="w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-6 text-center">
            <h3 class="text-lg font-bold mb-2">{{ title }}</h3>
            <p class="text-foreground/70 text-sm leading-relaxed">{{ message }}</p>
          </div>

          <div class="border-t border-border grid grid-cols-2">
            <button
              @click="onCancel"
              class="py-4 text-base font-semibold text-foreground/60 hover:bg-foreground/5 active:bg-foreground/10 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="onConfirm"
              class="py-4 text-base font-bold border-l border-border transition-colors"
              :class="danger ? 'text-accent-red' : 'text-accent-green'"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  danger: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div {
  transform: translateY(100%);
}

.modal-leave-to > div {
  transform: translateY(100%);
}
</style>
